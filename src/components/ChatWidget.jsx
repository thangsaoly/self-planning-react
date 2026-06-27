import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatWidget() {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chat_history");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return [{ role: "assistant", content: "Hi there! I'm Pisey, your AI Travel Assistant. How can I help you plan your next trip today?" }];
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    // Save history
    useEffect(() => {
        localStorage.setItem("chat_history", JSON.stringify(messages));
    }, [messages]);

    const handleInputResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];
        
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error("Failed to get response");
            
            const result = await response.json();
            
            if (result.status === "success") {
                setMessages(prev => [...prev, { role: "assistant", content: result.data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I ran into an error processing your request." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Simple custom markdown renderer for bold text and line breaks
    const renderMessageContent = (content) => {
        const text = String(content || "");
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            if (!line.trim()) return <br key={idx} />;
            
            // Handle bold **text**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={idx} className="mb-1">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div className={`transition-all duration-300 transform origin-bottom-right pointer-events-auto ${isOpen ? "scale-100 opacity-100 mb-4" : "scale-0 opacity-0 h-0"}`}>
                <div className="w-[380px] h-[550px] flex flex-col bg-[color:var(--color-bg-card)] border border-[color:var(--color-border-secondary)] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden backdrop-blur-xl">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-[color:var(--color-bg-secondary)] border-b border-[color:var(--color-border-secondary)] text-[color:var(--color-text-primary)] shadow-sm relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[color:var(--color-primary-blue)]/10 flex items-center justify-center">
                                <i className="fi fi-rr-robot text-lg text-[color:var(--color-primary-blue)]"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide">Pisey</span>
                                <span className="text-[10px] text-[color:var(--color-text-secondary)] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 text-[color:var(--color-text-secondary)]">
                            <button onClick={() => setMessages([{ role: "assistant", content: "Chat cleared! How can I help?" }])} className="hover:text-red-500 transition-colors tooltip" title="Clear Chat">
                                <i className="fi fi-rr-trash text-sm opacity-70 hover:opacity-100"></i>
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:text-[color:var(--color-text-primary)] transition-colors ml-2">
                                <i className="fi fi-rr-cross-small text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary-blue)]/10 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                        <i className="fi fi-rr-robot text-[10px] text-[color:var(--color-primary-blue)]"></i>
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] shadow-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-[color:var(--color-primary-blue)] text-white rounded-br-none' 
                                    : 'bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] rounded-bl-none border border-[color:var(--color-border-secondary)]'
                                }`}>
                                    {renderMessageContent(msg.content)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary-blue)]/10 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                    <i className="fi fi-rr-robot text-[10px] text-[color:var(--color-primary-blue)]"></i>
                                </div>
                                <div className="bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-secondary)] rounded-2xl rounded-bl-none px-4 py-3 text-sm border border-[color:var(--color-border-secondary)] flex items-center gap-1.5 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-[color:var(--color-border-secondary)] bg-[color:var(--color-bg-card)] flex items-end gap-2 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); handleInputResize(); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Pisey about your trips..."
                            className="flex-1 bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)] px-4 py-3 rounded-[20px] outline-none border border-transparent focus:border-[color:var(--color-primary-blue)] text-[13px] transition-colors resize-none overflow-hidden max-h-[120px] shadow-inner"
                            disabled={isLoading}
                            rows={1}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="flex items-center justify-center w-[42px] h-[42px] flex-shrink-0 rounded-full bg-[color:var(--color-primary-blue)] text-white disabled:opacity-50 disabled:bg-[color:var(--color-border-secondary)] disabled:cursor-not-allowed hover:brightness-110 transition-all mb-0.5"
                        >
                            <i className="fi fi-rr-paper-plane mt-1 mr-0.5 text-sm"></i>
                        </button>
                    </form>

                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${isOpen ? 'bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-border-secondary)] text-[color:var(--color-text-primary)] rotate-90' : 'bg-[color:var(--color-primary-blue)] text-white'}`}
            >
                <i className={`text-2xl transition-all duration-300 ${isOpen ? 'fi fi-rr-cross scale-75' : 'fi fi-rr-sparkles'}`}></i>
            </button>
        </div>
    );
}
