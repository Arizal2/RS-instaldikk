import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, ShiftType, AttendanceStatus, Student } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  Plus,
  QrCode,
  Download,
  Printer,
  UserCheck,
  Building2,
  Users,
  LogOut,
  LogIn,
  FileSpreadsheet,
  Trash2,
  Edit,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const {
    attendanceRecords,
    students,
    rooms,
    institutions,
    openScanner,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    showToast,
    logActivity,
    openPdfViewer
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState<string>('ALL');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'daily' | 'recap'>('daily');

  // Manual Attendance Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'Pagi' as ShiftType,
    roomId: '',
    checkInTime: '07:00',
    checkOutTime: '14:00',
    status: 'Hadir' as AttendanceStatus,
    notes: ''
  });

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Filtered Daily Records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(rec => {
      if (selectedDate && rec.date !== selectedDate) return false;
      if (selectedShift !== 'ALL' && rec.shift !== selectedShift) return false;
      if (selectedRoomId !== 'ALL' && rec.roomId !== selectedRoomId) return false;
      if (selectedStatus !== 'ALL' && rec.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = rec.studentName.toLowerCase().includes(q);
        const matchNim = rec.studentNim.toLowerCase().includes(q);
        const matchInst = rec.institutionName.toLowerCase().includes(q);
        const matchRoom = rec.roomName.toLowerCase().includes(q);
        if (!matchName && !matchNim && !matchInst && !matchRoom) return false;
      }
      return true;
    });
  }, [attendanceRecords, selectedDate, selectedShift, selectedRoomId, selectedStatus, searchQuery]);

  // Statistics for selected date
  const stats = useMemo(() => {
    const recordsForDate = attendanceRecords.filter(r => r.date === selectedDate);
    const totalPresent = recordsForDate.filter(r => r.status === 'Hadir' || r.status === 'Pulang').length;
    const totalLate = recordsForDate.filter(r => r.status === 'Terlambat').length;
    const totalPermission = recordsForDate.filter(r => r.status === 'Izin' || r.status === 'Sakit').length;
    const totalAlpha = recordsForDate.filter(r => r.status === 'Alpa').length;
    const rate = students.length > 0 ? Math.round(((totalPresent + totalLate) / students.length) * 100) : 0;

    return {
      totalStudents: students.length,
      totalCheckedIn: recordsForDate.length,
      totalPresent,
      totalLate,
      totalPermission,
      totalAlpha,
      rate
    };
  }, [attendanceRecords, students, selectedDate]);

  // Cumulative Recap for all students
  const studentRecap = useMemo(() => {
    return students.map(student => {
      const records = attendanceRecords.filter(r => r.studentId === student.id);
      const totalHadir = records.filter(r => r.status === 'Hadir' || r.status === 'Pulang').length;
      const totalTerlambat = records.filter(r => r.status === 'Terlambat').length;
      const totalIzin = records.filter(r => r.status === 'Izin').length;
      const totalSakit = records.filter(r => r.status === 'Sakit').length;
      const totalAlpa = records.filter(r => r.status === 'Alpa').length;
      const totalSessions = records.length;
      const attendancePercent = totalSessions > 0 ? Math.round(((totalHadir + totalTerlambat) / totalSessions) * 100) : 100;
      const isExamEligible = attendancePercent >= 85;

      return {
        student,
        totalSessions,
        totalHadir,
        totalTerlambat,
        totalIzin,
        totalSakit,
        totalAlpa,
        attendancePercent,
        isExamEligible
      };
    });
  }, [students, attendanceRecords]);

  const handleCreateManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.studentId) {
      showToast('Form Belum Lengkap', 'Pilih mahasiswa terlebih dahulu.', 'warning');
      return;
    }

    const selectedStd = students.find(s => s.id === manualForm.studentId);
    if (!selectedStd) return;

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const chosenDate = new Date(manualForm.date);
    const dayName = dayNames[chosenDate.getDay()];

    addAttendanceRecord({
      date: manualForm.date,
      dayName,
      studentId: selectedStd.id,
      studentName: selectedStd.name,
      studentNim: selectedStd.nim,
      studentAvatar: selectedStd.avatar,
      institutionName: selectedStd.institutionName,
      studyProgram: selectedStd.studyProgram,
      roomId: manualForm.roomId || selectedStd.roomId,
      roomName: (rooms.find(r => r.id === (manualForm.roomId || selectedStd.roomId))?.name) || selectedStd.roomName,
      shift: manualForm.shift,
      ciId: selectedStd.ciId,
      ciName: selectedStd.ciName,
      checkInTime: manualForm.checkInTime,
      checkOutTime: manualForm.checkOutTime,
      duration: '7 Jam 00 Menit',
      status: manualForm.status,
      verificationMethod: 'Manual Instaldik',
      verifiedBy: 'Administrator Instaldik',
      verifiedAt: `${manualForm.date} ${manualForm.checkInTime}`,
      notes: manualForm.notes
    });

    setIsManualModalOpen(false);
  };

  const handleUpdateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateAttendanceRecord(editingRecord.id, editingRecord);
    setEditingRecord(null);
  };

  const handleExportPDF = () => {
    logActivity('EXPORT_ABSENSI_PDF', 'Laporan Kehadiran Mahasiswa', `Export data absensi tanggal: ${selectedDate}`);
    openPdfViewer(
      `Rekap_Presensi_Instaldik_RSKH_${selectedDate}.pdf`,
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      'pdf',
      'Laporan Absensi Resmi',
      'Instalasi Pendidikan RSKH'
    );
  };

  const handleExportExcel = () => {
    logActivity('EXPORT_ABSENSI_EXCEL', 'Data Presensi CSV/Excel', `${filteredRecords.length} baris data absensi diekspor.`);
    
    // Generate CSV string
    const headers = ['Tanggal', 'Hari', 'NIM', 'Nama Mahasiswa', 'Institusi', 'Program Studi', 'Ruangan Stase', 'Shift', 'Jam Masuk', 'Jam Pulang', 'Durasi', 'Status', 'Metode'];
    const rows = filteredRecords.map(r => [
      r.date,
      r.dayName,
      r.studentNim,
      `"${r.studentName}"`,
      `"${r.institutionName}"`,
      `"${r.studyProgram}"`,
      `"${r.roomName}"`,
      r.shift,
      r.checkInTime || '-',
      r.checkOutTime || '-',
      `"${r.duration || '-'}"`,
      r.status,
      r.verificationMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_RSKH_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Berhasil', 'File rekap presensi CSV/Excel berhasil diunduh.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Module Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Sistem Absensi & Presensi QR Mahasiswa
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                Live RSKH
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pemantauan kehadiran stase praktik klinik, durasi dinas, toleransi shift, dan syarat kelayakan ujian stase
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openScanner('attendance')}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <QrCode className="w-4 h-4" />
            Buka Scanner Absensi
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            Input Manual / Izin
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Key Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Mahasiswa</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{stats.totalStudents}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Praktik aktif stase</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/60 shadow-sm bg-emerald-50/30">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Hadir Tepat Waktu
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{stats.totalPresent}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Toleransi ≤ 15 Menit</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm bg-amber-50/30">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Terlambat
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{stats.totalLate}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">{'>'} 15 Menit dari shift</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200/60 shadow-sm bg-indigo-50/30">
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">Izin & Sakit</div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">{stats.totalPermission}</div>
          <div className="text-[10px] text-indigo-600 mt-0.5">Surat resmi terlampir</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/60 shadow-sm bg-rose-50/30">
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Tanpa Keterangan</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">{stats.totalAlpha}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Alpa / Belum check-in</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-amber-500" />
            Tingkat Presensi
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{stats.rate}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Target RSKH ≥ 85%</div>
        </div>
      </div>

      {/* Main Content Tabs (Daily Log vs Recap) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Navigation Tab Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('daily')}
              className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'daily'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Presensi Harian Real-Time
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                {filteredRecords.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('recap')}
              className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'recap'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              Rekapitulasi Stase & Kelayakan Ujian
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span>Shift Toleransi: 15 Menit</span>
          </div>
        </div>

        {/* Tab 1: Daily Attendance Table with Filters */}
        {activeTab === 'daily' && (
          <div className="p-6 space-y-4">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari NIM / Nama / Ruangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">Semua Shift Dinas</option>
                  <option value="Pagi">Shift Pagi (07.00 - 14.00)</option>
                  <option value="Siang">Shift Siang (14.00 - 21.00)</option>
                  <option value="Malam">Shift Malam (21.00 - 07.00)</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">Semua Ruangan / Stase</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">Semua Status Presensi</option>
                  <option value="Hadir">Hadir Tepat Waktu</option>
                  <option value="Terlambat">Terlambat</option>
                  <option value="Pulang">Sudah Check-Out (Pulang)</option>
                  <option value="Izin">Izin Resmi</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpa">Alpa</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mahasiswa</th>
                    <th className="px-4 py-3">Ruangan & Shift</th>
                    <th className="px-4 py-3">Jam Masuk</th>
                    <th className="px-4 py-3">Jam Pulang</th>
                    <th className="px-4 py-3">Durasi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Metode Verifikasi</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        Tidak ada rekaman presensi pada filter tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={rec.studentAvatar}
                              alt={rec.studentName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate max-w-[180px]">
                                {rec.studentName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                NIM: {rec.studentNim}
                              </div>
                              <div className="text-[10px] text-amber-700 font-medium truncate max-w-[180px]">
                                {rec.institutionName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{rec.roomName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Shift: {rec.shift}</div>
                          <div className="text-[10px] text-slate-400">CI: {rec.ciName}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {rec.checkInTime || '-'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-700">
                            {rec.checkOutTime || '-'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-[11px] font-medium text-slate-600">
                            {rec.duration || '-'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              rec.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : rec.status === 'Pulang'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : rec.status === 'Terlambat'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : rec.status === 'Izin' || rec.status === 'Sakit'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {rec.status === 'Hadir' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {rec.status === 'Terlambat' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                            {rec.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-[11px] font-medium text-slate-700">
                            {rec.verificationMethod}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Oleh: {rec.verifiedBy || 'Terminal'}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingRecord(rec)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Edit Presensi"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAttendanceRecord(rec.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Hapus Presensi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Cumulative Recap & Exam Eligibility */}
        {activeTab === 'recap' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Standar Mutu Instaldik RS TK II Kartika Husada:</span> Mahasiswa berhak mengikuti Ujian Akhir Stase / Komprehensif Klinik jika memiliki persentase kehadiran minimal <span className="font-bold text-amber-800">85%</span> dari total sesi stase dan menyelesaikan seluruh target kompetensi.
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mahasiswa</th>
                    <th className="px-4 py-3">Ruangan Stase</th>
                    <th className="px-4 py-3 text-center">Total Sesi</th>
                    <th className="px-4 py-3 text-center text-emerald-700">Hadir</th>
                    <th className="px-4 py-3 text-center text-amber-700">Terlambat</th>
                    <th className="px-4 py-3 text-center text-purple-700">Izin / Sakit</th>
                    <th className="px-4 py-3 text-center text-rose-700">Alpa</th>
                    <th className="px-4 py-3 text-center">% Kehadiran</th>
                    <th className="px-4 py-3 text-center">Status Ujian Stase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentRecap.map(item => (
                    <tr key={item.student.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.student.avatar}
                            alt={item.student.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{item.student.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              NIM: {item.student.nim} • {item.student.studyProgram}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{item.student.roomName}</div>
                        <div className="text-[10px] text-slate-500">{item.student.institutionName}</div>
                      </td>

                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {item.totalSessions}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                        {item.totalHadir}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-amber-600">
                        {item.totalTerlambat}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-purple-600">
                        {item.totalIzin + item.totalSakit}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-rose-600">
                        {item.totalAlpa}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-slate-900">
                          <span>{item.attendancePercent}%</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                            item.isExamEligible
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {item.isExamEligible ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              BERHAK UJIAN
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              TIDAK MEMENUHI
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input Attendance Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Catat Presensi Manual / Izin / Sakit
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualAttendance} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Mahasiswa:</label>
                <select
                  value={manualForm.studentId}
                  onChange={(e) => {
                    const std = students.find(s => s.id === e.target.value);
                    setManualForm({
                      ...manualForm,
                      studentId: e.target.value,
                      roomId: std?.roomId || ''
                    });
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Pilih Mahasiswa Praktik --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nim}) - {s.roomName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal:</label>
                  <input
                    type="date"
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift Dinas:</label>
                  <select
                    value={manualForm.shift}
                    onChange={(e) => setManualForm({ ...manualForm, shift: e.target.value as ShiftType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pagi">Pagi (07.00 - 14.00)</option>
                    <option value="Siang">Siang (14.00 - 21.00)</option>
                    <option value="Malam">Malam (21.00 - 07.00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran:</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as AttendanceStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin Resmi</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpa">Alpa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Masuk:</label>
                  <input
                    type="text"
                    value={manualForm.checkInTime}
                    onChange={(e) => setManualForm({ ...manualForm, checkInTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pulang:</label>
                  <input
                    type="text"
                    value={manualForm.checkOutTime}
                    onChange={(e) => setManualForm({ ...manualForm, checkOutTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Alasan Izin:</label>
                <textarea
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Contoh: Sakit demam, surat keterangan dokter terlampir."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                Edit Status Presensi
              </h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Mahasiswa:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{editingRecord.studentName}</div>
                <div className="text-slate-500 font-mono text-[10px]">NIM: {editingRecord.studentNim}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Masuk:</label>
                  <input
                    type="text"
                    value={editingRecord.checkInTime || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, checkInTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pulang:</label>
                  <input
                    type="text"
                    value={editingRecord.checkOutTime || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, checkOutTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran:</label>
                <select
                  value={editingRecord.status}
                  onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value as AttendanceStatus })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Terlambat">Terlambat</option>
                  <option value="Pulang">Pulang (Selesai Dinas)</option>
                  <option value="Izin">Izin Resmi</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpa">Alpa</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Koreksi:</label>
                <textarea
                  value={editingRecord.notes || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
