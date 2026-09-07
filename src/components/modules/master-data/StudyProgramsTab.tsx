import React, { useState } from 'react';
import { StudyProgram, Institution } from '../../../types';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Award,
  Clock,
  Users,
  Filter
} from 'lucide-react';

interface StudyProgramsTabProps {
  studyPrograms: StudyProgram[];
  institutions: Institution[];
  onAdd: () => void;
  onEdit: (prodi: StudyProgram) => void;
  onDelete: (id: string, name: string) => void;
}

export const StudyProgramsTab: React.FC<StudyProgramsTabProps> = ({
  studyPrograms,
  institutions,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('all');
  const [filterDegree, setFilterDegree] = useState('all');

  const filtered = studyPrograms.filter(sp => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      sp.name.toLowerCase().includes(q) ||
      sp.institutionName.toLowerCase().includes(q) ||
      (sp.code && sp.code.toLowerCase().includes(q)) ||
      sp.degree.toLowerCase().includes(q);

    const matchInst = filterInstitution === 'all' || sp.institutionId === filterInstitution;
    const matchDegree = filterDegree === 'all' || sp.degree === filterDegree;

    return matchSearch && matchInst && matchDegree;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program studi, jenjang, atau kampus..."
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
          <span>Tambah Program Studi</span>
        </button>
      </div>

      {/* Grid of Study Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(sp => (
          <div
            key={sp.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400/80 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {sp.degree}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">
                      {sp.name}
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  {sp.accreditation || 'Unggul'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{sp.institutionName}</span>
                </div>
                {sp.code && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[10px]">KODE:</span>
                    <span className="font-mono text-slate-700 font-bold">{sp.code}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Durasi Praktik: {sp.durationSemester || 2} Semester / Siklus</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{sp.activeStudents || 0} Mahasiswa</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(sp)}
                  className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                  title="Edit Program Studi"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(sp.id, sp.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus Program Studi"
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
