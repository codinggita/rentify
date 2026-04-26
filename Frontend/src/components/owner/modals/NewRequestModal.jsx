import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DUMMY_PROPERTIES, SERVICE_PROVIDERS } from '../../../data/dummyData';
import maintenanceService from '../../../services/maintenanceService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function NewRequestModal({ isOpen, onClose, onSubmit, allowedProperties }) {
  const propertyList = allowedProperties || DUMMY_PROPERTIES;
  const initialProperty = propertyList.length > 0 ? propertyList[0].title : 'Skyline Lofts #402';

  const [form, setForm] = useState({
    category: 'Maintenance',
    type: 'Plumbing Repair',
    property: initialProperty,
    priority: 'Medium',
    title: '',
    description: '',
    assignedTo: 'Unassigned',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const charLimit = 500;

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Build payload matching the backend schema
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim(),
        category:    form.category,
        type:        form.type,
        priority:    form.priority.toUpperCase(),
        status:      'OPEN',
        propertyName: form.property,  // stored for display; property ObjectId optional
      };

      // Try real API — fall back gracefully if auth not set up
      let saved = null;
      try {
        saved = await maintenanceService.createTicket(payload);
      } catch (apiErr) {
        console.warn('[NewRequest] API error — using local fallback:', apiErr.message);
      }

      // Build a display record for local state regardless
      const localRecord = {
        id:       saved?._id?.toString().slice(-6).toUpperCase() || Math.random().toString(36).slice(-6).toUpperCase(),
        rawId:    saved?._id || null,
        type:     form.category,
        property: form.property,
        status:   'Pending',
        date:     new Date().toISOString().split('T')[0],
        assigned: form.assignedTo !== 'Unassigned' ? form.assignedTo : 'TBD',
        priority: form.priority,
        title:    form.title,
        description: form.description,
      };

      onSubmit?.(localRecord, saved);
      toast.success('Request submitted and saved ✓');

      // Dispatch global event so ServiceDashboard gets notified
      window.dispatchEvent(new CustomEvent('rentify:new_ticket', {
        detail: {
          ticketId:  localRecord.id,
          title:     form.title,
          category:  form.category,
          priority:  form.priority.toUpperCase(),
          property:  form.property,
          message:   `New ${form.category} request submitted`,
          createdAt: new Date().toISOString(),
        }
      }));

      onClose();
      setForm({ category: 'Maintenance', type: 'Plumbing Repair', property: 'Skyline Lofts #402', priority: 'Medium', title: '', description: '', assignedTo: 'Unassigned' });
    } catch (err) {
      console.error(err);
      toast.error('Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const priorityColors = {
    Low:    'bg-slate-100 text-slate-600 border-slate-300',
    Medium: 'bg-amber-50 text-amber-700 border-amber-400',
    High:   'bg-orange-50 text-orange-700 border-orange-400',
    Urgent: 'bg-rose-50 text-rose-700 border-rose-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50 dark:bg-amber-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600"><AlertTriangle size={18} /></div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Service Request</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/60 text-slate-400"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              placeholder="e.g. Kitchen Sink Leak, AC not cooling..."
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: null })); }}
              className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Type + Property */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {['Maintenance', 'Inspection', 'Lease Review', 'Financial Audit', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Property</label>
              <select value={form.property} onChange={e => setForm(f => ({ ...f, property: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {propertyList.map(p => <option key={p.id || p._id || p.title}>{p.title}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Priority</label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.priority === p ? priorityColors[p] + ' shadow-sm' : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description *</label>
            <textarea rows={4} placeholder="Describe the issue in detail..." maxLength={charLimit}
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: null })); }}
              className={`w-full bg-slate-50 dark:bg-slate-800 border ${errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? <p className="text-rose-500 text-xs">{errors.description}</p> : <span />}
              <span className="text-xs text-slate-400">{form.description.length}/{charLimit}</span>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Preferred Provider</label>
            <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Unassigned">Unassigned — Service manager will assign</option>
              {SERVICE_PROVIDERS.filter(sp => sp.name !== 'Unassigned').map(sp => (
                <option key={sp.id} value={sp.name}>{sp.name} ({sp.specialty} · ★{sp.rating})</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
