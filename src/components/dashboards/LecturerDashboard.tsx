import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  MessageSquare,
  Award,
  Building2,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    schedules,
    documents,
    chatMessages,
    evaluations,
    setCurrentView,
    openPdfViewer
  } = useApp();

  // Find students mentored by Lecturer
  const mentoredStudents = students.filter(s => s.lecturerId === 'lec_1' || s.lecturerName.includes(currentUser.name) || currentUser.role === 'dosen');
  const studentIds = mentoredStudents.map(s => s.id);
  const studentSchedules = schedules.filter(s => studentIds.includes(s.studentId));
  const studentDocs = documents.filter(d => studentIds.includes(d.studentId));
  const lecturerChats = chatMessages.filter(m => m.recipientId === 'lec_1' || m.recipientId === currentUser.id || m.senderId === 'std_1').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Lecturer Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0B192C] via-[#10243d] to-[#0B192C] rounded-2xl p-6 text-white shadow-xl border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border-2 border-blue-400/40 p-1 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                PORTAL DOSEN PEMBIMBING AKADEMIK
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Selamat Datang, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300">
                Fakultas Kedokteran & Keperawatan • Universitas Tanjungpura (UNTAN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('konsultasi')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buka Konsultasi Bimbingan</span>
            </button>
            <button
              onClick={() => setCurrentView('evaluasi')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-blue-400" />
              <span>Evaluasi & Nilai</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Mahasiswa Kampus</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{mentoredStudents.length} Mahasiswa</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">● Sedang Stase di RSKH</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Stase Berlangsung</span>
            <CalendarDays className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            {studentSchedules.filter(s => s.status === 'Sedang Berlangsung').length} Ruangan
          </div>
          <div className="text-[11px] text-slate-500 mt-1">ICU, Rawat Inap, OK & IGD</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Laporan & Logbook</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{studentDocs.length} Dokumen</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Verifikasi CI Aktif</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Rata-rata Nilai Stase</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-2 font-mono">89.4 / 100</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Predikat Sangat Memuaskan</div>
        </div>
      </div>

      {/* Main Split Grid: Mahasiswa Bimbingan & Monitoring Logbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mahasiswa Bimbingan Kampus */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Mahasiswa Praktik di RSKH</h3>
              <p className="text-xs text-slate-500">Monitoring stase, CI pendamping, dan capaian kompetensi</p>
            </div>
            <button
              onClick={() => setCurrentView('mahasiswa')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
            >
              Lihat Detail →
            </button>
          </div>

          <div className="space-y-3">
            {mentoredStudents.map(std => (
              <div
                key={std.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{std.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        NIM: {std.nim} • {std.studyProgram}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                    {std.roomName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400">CI RSKH:</span>
                    <span className="font-semibold text-slate-800 block truncate">{std.ciName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Kompetensi Stase:</span>
                    <span className="font-bold text-emerald-700 block">{std.competencyProgress}% Tercapai</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dokumen & Logbook Mahasiswa */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Dokumen Masuk Mahasiswa</h3>
                <p className="text-xs text-slate-500">Asuhan klinik & laporan kasus terkini</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                {studentDocs.length} Berkas
              </span>
            </div>

            <div className="space-y-3">
              {studentDocs.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 line-clamp-1">{doc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      {doc.reviewStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{doc.studentName}</span>
                    <span className="font-bold text-blue-800">Nilai: {doc.score || 88}</span>
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => openPdfViewer(doc.title, doc.fileUrl, doc.format, doc.type, doc.studentName)}
                      className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
                    >
                      Lihat Berkas Digital →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentView('dokumen')}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold"
            >
              Buka Seluruh Dokumen Bimbingan →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
