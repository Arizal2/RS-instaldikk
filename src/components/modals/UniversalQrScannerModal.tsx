import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ShiftType, PracticeRoom } from '../../types';
import {
  QrCode,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  RefreshCw,
  Clock,
  Building2,
  UserCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  LogOut,
  LogIn
} from 'lucide-react';

export const UniversalQrScannerModal: React.FC = () => {
  const {
    scannerModal,
    closeScanner,
    students,
    rooms,
    checkInStudentViaQR,
    checkOutStudentViaQR,
    showToast
  } = useApp();

  const [scanMode, setScanMode] = useState<'checkin' | 'checkout' | 'verify'>('checkin');
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Pagi');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room_1');
  const [inputTokenOrNim, setInputTokenOrNim] = useState<string>('');
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    student?: Student;
    record?: any;
    timestamp: string;
  } | null>(null);

  // Play a crisp audio beep on scan
  const playBeep = (isSuccess: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = isSuccess ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(isSuccess ? 880 : 330, audioCtx.currentTime); // A5 or E4
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // Audio context might not be allowed without direct user click
    }
  };

  const handleExecuteScan = (tokenToProcess: string) => {
    if (!tokenToProcess.trim()) return;

    if (scanMode === 'checkin') {
      const res = checkInStudentViaQR(tokenToProcess, selectedShift, selectedRoomId);
      playBeep(res.success);
      setScanResult({
        success: res.success,
        message: res.message,
        student: res.student,
        record: res.record,
        timestamp: new Date().toLocaleTimeString('id-ID')
      });
    } else if (scanMode === 'checkout') {
      const res = checkOutStudentViaQR(tokenToProcess);
      playBeep(res.success);
      setScanResult({
        success: res.success,
        message: res.message,
        student: res.student,
        record: res.record,
        timestamp: new Date().toLocaleTimeString('id-ID')
      });
    } else {
      // Verify mode
      const clean = tokenToProcess.trim().toLowerCase();
      const student = students.find(s => 
        s.qrCodeToken.toLowerCase() === clean ||
        s.nim.toLowerCase() === clean ||
        s.id.toLowerCase() === clean
      );

      if (student) {
        playBeep(true);
        setScanResult({
          success: true,
          message: `Kartu Mahasiswa TERVERIFIKASI ASLI. Status Akun: ${student.accountStatus}, Stase: ${student.roomName}`,
          student,
          timestamp: new Date().toLocaleTimeString('id-ID')
        });
      } else {
        playBeep(false);
        setScanResult({
          success: false,
          message: 'Kartu atau QR Code TIDAK TERDAFTAR dalam sistem e-Instaldik RSKH.',
          timestamp: new Date().toLocaleTimeString('id-ID')
        });
      }
    }
  };

  if (!scannerModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Terminal Scanner Presensi QR RSKH
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pindai Kartu Digital Mahasiswa, CI, atau Pengunjung secara real-time
              </p>
            </div>
          </div>

          <button
            onClick={closeScanner}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode Tabs (Check-In, Check-Out, Verifikasi) */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 mb-5">
          <button
            onClick={() => { setScanMode('checkin'); setScanResult(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'checkin'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Check-In Masuk
          </button>

          <button
            onClick={() => { setScanMode('checkout'); setScanResult(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'checkout'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            Check-Out Pulang
          </button>

          <button
            onClick={() => { setScanMode('verify'); setScanResult(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'verify'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verifikasi ID
          </button>
        </div>

        {/* Scan Parameters (Shift & Room if Check-in) */}
        {scanMode === 'checkin' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Pilih Shift Dinas Praktik:
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value as ShiftType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Pagi">Shift Pagi (07.00 - 14.00 WIB)</option>
                <option value="Siang">Shift Siang (14.00 - 21.00 WIB)</option>
                <option value="Malam">Shift Malam (21.00 - 07.00 WIB)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Lokasi Terminal / Ruangan Stase:
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Scanner Viewfinder & Camera Simulation */}
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden h-52 sm:h-56 flex flex-col items-center justify-center shadow-inner mb-5">
          {/* Animated Scanning Beam */}
          <div className="absolute inset-x-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce duration-1000"></div>

          {/* Viewfinder Target Corner Accents */}
          <div className="relative w-40 h-40 border-2 border-dashed border-amber-500/50 rounded-2xl flex flex-col items-center justify-center p-3 bg-slate-900/40 backdrop-blur-[2px]">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br"></div>

            <Camera className="w-8 h-8 text-amber-400/80 mb-2 animate-pulse" />
            <span className="text-[10px] text-slate-400 text-center font-mono uppercase tracking-wider">
              Arahkan QR ke Kamera
            </span>
          </div>

          <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>TERMINAL: RSKH-STATION-01</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              SENSOR AKTIF
            </span>
          </div>
        </div>

        {/* Manual Barcode / NIM / Token Input */}
        <div className="mb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteScan(inputTokenOrNim);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik NIM / No. Registrasi / Paste Token QR..."
                value={inputTokenOrNim}
                onChange={(e) => setInputTokenOrNim(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Zap className="w-3.5 h-3.5" />
              Proses Scan
            </button>
          </form>
        </div>

        {/* Quick Pick Sample Students (For 1-Click Interactive Demo Testing) */}
        <div className="mb-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Test: Klik Mahasiswa untuk Simulasi Scan Langsung:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {students.slice(0, 5).map(std => (
              <button
                key={std.id}
                type="button"
                onClick={() => {
                  setInputTokenOrNim(std.qrCodeToken);
                  handleExecuteScan(std.qrCodeToken);
                }}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-[11px] text-slate-200 flex items-center gap-1.5 transition"
              >
                <img src={std.avatar} alt={std.name} className="w-4 h-4 rounded-full object-cover" />
                <span className="font-medium">{std.nickname || std.name.split(' ')[0]}</span>
                <span className="text-[9px] text-amber-400 font-mono">({std.nim})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Result Feedback Card */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border transition animate-fadeIn ${
              scanResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {scanResult.success ? 'HASIL PEMINDAIAN BERHASIL' : 'PEMINDAIAN GAGAL'}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {scanResult.timestamp}
                  </span>
                </div>
                <p className="text-xs mt-1 font-medium text-slate-200">{scanResult.message}</p>

                {scanResult.student && (
                  <div className="mt-3 p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center gap-3 text-xs">
                    <img
                      src={scanResult.student.avatar}
                      alt={scanResult.student.name}
                      className="w-11 h-11 rounded-lg object-cover border border-amber-400/50"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">{scanResult.student.name}</div>
                      <div className="text-[11px] text-amber-300 font-mono">
                        NIM: {scanResult.student.nim} • {scanResult.student.studyProgram}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {scanResult.student.institutionName} • Stase: {scanResult.student.roomName}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
