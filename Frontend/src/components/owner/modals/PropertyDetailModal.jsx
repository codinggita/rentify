import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function PropertyDetailModal({ property, onClose, onEdit, onDelete, onToggleAvailable }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = property?.images?.length > 0 ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop'];

  const handleViewLease = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('RENTAL LEASE AGREEMENT', 20, 25);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 35);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    const rows = [
      ['Property', property.title], ['Address', property.address], ['City', property.city],
      ['Monthly Rent', `₹${property.rent?.toLocaleString('en-IN')}`],
      ['Tenant Name', property.tenant?.name || 'N/A'], ['Tenant Email', property.tenant?.email || 'N/A'],
      ['Lease Start', property.tenant?.leaseStart || 'N/A'], ['Lease End', property.tenant?.leaseEnd || 'N/A'],
      ['Bedrooms', String(property.bedrooms)], ['Bathrooms', String(property.bathrooms)],
      ['Amenities', (property.amenities || []).join(', ')],
    ];
    let y = 55;
    rows.forEach(([k, v]) => {
      doc.setFont('helvetica', 'bold'); doc.text(k + ':', 20, y);
      doc.setFont('helvetica', 'normal'); doc.text(String(v), 80, y); y += 10;
    });
    doc.setFontSize(10); doc.setTextColor(150, 150, 150);
    doc.text('Rentify — Professional Property Management', 20, 280);
    doc.save(`Lease_${property.title}.pdf`);
    toast.success('Lease PDF generated ✓');
  };

  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Image Gallery */}
        <div className="relative h-52 bg-slate-800 shrink-0">
          <img src={images[imgIdx]} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/60 transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/60 transition-all">
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/40'}`} />)}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/60 transition-all"><X size={16} /></button>
          <div className="absolute bottom-3 left-4">
            <h2 className="text-lg font-bold text-white">{property.title}</h2>
            <p className="text-white/80 text-xs">{property.address}</p>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[['Type', property.type], ['Rent', `₹${property.rent?.toLocaleString('en-IN')}`], ['Beds', property.bedrooms], ['Baths', property.bathrooms]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{k}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{v}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map(a => (
                    <span key={a} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tenant info */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Current Tenant</p>
              {property.tenant ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[['Name', property.tenant.name], ['Email', property.tenant.email],
                    ['Lease Start', property.tenant.leaseStart], ['Lease End', property.tenant.leaseEnd],
                    ['Monthly Rent', `₹${property.tenant.monthlyRent?.toLocaleString('en-IN')}`]].map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 text-xs">{k}: </span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 font-medium">No current tenant — property is vacant</p>
              )}
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Availability Status</p>
                <p className="text-xs text-slate-500">{property.available ? 'Listed & visible to renters' : 'Currently occupied or hidden'}</p>
              </div>
              <button onClick={() => onToggleAvailable(property.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${property.available ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                {property.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {property.available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <button onClick={handleViewLease}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Download size={14} /> View Lease
            </button>
            <button onClick={() => { onDelete(property.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
              <Trash2 size={14} /> Delete
            </button>
            <div className="flex-1" />
            <button onClick={() => onEdit(property)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
              <Edit size={14} /> Edit Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
