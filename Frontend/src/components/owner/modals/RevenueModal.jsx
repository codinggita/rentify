import React from 'react';
import { X, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function RevenueModal({ properties, onClose }) {
  const rows = [
    { property: 'Skyline Lofts #402', rent: 28000, status: 'Paid', lastPaid: 'Apr 2026' },
    { property: 'Riverside Court 2BHK', rent: 0, status: 'Vacant', lastPaid: '—' },
    { property: 'Green Valley 3BHK', rent: 42000, status: 'Paid', lastPaid: 'Apr 2026' },
  ];
  const total = rows.reduce((s, r) => s + r.rent, 0);
  const net = Math.round(total * 0.95);

  const downloadStatement = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('Revenue Statement', 20, 25);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 35);
    doc.setTextColor(0);

    let y = 55;
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    ['Property', 'Monthly Rent', 'Status', 'Last Paid'].forEach((h, i) => doc.text(h, [20, 80, 120, 160][i], y));
    doc.setFont('helvetica', 'normal'); y += 8;
    doc.setDrawColor(200); doc.line(20, y, 190, y); y += 6;
    rows.forEach(r => {
      doc.text(r.property, 20, y); doc.text(r.rent ? `₹${r.rent.toLocaleString('en-IN')}` : '₹0', 80, y);
      doc.text(r.status, 120, y); doc.text(r.lastPaid, 160, y); y += 10;
    });
    doc.line(20, y, 190, y); y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Revenue:', 20, y); doc.text(`₹${total.toLocaleString('en-IN')}`, 80, y); y += 8;
    doc.text('Net (after 5% fee):', 20, y); doc.setTextColor(0, 120, 0); doc.text(`₹${net.toLocaleString('en-IN')}`, 80, y);
    doc.setTextColor(150); doc.setFontSize(10); doc.text('Rentify — Professional Property Management', 20, 280);
    doc.save('Revenue_Statement.pdf');
    toast.success('Statement downloaded ✓');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Breakdown</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 mb-5">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>{['Property', 'Rent', 'Status', 'Last Paid'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map(r => (
                  <tr key={r.property} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white text-xs">{r.property}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white text-xs">{r.rent ? `₹${r.rent.toLocaleString('en-IN')}` : '₹0'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.lastPaid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-5">
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Total Revenue</span><span className="font-bold text-slate-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Platform Fee (5%)</span><span className="font-bold text-rose-600">- ₹{(total * 0.05).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-2 mt-2"><span className="font-bold text-slate-700 dark:text-slate-200">Net Income</span><span className="font-black text-emerald-600 text-base">₹{net.toLocaleString('en-IN')}</span></div>
          </div>
          <button onClick={downloadStatement}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
            <Download size={16} /> Download Statement
          </button>
        </div>
      </div>
    </div>
  );
}
