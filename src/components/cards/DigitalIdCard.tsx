import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, ClinicalInstructor, Visitor } from '../../types';
import { useApp } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import {
  IdCard,
  Download,
  Printer,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Building2,
  Hospital,
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  X,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface DigitalIdCardProps {
  student?: Student;
  ci?: ClinicalInstructor;
  visitor?: Visitor;
  onClose?: () => void;
  isModal?: boolean;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  student,
  ci,
  visitor,
  onClose,
  isModal = false
}) => {
  const { showToast, logActivity } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isStudent = !!student;
  const isCI = !!ci;
  const isVisitor = !!visitor;

  // Primary data attributes
  const name = student?.name || ci?.name || visitor?.name || 'Peserta RSKH';
  const roleLabel = isStudent
    ? 'MAHASISWA PRAKTIK KLINIK'
    : isCI
    ? 'CLINICAL INSTRUCTOR (CI)'
    : 'KARTU AKSES PENGUNJUNG';
  
  const idNumber = student?.nim || ci?.nip || visitor?.identityNumber || '-';
  const idLabel = isStudent ? 'NIM / NPM' : isCI ? 'NIP / NRP' : 'NIK / IDENTITAS';
  const institution = student?.institutionName || ci?.department || visitor?.institution || 'Rumah Sakit TK II Kartika Husada';
  const subInfo = student?.studyProgram || ci?.title || visitor?.purpose || '-';
  const room = student?.roomName || ci?.specialization || visitor?.destinationUnit || 'Semua Unit Terdaftar';
  const period = student ? `${student.periodStart} s/d ${student.periodEnd}` : isVisitor ? visitor?.visitDate : 'Permanen / Aktif';
  const cardNumber = student?.cardNumber || (isCI ? `RSKH-CI-${ci?.nip}` : visitor?.registrationNumber) || 'RSKH-CARD-001';
  const qrToken = student?.qrCodeToken || ci?.qrCodeToken || visitor?.qrPassToken || 'RSKH-VERIFIED-TOKEN';
  const avatar = student?.avatar || ci?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const status = student?.cardStatus || (isVisitor ? (visitor?.status === 'Aktif' ? 'Aktif' : 'Selesai') : 'Aktif');

  const handleCopyToken = () => {
    navigator.clipboard.writeText(qrToken);
    setCopiedToken(true);
    showToast('Disalin', 'Token QR berhasil disalin ke clipboard.', 'info');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePrint = () => {
    logActivity('PRINT_KARTU_DIGITAL', name, `Cetak ID Card: ${cardNumber}`);
    window.print();
  };

  const CardContent = (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div className="w-[360px] sm:w-[410px] h-[620px] perspective-1000 select-none">
        <div
          className={`relative w-full h-full duration-700 transform-style-3d transition-transform rounded-2xl shadow-2xl border border-slate-700/30 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= FRONT SIDE ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#102a4e] to-[#0a192f] text-white flex flex-col justify-between p-6 border-2 border-amber-500/40 shadow-inner">
            {/* Top RSKH Military Health Header */}
            <div>
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center space-x-2.5">
                  <HospitalLogo variant="emblem" size="md" />
                  <div>
                    <h3 className="text-[13px] font-black tracking-wider text-emerald-400 uppercase leading-none">
                      RS TK II KARTIKA HUSADA
                    </h3>
                    <p className="text-[10px] text-slate-300 font-medium tracking-tight mt-0.5">
                      Instalasi Pendidikan & Pelatihan (Instaldik)
                    </p>
                  </div>
                </div>

                {/* Military / Badge Icon */}
                <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-widest">
                  KESDAM XII/TPR
                </div>
              </div>

              {/* Role Ribbon */}
              <div className="mt-2.5 text-center">
                <span
                  className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                    isStudent
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
                      : isCI
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                  }`}
                >
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Middle: Enlarged Photo & Core Credentials */}
            <div className="flex flex-col items-center text-center my-auto">
              <div className="relative group">
                {/* Enlarged Photo Box (High-contrast gold border & subtle glow) */}
                <div className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-slate-800 p-1 ring-4 ring-amber-500/20 transition duration-300 group-hover:ring-amber-500/40">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {status === 'Aktif' && (
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white mt-2.5 line-clamp-1 max-w-[320px]">
                {name}
              </h2>
              <div className="text-xs font-mono text-amber-300 font-semibold mt-0.5">
                {idLabel}: {idNumber}
              </div>

              <div className="w-full mt-2.5 px-3.5 py-2 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/60 text-left space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Institusi / Dept:</span>
                  <span className="font-medium text-slate-100 text-right truncate max-w-[190px]">{institution}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Prodi / Posisi:</span>
                  <span className="font-medium text-amber-200 text-right truncate max-w-[190px]">{subInfo}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Ruangan Stase:</span>
                  <span className="font-medium text-slate-100 text-right truncate max-w-[190px]">{room}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Masa Berlaku:</span>
                  <span className="font-medium text-emerald-300 text-right">{period}</span>
                </div>
              </div>
            </div>

            {/* Bottom: QR Code snippet & Card Number */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">No. Kartu Digital</div>
                <div className="text-[11px] font-mono font-bold text-amber-400">{cardNumber}</div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  STATUS: {status.toUpperCase()}
                </div>
              </div>

              <div className="bg-white p-1.5 rounded-lg shadow-md flex items-center justify-center">
                <QRCodeSVG
                  value={qrToken}
                  size={48}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1b33] via-[#0f2442] to-[#0b1b33] text-white flex flex-col justify-between p-6 border-2 border-amber-500/40 shadow-inner">
            {/* Top Back Header */}
            <div>
              <div className="text-center border-b border-amber-500/30 pb-2">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  QR ABSENSI & VERIFIKASI RESMI
                </h4>
                <p className="text-[10px] text-slate-300">Scan QR ini pada terminal absensi ruangan & gerbang RSKH</p>
              </div>
            </div>

            {/* Center: Large Scannable QR Code */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-amber-400/80">
                <QRCodeSVG
                  value={qrToken}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-3 text-center">
                <div className="text-[10px] font-mono text-slate-400">TOKEN SECURE RSKH</div>
                <div className="text-[11px] font-mono font-bold text-amber-300 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-700/80 mt-0.5 select-all">
                  {qrToken}
                </div>
              </div>
            </div>

            {/* Bottom Rules & Contact */}
            <div className="pt-2 border-t border-slate-700/60 text-[9px] text-slate-300 space-y-1">
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Kartu ini wajib dikenakan selama kegiatan praktik klinik di RS TK II Kartika Husada.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Dilarang meminjamkan QR Absensi kepada mahasiswa lain (pelanggaran disiplin berat).</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-400 font-bold">3.</span>
                <span>Bila kartu hilang, segera lapor ke Sekretariat Instaldik RSKH (0561-734567).</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons (Flip, Print, Copy Token, Download) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          {isFlipped ? 'Lihat Sisi Depan' : 'Lihat QR Belakang'}
        </button>

        <button
          onClick={handleCopyToken}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-2 border border-slate-700 shadow-sm"
        >
          {copiedToken ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedToken ? 'Token Tersalin' : 'Salin Token QR'}
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak Kartu
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <IdCard className="w-5 h-5 text-amber-400" />
              Kartu Identitas Digital RSKH
            </h3>
            <p className="text-xs text-slate-400">Verifikasi terintegrasi sistem barcode & QR absensi presensi stase</p>
          </div>

          {CardContent}
        </div>
      </div>
    );
  }

  return CardContent;
};
