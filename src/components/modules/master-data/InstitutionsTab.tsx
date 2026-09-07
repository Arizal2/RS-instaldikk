import React, { useState } from 'react';
import { Institution } from '../../../types';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Users,
  ExternalLink
} from 'lucide-react';

interface InstitutionsTabProps {
  institutions: Institution[];
  onAdd: () => void;
  onEdit: (inst: Institution) => void;
  onDelete: (id: string, name: string) => void;
}

export const InstitutionsTab: React.FC<InstitutionsTabProps> = ({
  institutions,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = institutions.filter(inst => {
    const q = searchQuery.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.code.toLowerCase().includes(q) ||
      (inst.address && inst.address.toLowerCase().includes(q)) ||
      (inst.contactPerson && inst.contactPerson.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search and Add Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kampus / universitas, kode, atau kontak..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kampus Baru</span>
        </button>
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(inst => (
          <div
            key={inst.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400/80 transition flex flex-col justify-between"
          >
            <div>
              {/* Header card with logo */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {inst.logo ? (
                    <img
                      src={inst.logo}
                      alt={inst.name}
                      className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center border border-amber-200">
                      {inst.code || inst.name.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {inst.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">
                      {inst.name}
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  {inst.accreditation || 'Unggul'}
                </span>
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                {inst.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-slate-600">{inst.address}</span>
                  </div>
                )}
                {inst.contactPerson && (
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>PIC: <strong className="text-slate-800">{inst.contactPerson}</strong></span>
                  </div>
                )}
                {inst.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inst.phone}</span>
                  </div>
                )}
                {inst.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.email}</span>
                  </div>
                )}
                {inst.mouExpiryDate && (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-medium">MoU Berlaku s/d: {inst.mouExpiryDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{inst.activeStudents || 0} Mahasiswa Aktif</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(inst)}
                  className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                  title="Edit Data Kampus"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(inst.id, inst.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Kampus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
