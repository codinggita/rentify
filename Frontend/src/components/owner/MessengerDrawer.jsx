import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { MANAGERS } from '../../data/dummyData';

export default function MessengerDrawer({ isOpen, onClose }) {
  const [selected, setSelected] = useState(MANAGERS[0]);
  const [threads, setThreads] = useState(() =>
    Object.fromEntries(MANAGERS.map(m => [m.id, [...m.messages]]))
  );
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [threads, selected]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selected) return;
    const msg = { id: Date.now(), sender: 'owner', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setThreads(t => ({ ...t, [selected.id]: [...(t[selected.id] || []), msg] }));
    setInput('');
  };

  if (!isOpen) return null;

  const currentMsgs = threads[selected?.id] || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-100 dark:border-slate-800 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><MessageSquare size={18} /></div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Messages</p>
              <p className="text-xs text-slate-400">{MANAGERS.filter(m => m.status === 'Online').length} online</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all"><X size={18} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Contacts sidebar */}
          <div className="w-20 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-4 gap-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
            {MANAGERS.map(m => (
              <button key={m.id} onClick={() => setSelected(m)}
                className={`relative transition-all ${selected?.id === m.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 rounded-full' : 'opacity-60 hover:opacity-100'}`}>
                <img src={`https://i.pravatar.cc/100?u=${m.avatar}`} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full ${m.status === 'Online' ? 'bg-emerald-500' : m.status === 'Away' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                {(threads[m.id]?.length ?? 0) > 0 && selected?.id !== m.id && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {threads[m.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Contact header */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{selected?.name}</p>
              <p className="text-xs text-slate-400">{selected?.role} · <span className={selected?.status === 'Online' ? 'text-emerald-500' : selected?.status === 'Away' ? 'text-amber-500' : 'text-slate-400'}>{selected?.status}</span></p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
              {currentMsgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare size={32} className="mb-2 opacity-30" />
                  <p className="text-xs">No messages yet. Say hi! 👋</p>
                </div>
              ) : currentMsgs.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'owner' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'owner' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">{msg.time}</span>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSend} className="flex gap-2">
                <input type="text" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                />
                <button type="submit" disabled={!input.trim()}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-all shrink-0">
                  <Send size={14} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
