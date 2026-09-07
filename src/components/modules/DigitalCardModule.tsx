import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalIdCard } from '../cards/DigitalIdCard';
import {
  IdCard,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  User,
  Award,
  Sparkles,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';

export const DigitalCardModule: React.FC = () => {
  const { currentUser, currentRole, students, clinicalInstructors, visitors, openScanner, openBatchPrint } = useApp();

  // Find corresponding student, CI, or visitor
  const currentStudent = useMemo(() => {
    return students.find(s => 
      s.email === currentUser.email || 
      s.nim === currentUser.identifierNumber || 
      s.name.toLowerCase().includes(currentUser.name.toLowerCase())
    ) || students[0];
  }, [students, currentUser]);

  const currentCI = useMemo(() => {
    return clinicalInstructors.find(c => 
      c.email === currentUser.email || 
      c.nip === currentUser.identifierNumber || 
      c.name.toLowerCase().includes(currentUser.name.toLowerCase())
    ) || clinicalInstructors[0];
  }, [clinicalInstructors, currentUser]);

  const currentVisitor = useMemo(() => {
    return visitors[0];
  }, [visitors]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <IdCard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Kartu Tanda Pengenal Digital & QR Code
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                E-ID Card Resmi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Kartu identitas resmi praktik klinik RS TK II Kartika Husada terintegrasi scanner presensi & akses ruangan
            </p>
          </div>
        </div>

        {/* Action Buttons for Admin or Quick Scan */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openScanner('attendance')}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <QrCode className="w-4 h-4" />
            Buka Terminal Scanner
          </button>

          {currentRole === 'admin' && (
            <button
              onClick={() => openBatchPrint()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Cetak Massal Seluruh Mahasiswa
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Digital Card + Right Instructions & Stase Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Card 3D Viewer */}
        <div className="lg:col-span-6 flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="text-center mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Preview Kartu Tanda Pengenal Digital
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik &ldquo;Lihat QR Belakang&rdquo; untuk menampilkan barcode scanner presensi
            </p>
          </div>

          {currentRole === 'mahasiswa' ? (
            <DigitalIdCard student={currentStudent} />
          ) : currentRole === 'ci' ? (
            <DigitalIdCard ci={currentCI} />
          ) : currentRole === 'tamu' ? (
            <DigitalIdCard visitor={currentVisitor} />
          ) : (
            <DigitalIdCard student={currentStudent} />
          )}
        </div>

        {/* Right Column: Security Verification, Stase Details, Guidelines */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Validity & Security Badge */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Status Enkripsi & Keabsahan Kartu
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                TERVERIFIKASI AKTIF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Nomor Kartu Digital:</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">
                  {currentStudent?.cardNumber || 'RSKH-KMP-202608-001'}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Tanggal Penerbitan:</div>
                <div className="font-medium text-slate-800 mt-0.5">
                  {currentStudent?.cardIssuedDate || '01 Agustus 2026'}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Institusi Kampus:</div>
                <div className="font-semibold text-amber-700 mt-0.5">
                  {currentStudent?.institutionName || 'Universitas Tanjungpura'}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Program Pendidikan:</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {currentStudent?.studyProgram || 'Profesi Ners'}
                </div>
              </div>
            </div>
          </div>

          {/* Stase Practice & CI Supervisor Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-amber-500" />
              Penugasan Ruangan Stase & Pembimbing
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Ruangan Praktik Aktif</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {currentStudent?.roomName || 'Intensive Care Unit (ICU)'}
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-700 font-bold rounded-xl text-[10px] border border-amber-500/20">
                  Lantai 2
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Clinical Instructor (CI)</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {currentStudent?.ciName || 'Ns. Siti Rahmawati, M.Kep'}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Sp.Kep.MB
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dosen Pembimbing Akademik</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {currentStudent?.lecturerName || 'Dr. Ns. Yuliana Triastuti, M.Kep'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Instructions for Clinical Practice */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-500/20 text-xs space-y-3">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Petunjuk Penggunaan Kartu Digital RSKH
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700">
              <li>Pindai QR saat Check-In sebelum pergantian shift stase (toleransi 15 menit).</li>
              <li>Pindai QR saat Check-Out untuk merekam total jam durasi dinas praktik secara otomatis.</li>
              <li>Wajib menunjukkan kartu ini saat pemeriksaan keamanan gerbang Kesdam XII/Tpr.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
