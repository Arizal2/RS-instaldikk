import React, { useState } from 'react';
import { Visitor } from '../../../types';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Building2,
  Calendar,
  Clock,
  IdCard,
  CheckCircle,
  X
} from 'lucide-react';

interface VisitorsTabProps {
  visitors: Visitor[];
  onAdd: () => void;
  onCheckout: (id: string) => void;
  onOpenPass: (visitor: Visitor) => void;
  onDelete?: (id: string) => void;
}

export const VisitorsTab: React.FC<VisitorsTabProps> = ({
  visitors,
  onAdd,
  onCheckout,
  onOpenPass
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = visitors.filter(vis => {
    const q = searchQuery.toLowerCase();
    return (
      vis.name.toLowerCase().includes(q) ||
      vis.institution.toLowerCase().includes(q) ||
      vis.purpose.toLowerCase().includes(q) ||
      vis.identityNumber.toLowerCase().includes(q) ||
      (vis.destinationUnit && vis.destinationUnit.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu, NIK, asal instansi, atau tujuan kunjungan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrasi Tamu Baru</span>
        </button>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Nama & Identitas</th>
                <th className="px-4 py-3.5">Instansi / Asal</th>
                <th className="px-4 py-3.5">Tujuan Kunjungan</th>
                <th className="px-4 py-3.5">Waktu Kunjungan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(vis => (
                <tr key={vis.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{vis.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">NIK: {vis.identityNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{vis.institution}</div>
                    {vis.phone && <div className="text-[11px] text-slate-400">{vis.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{vis.purpose}</div>
                    <div className="text-[11px] text-amber-700 font-medium">Unit: {vis.destinationUnit}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{vis.visitDate}</div>
                    <div className="text-[11px] text-slate-400">{vis.entryTime} {vis.exitTime ? `- ${vis.exitTime}` : ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      vis.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {vis.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPass(vis)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Buka Visitor Pass Digital"
                      >
                        <IdCard className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                      {vis.status === 'Aktif' && (
                        <button
                          onClick={() => onCheckout(vis.id)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
                        >
                          Check-Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
