import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { SERVICE_PROVIDERS } from '../../../data/dummyData';

const STATUS_STEPS = ['Pending', 'In Progress', 'Completed'];

export default function TicketDetailModal({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket?.status || 'Pending');
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo || 'Unassigned');

  if (!ticket) return null;

  const handleSave = () => {
    onUpdate({ ...ticket, status, assignedTo });
    toast.success('Ticket updated ✓');
    onClose();
  };

  const currentStep = STATUS_STEPS.indexOf(status);
  const priorityColors = {
    Low: 'bg-slate-100 text-slate-600', Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-orange-100 text-orange-700', Urgent: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 rounded-full">#{ticket.id}</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${priorityColors[ticket.priority] || 'bg-slate-100 text-slate-600'}`}>{ticket.priority}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{ticket.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{ticket.property} · {ticket.date}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Tracker */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Status Progress</p>
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((s, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${done ? (active ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/40' : 'bg-emerald-500 text-white') : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {done && !active ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1 whitespace-nowrap ${active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{s}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${i < currentStep ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{ticket.description}</p>
          </div>

          {/* Change Status */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Change Status</label>
            <div className="flex gap-2">
              {STATUS_STEPS.map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border-2 ${status === s ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-slate-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reassign */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reassign Technician</label>
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              {SERVICE_PROVIDERS.map(sp => <option key={sp.id}>{sp.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
            Save Changes <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
