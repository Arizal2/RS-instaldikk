import React, { useState } from 'react';
import { ClinicalInstructor } from '../../../types';
import {
  Stethoscope,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  DoorOpen,
  Users,
  IdCard
} from 'lucide-react';

interface ClinicalInstructorsTabProps {
  clinicalInstructors: ClinicalInstructor[];
  onAdd: () => void;
  onEdit: (ci: ClinicalInstructor) => void;
  onDelete: (id: string, name: string) => void;
  onOpenCard: (ci: ClinicalInstructor) => void;
}

export const ClinicalInstructorsTab: React.FC<ClinicalInstructorsTabProps> = ({
  clinicalInstructors,
  onAdd,
  onEdit,
  onDelete,
  onOpenCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = clinicalInstructors.filter(ci => {
    const q = searchQuery.toLowerCase();
    return (
      ci.name.toLowerCase().includes(q) ||
      ci.nip.toLowerCase().includes(q) ||
      ci.roomName.toLowerCase().includes(q) ||
      ci.specialization.toLowerCase().includes(q)
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
            placeholder="Cari nama CI, NIP, ruangan, atau bidang spesialisasi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah CI Baru</span>
        </button>
      </div>

      {/* Grid of CIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ci => (
          <div
            key={ci.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={ci.avatar || 'https://images.unsplash.com/photo-1594824813590-78536f90ff8a?w=150&auto=format&fit=crop&q=80'}
                  alt={ci.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    CLINICAL INSTRUCTOR
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug truncate">
                    {ci.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    NIP: {ci.nip}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium text-slate-800">{ci.roomName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{ci.specialization}</span>
                </div>
                {ci.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ci.phone}</span>
                  </div>
                )}
                {ci.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ci.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{ci.activeStudents || 0} Mahasiswa Bimbingan</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenCard(ci)}
                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                  title="Lihat Kartu CI"
                >
                  <IdCard className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(ci)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  title="Edit Data CI"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(ci.id, ci.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus CI"
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
