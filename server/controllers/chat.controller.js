import { Trip } from "../models/index.js";

/**
 * Chat with AI Assistant using user's trips as context.
 * @route   POST /api/chat
 */
export const chatWithAssistant = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ status: "error", message: "Messages array is required" });
    }

    // Fetch user context
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      attributes: ['name', 'travelStatus', 'travelType', 'startDate', 'endDate', 'costs', 'itinerary', 'todos', 'packing']
    });

    // Create a compact string representation of the trips
    const contextData = trips.map(t => {
      let costSum = 0;
      if (t.costs && Array.isArray(t.costs)) {
        costSum = t.costs.reduce((sum, c) => sum + (c.amount || 0), 0);
      }
      return `Trip: ${t.name} (${t.travelStatus})
Type: ${t.travelType}
Dates: ${t.startDate || 'TBD'} to ${t.endDate || 'TBD'}
Total Cost: $${costSum}
Todos: ${t.todos ? t.todos.filter(todo => !todo.isDone).length + ' pending' : 'None'}
Packing: ${t.packing ? t.packing.filter(p => !p.isPacked).length + ' items pending' : 'None'}
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
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        max_tokens: 400,
        messages: apiMessages,
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("OpenRouter API Error:", errData);
      return res.status(502).json({ status: "error", message: "Failed to communicate with AI provider", details: errData });
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
