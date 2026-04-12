'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble right now. Please try again in a moment." }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't connect. Please check your internet and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0D9488] hover:bg-[#14B8A6] text-white shadow-lg shadow-[#0D9488]/30 flex items-center justify-center transition-all hover:scale-105"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3d] bg-[#12121a]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 flex items-center justify-center">
                <Sparkles size={16} className="text-[#0D9488]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e8e8f0]">DuoWealth AI</div>
                <div className="text-[10px] text-[#8888a0]">Help, setup & bug reports</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d] rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[#0D9488]/15 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-[#0D9488]" />
                </div>
                <p className="text-sm font-medium text-[#e8e8f0] mb-1">Hey! How can I help?</p>
                <p className="text-xs text-[#8888a0] mb-4">Ask me about features, setup, or report a bug.</p>
                <div className="space-y-2">
                  {[
                    'How do I connect my bank?',
                    'How does bill splitting work?',
                    'I want to report a bug',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="block w-full text-left px-3 py-2 bg-[#1a1a26] border border-[#2a2a3d] rounded-lg text-xs text-[#8888a0] hover:text-[#0D9488] hover:border-[#0D9488]/40 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0D9488] text-white rounded-br-md'
                      : 'bg-[#1a1a26] text-[#e8e8f0] border border-[#2a2a3d] rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a26] border border-[#2a2a3d] px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#8888a0] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#8888a0] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#8888a0] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#2a2a3d] px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-[#0a0a0f] border border-[#2a2a3d] rounded-xl px-3.5 py-2.5 text-sm text-[#e8e8f0] placeholder-[#8888a0] focus:border-[#0D9488] focus:outline-none transition"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#0D9488] hover:bg-[#14B8A6] disabled:opacity-40 text-white rounded-xl transition flex-shrink-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
