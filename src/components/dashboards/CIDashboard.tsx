import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  MessageSquare,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  Send,
  Eye
} from 'lucide-react';

export const CIDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    schedules,
    documents,
    chatMessages,
    evaluations,
    setCurrentView,
    openPdfViewer,
    reviewDocument
  } = useApp();

  // Find students mentored by this CI (or default to current CI's mentees)
  const mentoredStudents = students.filter(s => s.ciId === 'ci_1' || s.ciName.includes(currentUser.name) || currentUser.role === 'ci');
  const todaySchedules = schedules.filter(s => s.status === 'Sedang Berlangsung');
  const upcomingSchedules = schedules.filter(s => s.status === 'Akan Datang');
  const unreviewedDocs = documents.filter(d => d.reviewStatus === 'Menunggu Pemeriksaan');
  const recentChats = chatMessages.filter(m => m.recipientId === 'ci_1' || m.recipientId === currentUser.id || m.senderId === 'std_1').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* CI Header Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0B192C] via-[#16365C] to-[#0B192C] rounded-2xl p-6 text-white shadow-xl border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 p-1 flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                PORTAL CLINICAL INSTRUCTOR (CI)
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Selamat Bertugas, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300">
                Spesialisasi: Keperawatan Medikal Bedah & Intensive Care • Ruang Bimbingan: ICU & OK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('dokumen')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Periksa Tugas ({unreviewedDocs.length})</span>
            </button>
            <button
              onClick={() => setCurrentView('konsultasi')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Chat Konsultasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Mahasiswa Bimbingan</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{mentoredStudents.length} Mahasiswa</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">● Stase Aktif Berjalan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Jadwal Hari Ini</span>
            <CalendarDays className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">{todaySchedules.length} Shift</div>
          <div className="text-[11px] text-slate-500 mt-1">Dinas Pagi & Siang ICU</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/40">
          <div className="flex items-center justify-between text-amber-900 text-xs font-semibold">
            <span>Tugas Belum Diperiksa</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 font-mono">{unreviewedDocs.length} Dokumen</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Perlu review & nilai</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Evaluasi Masuk</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-2 font-mono">{evaluations.length} Respon</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Kepuasan 100% Sangat Puas</div>
        </div>
      </div>

      {/* Main Split Grid: Mentored Students & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mahasiswa Bimbingan Aktif */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Mahasiswa Bimbingan Klinis</h3>
              <p className="text-xs text-slate-500">Progres pencapaian kompetensi dan logbook stase</p>
            </div>
            <button
              onClick={() => setCurrentView('mahasiswa')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {mentoredStudents.slice(0, 4).map(std => (
              <div
                key={std.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-white transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{std.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {std.nim} • {std.institutionName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                    {std.roomName}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Target Kompetensi Klinis:</span>
                    <span className="font-bold text-slate-800">{std.competencyProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${std.competencyProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tugas & Dokumen Menunggu Pemeriksaan */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Tugas Belum Diperiksa</h3>
                <p className="text-xs text-slate-500">Laporan kasus dan logbook mahasiswa</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {unreviewedDocs.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {unreviewedDocs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Semua tugas mahasiswa telah selesai diperiksa.
                </div>
              ) : (
                unreviewedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-900 line-clamp-1">{doc.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-mono shrink-0">
                        {doc.format}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Oleh: {doc.studentName}</span>
                      <span className="text-slate-400">{doc.uploadedAt}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60">
                      <button
                        onClick={() => openPdfViewer(doc.title, doc.fileUrl, doc.format, doc.type, doc.studentName)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Pratinjau
                      </button>

                      <button
                        onClick={() => reviewDocument(doc.id, 'Diterima', 'Laporan kasus komprehensif, disetujui.', 90)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                      >
                        ✓ Terima (90)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentView('dokumen')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold"
            >
              Buka Seluruh Dokumen & Rekap Penilaian →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Jadwal Hari Ini & Konsultasi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Hari Ini & Mendatang */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Jadwal Bimbingan & Shift Hari Ini</h3>
            <button
              onClick={() => setCurrentView('jadwal')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
            >
              Kalender Lengkap →
            </button>
          </div>

          <div className="space-y-2.5">
            {todaySchedules.map(sch => (
              <div
                key={sch.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B192C] text-amber-400 flex flex-col items-center justify-center font-bold text-[10px] leading-tight">
                    <span>{sch.shift}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{sch.studentName}</h5>
                    <p className="text-[11px] text-slate-500">{sch.roomName} • {sch.studyProgram}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {sch.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sch.startDate} s/d {sch.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konsultasi Terbaru */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Konsultasi Terbaru</h3>
            <button
              onClick={() => setCurrentView('konsultasi')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold"
            >
              Buka Chat Room →
            </button>
          </div>

          <div className="space-y-3">
            {recentChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setCurrentView('konsultasi')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition cursor-pointer space-y-1 text-xs"
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-900">{chat.senderName}</span>
                  <span className="text-slate-400">{chat.timestamp}</span>
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {chat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
