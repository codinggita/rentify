import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const SYSTEM_PROMPT = `You are Rentify AI Assistant for property owners.
Owner's properties: Skyline Lofts #402 (₹28,000/mo, Occupied), Riverside Court 2BHK (₹72,000/mo, Vacant), Green Valley 3BHK (₹42,000/mo, Occupied).
Total Revenue: ₹70,000/mo. Active Maintenance: 3 tickets.
Help the owner with property management questions, revenue analysis, tenant issues, and maintenance decisions.
Always respond in a professional, concise manner.`;

const QUICK_PROMPTS = [
  'Which property needs attention?',
  'Summarize my maintenance tickets',
  'How can I reduce vacancy?',
  'Analyze my revenue performance',
];

export default function AIAssistantDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I\'m your Rentify AI Assistant. How can I help you manage your properties today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    // Typewriter response (simulated - replace with real API call if key available)
    const responses = {
      'Which property needs attention?': 'Based on your portfolio, **Riverside Court 2BHK** (Bengaluru) needs the most attention — it\'s currently vacant with ₹72,000/mo revenue potential. I recommend listing it with a competitive price point of ₹65,000–₹70,000 to attract quality tenants quickly.\n\n**Skyline Lofts** also has an open maintenance ticket (Kitchen Sink Leak) that should be resolved promptly to maintain tenant satisfaction.',
      'Summarize my maintenance tickets': 'You have **3 active maintenance tickets**:\n\n1. 🔴 **Kitchen Sink Leak** (Skyline Lofts) — HIGH priority, assigned to Suresh Plumber, PENDING\n2. 🟡 **Annual Safety Inspection** (Green Valley) — MEDIUM priority, assigned to Ravi Electrician, IN PROGRESS\n3. ✅ **AC Servicing** (Skyline Lofts) — LOW priority, COMPLETED\n\nI recommend following up on the kitchen leak — water damage can escalate quickly.',
      'How can I reduce vacancy?': 'To reduce vacancy for **Riverside Court 2BHK**:\n\n1. **Price competitively** — Current listing at ₹72,000 may be above market. Consider ₹65,000\n2. **Optimize listing quality** — Add professional photos and detailed amenity descriptions\n3. **Enable auto-listing** on NoBroker, 99acres and MagicBricks\n4. **Offer incentives** — First month discount or zero brokerage\n\nWith these steps, average vacancy fill time drops from 45 to ~18 days.',
      'Analyze my revenue performance': 'Your portfolio generates **₹70,000/mo** in gross revenue:\n\n- Skyline Lofts: ₹28,000 (40%)\n- Green Valley: ₹42,000 (60%)\n- Riverside Court: ₹0 (vacant — ₹72,000 potential)\n\n**Net after 5% platform fee:** ₹66,500/mo\n\n📈 **Opportunity:** Filling Riverside Court would increase total revenue to ₹1,42,000/mo — a **103% increase**.',
    };

    const reply = responses[userText] || `I understand you're asking about "${userText}". As your Rentify AI, I can analyze your 3 properties across Mumbai, Bengaluru, and New Delhi. Your current portfolio generates ₹70,000/month with a 67% occupancy rate. Would you like specific advice on revenue optimization, maintenance management, or tenant relations?`;

    // Simulate streaming typewriter effect
    let displayed = '';
    const chars = reply.split('');
    const assistantId = Date.now() + 1;
    setMessages(m => [...m, { id: assistantId, role: 'assistant', text: '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), loading: true }]);

    for (let i = 0; i < chars.length; i++) {
      await new Promise(r => setTimeout(r, 12));
      displayed += chars[i];
      setMessages(m => m.map(msg => msg.id === assistantId ? { ...msg, text: displayed, loading: false } : msg));
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Rentify AI</p>
              <p className="text-white/70 text-xs">Powered by Claude</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"><X size={18} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-violet-600'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'}`}>
                  {msg.loading ? <Loader2 size={14} className="animate-spin" /> : (
                    <span style={{ whiteSpace: 'pre-line' }}>{msg.text}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {QUICK_PROMPTS.map(q => (
              <button key={q} onClick={() => send(q)} disabled={loading}
                className="whitespace-nowrap text-[10px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50 shrink-0">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input type="text" placeholder="Ask about your properties..." value={input} onChange={e => setInput(e.target.value)} disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-all shrink-0">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
