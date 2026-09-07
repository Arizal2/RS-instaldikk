import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticeRoom } from '../../types';
import {
  DoorOpen,
  Building2,
  Users,
  Stethoscope,
  CheckCircle2,
  Plus,
  Search,
  ArrowUpRight,
  Shield,
  Clock,
  Layers
} from 'lucide-react';

export const RoomsModule: React.FC = () => {
  const { rooms, students, clinicalInstructors, currentRole, addRoom, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<PracticeRoom | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomBuilding, setRoomBuilding] = useState('Gedung Utama RSKH');
  const [roomFloor, setRoomFloor] = useState('Lantai 1');
  const [roomCapacity, setRoomCapacity] = useState(10);
  const [roomDesc, setRoomDesc] = useState('');
  const [roomCi, setRoomCi] = useState(clinicalInstructors[0]?.name || '');

  const filteredRooms = rooms.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.ciInChargeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBuilding = selectedBuilding === 'all' || r.building.includes(selectedBuilding);
    return matchSearch && matchBuilding;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomCode.trim()) {
      showToast('Form Belum Lengkap', 'Nama dan Kode Ruangan wajib diisi.', 'warning');
      return;
    }

    addRoom({
      name: roomName,
      code: roomCode,
      building: roomBuilding,
      floor: roomFloor,
      capacity: Number(roomCapacity),
      currentStudentsCount: 0,
      ciInChargeId: clinicalInstructors.find(c => c.name === roomCi)?.id || 'ci_1',
      ciInChargeName: roomCi,
      description: roomDesc || 'Ruangan wahana pendidikan dan praktik klinik terstandar.',
      status: 'Tersedia'
    });

    showToast('Ruangan Ditambahkan', `Ruangan ${roomName} (${roomCode}) berhasil didaftarkan.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              WAHANA KLINIK
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Ruangan & Unit Praktik Klinis</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data kapasitas okupansi, Clinical Instructor penanggung jawab, dan sebaran mahasiswa per stase unit RSKH.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ruangan</span>
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari ruangan atau nama CI..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Total: {filteredRooms.length} Ruangan</span>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map(room => {
          const occupancyRate = Math.round((room.currentStudentsCount / room.capacity) * 100);
          const roomStudents = students.filter(s => s.roomName === room.name);

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#0B192C] text-amber-400">
                    {room.code}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    room.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {room.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{room.building} ({room.floor})</span>
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">CI Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[150px]">{room.ciInChargeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kapasitas Stase:</span>
                    <span className="font-bold text-slate-900 font-mono">{room.currentStudentsCount} / {room.capacity} Mahasiswa</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                    <span>Tingkat Kepadatan:</span>
                    <span className="font-bold text-slate-800">{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyRate >= 90 ? 'bg-rose-500' : occupancyRate >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action and assigned students count */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedRoomDetail(room)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Lihat {roomStudents.length} Mahasiswa Stase →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Student Roster Modal */}
      {selectedRoomDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedRoomDetail.code}</span>
                <h3 className="font-bold text-sm text-white mt-0.5">{selectedRoomDetail.name}</h3>
              </div>
              <button onClick={() => setSelectedRoomDetail(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500">CI Pembimbing Utama:</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  {selectedRoomDetail.ciInChargeName}
                </div>
                <p className="text-[11px] text-slate-600 mt-2">{selectedRoomDetail.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  Daftar Mahasiswa Stase Aktif di Ruangan Ini
                </h4>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {students.filter(s => s.roomName === selectedRoomDetail.name).length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Belum ada mahasiswa yang ditempatkan di stase ini.</p>
                  ) : (
                    students.filter(s => s.roomName === selectedRoomDetail.name).map(std => (
                      <div key={std.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{std.name}</div>
                            <div className="text-[10px] text-slate-500">{std.nim} • {std.institutionName}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                          {std.studyProgram}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t text-right">
              <button
                onClick={() => setSelectedRoomDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0B192C] text-amber-400 font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Ruangan Praktik Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-5 space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Ruangan / Unit *</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  placeholder="Contoh: Unit Hemodialisa (HD)"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Ruangan *</label>
                  <input
                    type="text"
                    required
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value)}
                    placeholder="Contoh: HD-01"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kapasitas (Mahasiswa)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={roomCapacity}
                    onChange={e => setRoomCapacity(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gedung</label>
                  <input
                    type="text"
                    value={roomBuilding}
                    onChange={e => setRoomBuilding(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lantai</label>
                  <input
                    type="text"
                    value={roomFloor}
                    onChange={e => setRoomFloor(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Instructor (CI) Penanggung Jawab</label>
                <select
                  value={roomCi}
                  onChange={e => setRoomCi(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {clinicalInstructors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi Fasilitas</label>
                <textarea
                  rows={2}
                  value={roomDesc}
                  onChange={e => setRoomDesc(e.target.value)}
                  placeholder="Keterangan tindakan klinis, alat medis yang tersedia..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
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
                  Simpan Ruangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
