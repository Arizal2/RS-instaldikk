import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticeSchedule } from '../../types';
import {
  CalendarDays,
  Clock,
  DoorOpen,
  Filter,
  Plus,
  Search,
  CheckCircle,
  Calendar,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

export const ScheduleCalendarModule: React.FC = () => {
  const { schedules, rooms, students, clinicalInstructors, currentRole, addSchedule, showToast } = useApp();

  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [schStudentId, setSchStudentId] = useState(students[0]?.id || '');
  const [schRoomId, setSchRoomId] = useState(rooms[0]?.id || '');
  const [schShift, setSchShift] = useState<'Pagi' | 'Siang' | 'Malam' | 'Full Day'>('Pagi');
  const [schStartDate, setSchStartDate] = useState('01 Sep 2026');
  const [schEndDate, setSchEndDate] = useState('30 Sep 2026');

  const filteredSchedules = schedules.filter(sch => {
    const matchShift = selectedShift === 'all' || sch.shift === selectedShift;
    const matchRoom = selectedRoom === 'all' || sch.roomId === selectedRoom;
    const matchStudent = !searchStudent.trim() || sch.studentName.toLowerCase().includes(searchStudent.toLowerCase());
    return matchShift && matchRoom && matchStudent;
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === schStudentId);
    const room = rooms.find(r => r.id === schRoomId);
    const ci = clinicalInstructors.find(c => c.department.includes(room?.name || '')) || clinicalInstructors[0];

    if (!student || !room) return;

    addSchedule({
      studentId: student.id,
      studentName: student.name,
      nim: student.nim,
      studyProgram: student.studyProgram,
      roomId: room.id,
      roomName: room.name,
      ciId: ci?.id || 'ci_1',
      ciName: ci?.name || 'Ns. Siti Rahmawati, M.Kep',
      shift: schShift,
      startDate: schStartDate,
      endDate: schEndDate,
      status: 'Sedang Berlangsung',
      notes: `Jadwal dinas resmi stase ${room.name}`
    });

    showToast('Jadwal Dibuat', `Jadwal dinas ${student.name} berhasil ditambahkan.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              ROSTER & ROTASI
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Jadwal Praktik & Shift Dinas</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan dinas rotasi klinik stase RS TK II Kartika Husada (Shift Pagi: 07.00-14.00, Siang: 14.00-21.00).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Student */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              placeholder="Cari nama mahasiswa..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          {/* Filter Room */}
          <select
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Semua Ruangan Stase</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {/* Filter Shift */}
          <select
            value={selectedShift}
            onChange={e => setSelectedShift(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Semua Shift</option>
            <option value="Pagi">Shift Pagi (07.00 - 14.00)</option>
            <option value="Siang">Shift Siang (14.00 - 21.00)</option>
            <option value="Malam">Shift Malam</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">
            Total: {filteredSchedules.length} Jadwal
          </span>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Mahasiswa</th>
                <th className="p-3.5">Ruangan Penempatan</th>
                <th className="p-3.5">Shift Dinas</th>
                <th className="p-3.5">Periode Stase</th>
                <th className="p-3.5">CI Pembimbing</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada jadwal yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{sch.studentName}</div>
                      <div className="text-[11px] text-slate-500">NIM: {sch.nim} • {sch.studyProgram}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#0B192C] flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>{sch.roomName}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                        sch.shift === 'Pagi' ? 'bg-blue-100 text-blue-800' :
                        sch.shift === 'Siang' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {sch.shift}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <div className="font-medium">{sch.startDate}</div>
                      <div className="text-[10px] text-slate-400">s/d {sch.endDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-emerald-600" /> {sch.ciName}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        sch.status === 'Sedang Berlangsung' ? 'bg-emerald-100 text-emerald-800' :
                        sch.status === 'Akan Datang' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sch.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-500 max-w-[200px] truncate">
                      {sch.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Buat Jadwal Rotasi Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-5 space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Mahasiswa</label>
                <select
                  value={schStudentId}
                  onChange={e => setSchStudentId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.nim})</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Ruangan Stase</label>
                <select
                  value={schRoomId}
                  onChange={e => setSchRoomId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name} - Lt. {r.floor}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Shift Dinas</label>
                <select
                  value={schShift}
                  onChange={e => setSchShift(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Pagi">Shift Pagi (07.00 - 14.00 WIB)</option>
                  <option value="Siang">Shift Siang (14.00 - 21.00 WIB)</option>
                  <option value="Malam">Shift Malam (21.00 - 07.00 WIB)</option>
                  <option value="Full Day">Full Day (Pendidikan & Ronde)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai</label>
                  <input
                    type="text"
                    value={schStartDate}
                    onChange={e => setSchStartDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Selesai</label>
                  <input
                    type="text"
                    value={schEndDate}
                    onChange={e => setSchEndDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
