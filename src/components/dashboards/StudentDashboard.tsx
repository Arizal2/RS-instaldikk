import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  CalendarDays,
  DoorOpen,
  Stethoscope,
  BookOpen,
  FileCheck2,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  UploadCloud,
  AlertCircle,
  Sparkles,
  Award,
  ChevronRight,
  IdCard,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    schedules,
    documents,
    tests,
    evaluations,
    attendanceRecords,
    setCurrentView,
    openDigitalCard,
    openScanner,
    openPdfViewer
  } = useApp();

  // Find active student data
  const currentStudent = students.find(s => s.id === 'std_1' || s.email === currentUser.email || s.nim === currentUser.identifierNumber) || students[0];
  const mySchedules = schedules.filter(s => s.studentId === currentStudent.id || s.studentName === currentStudent.name);
  const currentSchedule = mySchedules.find(s => s.status === 'Sedang Berlangsung') || mySchedules[0];
  const upcomingSchedules = mySchedules.filter(s => s.status === 'Akan Datang');
  const myDocuments = documents.filter(d => d.studentId === currentStudent.id || d.studentName === currentStudent.name);
  const pendingTasks = myDocuments.filter(d => d.reviewStatus === 'Menunggu Pemeriksaan' || d.reviewStatus === 'Perlu Revisi');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.find(r => r.studentId === currentStudent.id && r.date === todayStr);

  const pretests = tests.filter(t => t.type === 'pretest');
  const posttests = tests.filter(t => t.type === 'posttest');

  return (
    <div className="space-y-6">
      {/* Student Top Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0B192C] via-[#102a45] to-[#0B192C] rounded-3xl p-6 text-white shadow-xl border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  MAHASISWA PRAKTIK AKTIF
                </span>
                <span className="text-xs text-slate-300">
                  NIM: <span className="font-mono font-bold text-amber-300">{currentStudent.nim}</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {currentStudent.name}
              </h1>
              <p className="text-xs text-slate-300">
                {currentStudent.studyProgram} • {currentStudent.institutionName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openDigitalCard({ student: currentStudent })}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <IdCard className="w-4 h-4" />
              <span>Kartu Digital & QR Saya</span>
            </button>

            <button
              onClick={() => openScanner('attendance')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Scan Presensi Masuk / Pulang</span>
            </button>
          </div>
        </div>

        {/* Student Mentorship & Room Info Bar */}
        <div className="mt-5 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase font-semibold">Ruangan Stase Saat Ini:</span>
            <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5 mt-0.5">
              <DoorOpen className="w-4 h-4" /> {currentStudent.roomName}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase font-semibold">Clinical Instructor (CI):</span>
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="w-4 h-4 text-emerald-400" /> {currentStudent.ciName}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase font-semibold">Status Presensi Hari Ini:</span>
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {todayAttendance ? (
                <span className="text-emerald-400">{todayAttendance.status} ({todayAttendance.checkInTime})</span>
              ) : (
                <span className="text-amber-300">Belum Check-In</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Row: Stase Schedule & Digital ID Preview Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Jadwal Dinas & Target Kompetensi
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('jadwal')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Lihat Kalender <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {currentSchedule ? (
            <div className="bg-gradient-to-br from-amber-50/60 to-slate-50 p-5 rounded-2xl border border-amber-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs">
                  {currentSchedule.shift} Dinas
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {currentSchedule.startTime} - {currentSchedule.endTime} WIB
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {currentSchedule.roomName}
              </h4>
              <p className="text-xs text-slate-600">
                {currentSchedule.activityTopic || 'Praktik Klinik Keperawatan / Medis Terpadu'}
              </p>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">CI Pendamping: <strong className="text-slate-800">{currentSchedule.ciName}</strong></span>
                <button
                  onClick={() => openScanner('attendance')}
                  className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold rounded-xl text-xs hover:bg-slate-800 transition"
                >
                  Absen Sekarang
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              Belum ada jadwal dinas aktif.
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => setCurrentView('dokumen')}
              className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/70 text-left transition group"
            >
              <FileCheck2 className="w-5 h-5 text-amber-500 mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900">Upload Tugas</div>
              <div className="text-[10px] text-slate-500">{pendingTasks.length} perlu review</div>
            </button>

            <button
              onClick={() => setCurrentView('library')}
              className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/70 text-left transition group"
            >
              <BookOpen className="w-5 h-5 text-indigo-500 mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900">e-Library</div>
              <div className="text-[10px] text-slate-500">Modul & SPO RSKH</div>
            </button>

            <button
              onClick={() => setCurrentView('pretest')}
              className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/70 text-left transition group"
            >
              <ClipboardList className="w-5 h-5 text-emerald-500 mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900">Ujian CBT</div>
              <div className="text-[10px] text-slate-500">Pre & Post Test</div>
            </button>

            <button
              onClick={() => setCurrentView('konsultasi')}
              className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200/70 text-left transition group"
            >
              <Stethoscope className="w-5 h-5 text-purple-500 mb-1 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-900">Bimbingan CI</div>
              <div className="text-[10px] text-slate-500">Chat & Diskusi Kasus</div>
            </button>
          </div>
        </div>

        {/* Digital ID Card Preview & Quick Access */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <IdCard className="w-5 h-5 text-amber-500" />
                Kartu Tanda Pengenal Digital
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                AKTIF
              </span>
            </div>

            {/* Mini ID Card Frame */}
            <div
              onClick={() => openDigitalCard({ student: currentStudent })}
              className="bg-gradient-to-b from-[#0a192f] via-[#102a4e] to-[#0a192f] p-4 rounded-2xl text-white cursor-pointer hover:shadow-lg transition group border border-amber-500/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-3">
                <span className="text-[9px] font-bold tracking-wider text-amber-400 uppercase">
                  RS TK II KARTIKA HUSADA
                </span>
                <span className="text-[8px] text-slate-300 font-mono"></span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-400 shadow"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">{currentStudent.name}</div>
                  <div className="text-[10px] font-mono text-amber-300">{currentStudent.nim}</div>
                  <div className="text-[9px] text-slate-300 truncate">{currentStudent.studyProgram}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[9px] text-slate-300">
                <span>Stase: <strong>{currentStudent.roomName}</strong></span>
                <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:underline">
                  <QrCode className="w-3.5 h-3.5" /> Buka QR
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => openDigitalCard({ student: currentStudent })}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <IdCard className="w-4 h-4" />
              Tampilkan Kartu Full Screen (3D)
            </button>
            <button
              onClick={() => setCurrentView('attendance')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              Lihat Riwayat Presensi Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
