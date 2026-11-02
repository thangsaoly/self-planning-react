import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const [copiedIdx, setCopiedIdx] = useState(null);
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

    /** Copy a message to the clipboard, with execCommand fallback for older browsers/insecure contexts. */
    const handleCopy = async (text, idx) => {
        const value = String(text || "");
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                const ta = document.createElement("textarea");
                ta.value = value;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx((current) => (current === idx ? null : current)), 1600);
        } catch (err) {
            console.error("Copy failed:", err);
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

    /**
     * Markdown renderer for chat messages — full block support (headings,
     * lists, tables, code, blockquotes, links) via react-markdown + GFM.
     * Element overrides are RESTful-clean (no extra deps) and sized for the
     * small bubble text.
     */
    const markdownOverrides = {
        h1: (p) => <h1 className="text-base font-bold" {...p} />,
        h2: (p) => <h2 className="text-sm font-bold" {...p} />,
        h3: (p) => <h3 className="text-[13px] font-semibold" {...p} />,
        h4: (p) => <h4 className="text-[13px] font-semibold" {...p} />,
        h5: (p) => <h5 className="text-[13px] font-semibold" {...p} />,
        h6: (p) => <h6 className="text-[13px] font-semibold" {...p} />,
        p: (p) => <p {...p} />,
        strong: (p) => <strong className="font-semibold text-(--color-text-primary)" {...p} />,
        em: (p) => <em className="text-(--color-text-secondary)" {...p} />,
        a: (p) => <a className="text-(--color-link-interactive) underline break-all" target="_blank" rel="noopener noreferrer" {...p} />,
        ul: (p) => <ul className="list-disc pl-5 flex flex-col gap-1 marker:text-(--color-primary-blue)" {...p} />,
        ol: (p) => <ol className="list-decimal pl-5 flex flex-col gap-1 marker:text-(--color-primary-blue)" {...p} />,
        li: (p) => <li className="pl-0.5" {...p} />,
        blockquote: (p) => <blockquote className="border-l-2 border-(--color-primary-blue) pl-3 text-(--color-text-secondary)" {...p} />,
        hr: () => <hr className="border-(--color-border-secondary) my-1" />,
        code: (p) => <code className="bg-white/10 rounded px-1 text-[12px]" {...p} />,
        pre: (p) => <pre className="bg-black/30 rounded-lg p-3 overflow-x-auto my-1" {...p} />,
        table: (p) => <table className="w-full text-[12px] border-collapse my-1" {...p} />,
        th: (p) => <th className="border border-(--color-border-secondary) bg-(--color-bg-secondary) px-2 py-1 text-left font-semibold" {...p} />,
        td: (p) => <td className="border border-(--color-border-secondary) px-2 py-1 align-top" {...p} />,
    };

    const renderMessageContent = (content) => (
        <div className="flex flex-col gap-1.5 [&>*+*]:mt-0">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownOverrides}
            >
                {String(content || "")}
            </ReactMarkdown>
        </div>
    );

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end pointer-events-none">
            {/* Chat Window — absolute, so open/close never reflows the toggle */}
            <div
                aria-hidden={!isOpen}
                className={`pointer-events-auto absolute bottom-[4.25rem] right-0 origin-bottom-right transition-all duration-300 ease-out ${
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0 visible"
                        : "opacity-0 scale-95 translate-y-2 invisible"
                }`}
            >
                <div className="w-[min(380px,calc(100vw-3rem))] h-[min(550px,100dvh-9rem)] flex flex-col bg-(--color-bg-card) border border-(--color-border-secondary) rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-(--color-bg-secondary) border-b border-(--color-border-secondary) text-(--color-text-primary) shadow-sm relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-(--color-primary-blue)/10 flex items-center justify-center">
                                <i className="fi fi-rr-robot text-lg text-(--color-primary-blue)"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-wide">Pisey</span>
                                <span className="text-[10px] text-(--color-text-secondary) flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 text-(--color-text-secondary)">
                            <button onClick={() => setMessages([{ role: "assistant", content: "Chat cleared! How can I help?" }])} className="hover:text-red-500 transition-colors tooltip" title="Clear Chat">
                                <i className="fi fi-rr-trash text-sm opacity-70 hover:opacity-100"></i>
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:text-(--color-text-primary) transition-colors ml-2">
                                <i className="fi fi-rr-cross-small text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`group/msg flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-(--color-primary-blue)/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                                        <i className="fi fi-rr-robot text-[10px] text-(--color-primary-blue)"></i>
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] shadow-sm leading-relaxed ${
                                    msg.role === 'user'
                                    ? 'bg-(--color-primary-blue) text-white rounded-br-none'
                                    : 'bg-(--color-bg-secondary) text-(--color-text-primary) rounded-bl-none border border-(--color-border-secondary)'
                                }`}>
                                    {renderMessageContent(msg.content)}
                                </div>
                                {msg.role === 'assistant' && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(msg.content, idx)}
                                        title={copiedIdx === idx ? "Copied!" : "Copy answer"}
                                        aria-label={copiedIdx === idx ? "Answer copied" : "Copy answer"}
                                        className={`self-center ml-1.5 shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                                            copiedIdx === idx
                                                ? 'text-green-500 opacity-100'
                                                : 'text-(--color-text-muted) opacity-40 hover:opacity-100 group-hover/msg:opacity-100'
                                        }`}
                                    >
                                        <i className={`flex items-center justify-center leading-none text-xs ${copiedIdx === idx ? 'fi fi-rr-check' : 'fi fi-rr-copy'}`} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="w-6 h-6 rounded-full bg-(--color-primary-blue)/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                                    <i className="fi fi-rr-robot text-[10px] text-(--color-primary-blue)"></i>
                                </div>
                                <div className="bg-(--color-bg-secondary) text-(--color-text-secondary) rounded-2xl rounded-bl-none px-4 py-3 text-sm border border-(--color-border-secondary) flex items-center gap-1.5 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-(--color-border-secondary) bg-(--color-bg-card) flex items-end gap-2 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); handleInputResize(); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Pisey about your trips..."
                            className="flex-1 bg-(--color-bg-secondary) text-(--color-text-primary) px-4 py-3 rounded-[20px] outline-none border border-transparent focus:border-(--color-primary-blue) text-[13px] transition-colors resize-none overflow-hidden max-h-[120px] shadow-inner"
                            disabled={isLoading}
                            rows={1}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="flex items-center justify-center w-[42px] h-[42px] shrink-0 rounded-full bg-(--color-primary-blue) text-white disabled:opacity-50 disabled:bg-(--color-border-secondary) disabled:cursor-not-allowed hover:brightness-110 transition-all mb-0.5"
                        >
                            <i className="fi fi-rr-paper-plane mt-1 mr-0.5 text-sm"></i>
                        </button>
                    </form>

                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${isOpen ? 'bg-(--color-bg-secondary) border border-(--color-border-secondary) text-(--color-text-primary) rotate-90' : 'bg-(--color-primary-blue) text-white'}`}
            >
                <i className={`flex items-center justify-center leading-none text-2xl transition-all duration-300 ${isOpen ? 'fi fi-rr-cross scale-75' : 'fi fi-rr-sparkles'}`}></i>
            </button>
        </div>
    );
}
