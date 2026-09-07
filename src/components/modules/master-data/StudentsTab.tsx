import React, { useState } from 'react';
import { Student, Institution, PracticeRoom } from '../../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  IdCard,
  KeyRound,
  Eye,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentsTabProps {
  students: Student[];
  institutions: Institution[];
  rooms: PracticeRoom[];
  selectedStudentIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDetail: (student: Student) => void;
  onOpenCard: (student: Student) => void;
  onResetPassword: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  institutions,
  rooms,
  selectedStudentIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onAdd,
  onEdit,
  onDetail,
  onOpenCard,
  onResetPassword,
  onToggleStatus,
  onDelete,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = students.filter(s => {
    if (filterInstitution !== 'all' && s.institutionId !== filterInstitution) return false;
    if (filterRoom !== 'all' && s.roomId !== filterRoom) return false;
    if (filterStatus !== 'all' && (s.accountStatus || s.status) !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchNim = s.nim.toLowerCase().includes(q);
      const matchInst = s.institutionName.toLowerCase().includes(q);
      const matchRoom = s.roomName.toLowerCase().includes(q);
      const matchProdi = s.studyProgram.toLowerCase().includes(q);
      if (!matchName && !matchNim && !matchInst && !matchRoom && !matchProdi) return false;
    }
    return true;
  });

  const isAllSelected = filtered.length > 0 && selectedStudentIds.length === filtered.length;

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari NIM, Nama Mahasiswa, Institusi, atau Ruangan..."
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

          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
          >
            <option value="all">Semua Ruangan</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk action toolbar if items selected */}
        {selectedStudentIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-fadeIn">
            <div className="font-semibold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <span>{selectedStudentIds.length} Mahasiswa Terpilih</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBulkActivate}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
              >
                Aktifkan Semua
              </button>
              <button
                onClick={onBulkDeactivate}
                className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[11px] font-bold"
              >
                Nonaktifkan
              </button>
              <button
                onClick={onBulkDelete}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold"
              >
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-10">
                  <button onClick={onToggleSelectAll} className="text-slate-500 hover:text-slate-800">
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5">Mahasiswa</th>
                <th className="px-4 py-3.5">Institusi & Prodi</th>
                <th className="px-4 py-3.5">Stase & Pembimbing</th>
                <th className="px-4 py-3.5">Status Akun</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleSelectOne(student.id)}
                        className="text-slate-400 hover:text-amber-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">{student.name}</div>
                          <div className="text-[11px] font-mono text-amber-700">NIM: {student.nim}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{student.institutionName}</div>
                      <div className="text-[11px] text-slate-500">{student.studyProgram} • Smt {student.semester}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{student.roomName}</div>
                      <div className="text-[11px] text-slate-500">CI: {student.ciName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        student.accountStatus === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {student.accountStatus === 'Aktif' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Lock className="w-3 h-3 text-rose-600" />
                        )}
                        {student.accountStatus || 'Aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenCard(student)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Cetak / Buka Kartu Digital"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDetail(student)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Detail Mahasiswa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(student)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Data Mahasiswa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onResetPassword(student)}
                          className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                          title="Reset Password Mahasiswa"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(student.id)}
                          className={`p-1.5 rounded-lg transition ${
                            student.accountStatus === 'Aktif'
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={student.accountStatus === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        >
                          {student.accountStatus === 'Aktif' ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onDelete(student.id, student.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Mahasiswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
