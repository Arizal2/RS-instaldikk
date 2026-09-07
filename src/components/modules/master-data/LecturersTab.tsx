import React, { useState } from 'react';
import { Lecturer, Institution } from '../../../types';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  Users
} from 'lucide-react';

interface LecturersTabProps {
  lecturers: Lecturer[];
  institutions: Institution[];
  onAdd: () => void;
  onEdit: (lec: Lecturer) => void;
  onDelete: (id: string, name: string) => void;
}

export const LecturersTab: React.FC<LecturersTabProps> = ({
  lecturers,
  institutions,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('all');

  const filtered = lecturers.filter(lec => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lec.name.toLowerCase().includes(q) ||
      lec.nidn.toLowerCase().includes(q) ||
      lec.institutionName.toLowerCase().includes(q) ||
      (lec.department && lec.department.toLowerCase().includes(q));

    const matchInst = filterInstitution === 'all' || lec.institutionId === filterInstitution;

    return matchSearch && matchInst;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama dosen, NIDN, program studi, atau kampus..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <select
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
          >
            <option value="all">Semua Institusi</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dosen Baru</span>
        </button>
      </div>

      {/* Grid of Lecturers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(lec => (
          <div
            key={lec.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={lec.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                  alt={lec.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    DOSEN PEMBIMBING
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug truncate">
                    {lec.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    NIDN: {lec.nidn}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{lec.institutionName}</span>
                </div>
                {lec.department && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lec.department}</span>
                  </div>
                )}
                {lec.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lec.phone}</span>
                  </div>
                )}
                {lec.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lec.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{lec.supervisedStudents || 0} Mahasiswa Bimbingan</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(lec)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  title="Edit Data Dosen"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(lec.id, lec.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Dosen"
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
