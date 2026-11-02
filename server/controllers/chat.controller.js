import { Trip } from "../models/index.js";
import { config } from "../config/env.js";

/** Request budget: caps token spend per call and keeps the prompt sane. */
const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 4000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

/**
 * Chat with AI Assistant using user's trips as context.
 * @route   POST /api/chat
 */
export const chatWithAssistant = async (req, res) => {
  try {
    const { messages } = req.body;

    // --- Input validation (shape, count, length, roles) --------------------
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ status: "error", message: "Messages array is required" });
    }
    if (messages.length > MAX_MESSAGES) {
      return res.status(400).json({ status: "error", message: `A conversation may contain at most ${MAX_MESSAGES} messages` });
    }
    const cleanedMessages = messages
      .filter(
        (m) =>
          m &&
          ALLOWED_ROLES.has(m.role) &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(0, MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

    if (cleanedMessages.length === 0) {
      return res.status(400).json({ status: "error", message: "No valid messages provided" });
    }

    if (!config.openrouter.apiKey) {
      return res.status(503).json({
        status: "error",
        message: "AI assistant is not configured. Please contact the administrator.",
      });
    }

    // Fetch user context
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      attributes: ['name', 'travelStatus', 'travelType', 'startDate', 'endDate', 'costs', 'itinerary', 'todos', 'packing']
    });

    // Create a compact string representation of the trips
    // (Array.isArray guards: JSON columns can hold malformed values)
    const contextData = trips.map(t => {
      const costs = Array.isArray(t.costs) ? t.costs : [];
      const todos = Array.isArray(t.todos) ? t.todos : [];
      const packing = Array.isArray(t.packing) ? t.packing : [];
      const costSum = costs.reduce((sum, c) => sum + (Number.isFinite(c?.amount) ? c.amount : 0), 0);
      return `Trip: ${t.name} (${t.travelStatus})
Type: ${t.travelType}
Dates: ${t.startDate || 'TBD'} to ${t.endDate || 'TBD'}
Total Cost: $${costSum}
Todos: ${todos.filter(todo => todo && todo.isDone === false).length} pending
Packing: ${packing.filter(p => p && p.isPacked === false).length} items pending
`;
    }).join("\n---\n");

    const systemPrompt = `You are "Pisey", a highly advanced, friendly, and proactive AI Travel Assistant integrated into the 'Self-Planning Travel Planner'.
Your goal is to help the user plan their trips, organize itineraries, calculate costs, and provide actionable travel advice.

**GUIDELINES:**
1. **Be Concise & Structured:** Use Markdown extensively (bolding, bullet points, numbered lists) to make your answers easy to read. Do not output massive walls of text.
2. **Contextual Awareness:** The user's current trips are provided below. Refer to them directly when relevant. If they ask about costs, sum them up accurately.
3. **Proactive Advice:** If a trip is missing packing items or a detailed itinerary, suggest some specific items based on the 'travelType'.
4. **Tone:** Enthusiastic, professional, and encouraging.

**USER'S CURRENT TRIPS CONTEXT:**
${contextData || "The user currently has no trips planned. Encourage them to create a new plan!"}
`;

    // Add the system prompt to the beginning of the messages array
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...cleanedMessages
    ];

    let response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.openrouter.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: config.openrouter.model,
          // Budget for full itineraries (tunable via OPENROUTER_MAX_TOKENS)
          max_tokens: config.openrouter.maxTokens,
          messages: apiMessages,
        }),
        // Never let a slow upstream hang the request forever
        signal: AbortSignal.timeout(config.openrouter.timeoutMs),
      });
    } catch (err) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return res.status(504).json({ status: "error", message: "The AI provider took too long to respond. Please try again." });
      }
      throw err;
    }

    if (!response.ok) {
      // Log details server-side only — never leak provider internals to clients
      const errData = await response.text();
      console.error("OpenRouter API Error:", response.status, errData);
      return res.status(502).json({ status: "error", message: "Failed to communicate with AI provider" });
    }

    const data = await response.json();

    // Extract the content or fallback to an error message if the model returns nothing
    const replyContent = data?.choices?.[0]?.message?.content?.trim();
    const finalReply = replyContent || "I'm sorry, I couldn't process that request properly. Could you try asking in a different way?";

    res.json({
      status: "success",
      data: {
        reply: finalReply
      }
    });

  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ status: "error", message: "Internal server error during chat" });
  }
};
