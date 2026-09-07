import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  QrCode,
  IdCard,
  FileText,
  DoorOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Info
} from 'lucide-react';
import { Visitor } from '../../types';

export const GuestDashboard: React.FC = () => {
  const {
    currentUser,
    visitors,
    rooms,
    documents,
    libraryItems,
    setCurrentView,
    openDigitalCard,
    openPdfViewer,
    addVisitor,
    showToast
  } = useApp();

  // Find visitor record for currentUser
  const myVisitorRecord = visitors.find(
    v => v.email.toLowerCase() === currentUser.email.toLowerCase() ||
         v.name.toLowerCase() === currentUser.name.toLowerCase()
  ) || visitors[0];

  // Quick form for new visit request / check-in
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [position, setPosition] = useState(currentUser.specialization || 'Pengunjung / Peneliti');
  const [purpose, setPurpose] = useState<'Kunjungan' | 'Rapat' | 'Pendidikan' | 'Studi Banding' | 'Penelitian' | 'Kerja Sama' | 'Lainnya'>('Studi Banding');
  const [targetUnit, setTargetUnit] = useState('Instalasi Pendidikan (Instaldik) RSKH');
  const [notes, setNotes] = useState('');

  const handleRegisterVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor: Omit<Visitor, 'id'> = {
      registrationNumber: 'VIS-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      name: currentUser.name,
      institution: institution || 'Institusi Umum',
      position: position || 'Pengunjung',
      phone: currentUser.phone || '0812-3456-7890',
      email: currentUser.email,
      purpose: purpose,
      targetPersonOrUnit: targetUnit,
      visitDate: new Date().toISOString().split('T')[0],
      entryTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Aktif',
      qrPassToken: 'PASS-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    addVisitor(newVisitor);
    showToast('Registrasi Kunjungan Berhasil', 'Visitor Pass Digital Anda telah diterbitkan.', 'success');
    setShowVisitForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border border-amber-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Portal Akses Tamu & Peneliti
              </span>
              <span className="text-xs text-slate-400">
                Instaldik RS TK II Kartika Husada
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Selamat Datang, {currentUser.name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Anda masuk dengan peran <span className="font-semibold text-amber-400 uppercase">Tamu / Pengunjung</span>. Di portal ini Anda dapat melihat Visitor Pass QR Code, mendaftar kunjungan dinas/studi banding, menjelajahi e-Library publik, dan meninjau sarana pendidikan RSKH.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => openDigitalCard({ visitor: myVisitorRecord })}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/50 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Tampilkan Visitor Pass (QR)</span>
            </button>

            <button
              onClick={() => setShowVisitForm(!showVisitForm)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daftar Kunjungan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Visit Request Modal / Card */}
      {showVisitForm && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Formulir Pendaftaran Kunjungan / Buku Tamu
                </h3>
                <p className="text-xs text-slate-400">
                  Daftarkan rencana kunjungan studi banding, izin penelitian, atau keperluan dinas Anda ke Instalasi Pendidikan RSKH.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVisitForm(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleRegisterVisit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Asal Instansi / Universitas / Lembaga
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Contoh: Poltekkes / Dinas Kesehatan / RS Lain"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jabatan / Profesi
                </label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Contoh: Dosen Peneliti / Perawat / Pejabat Struktural"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tujuan / Keperluan
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                >
                  <option value="Studi Banding">Studi Banding</option>
                  <option value="Penelitian">Izin Penelitian / Pengambilan Data</option>
                  <option value="Pendidikan">Konsultasi Pendidikan Klinik</option>
                  <option value="Rapat">Rapat Koordinasi Institusi</option>
                  <option value="Kerja Sama">Kerja Sama / MoU Praktik</option>
                  <option value="Kunjungan">Kunjungan Umum</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unit Kerja / Orang yang Dituju
                </label>
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="Contoh: Kepala Instalasi Pendidikan (Kainstaldik) / Komite Keperawatan"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jumlah rombongan, waktu perkiraan, dsb."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowVisitForm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim & Terbitkan Visitor Pass</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: 1. Visitor Pass Card & 2. Quick Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Visitor Pass Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Visitor Pass Aktif
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {myVisitorRecord?.status || 'Aktif'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center space-y-3">
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-300">
                RS TK II KARTIKA HUSADA KUBU RAYA
              </div>
              
              <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                {/* Visual QR Code Representation */}
                <div className="w-full h-full border-2 border-slate-900 flex flex-col items-center justify-center p-1 text-slate-900">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] font-mono font-bold tracking-tighter">
                    {myVisitorRecord?.qrPassToken || 'PASS-RSKH'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">
                  {myVisitorRecord?.name || currentUser.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {myVisitorRecord?.institution || currentUser.institution || 'Tamu / Umum'}
                </p>
                <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-amber-300">
                  Keperluan: {myVisitorRecord?.purpose || 'Kunjungan Edukasi'}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>No: {myVisitorRecord?.registrationNumber || 'VIS-2026-001'}</span>
                <span>Tgl: {myVisitorRecord?.visitDate || new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex gap-2">
              <button
                onClick={() => openDigitalCard({ visitor: myVisitorRecord })}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Lihat Kartu Besar</span>
              </button>
              <button
                onClick={() => {
                  showToast('Unduhan Siap', 'Visitor Pass tersimpan untuk akses gate security RSKH.', 'info');
                }}
                className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Sekretariat Instaldik RSKH</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Jl. Adi Sucipto No. 1, Sungai Raya, Kubu Raya, Kalimantan Barat 78391
            </p>
            <div className="pt-1 flex flex-col gap-1.5 text-slate-300 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Telp: (0561) 721234 / Ext. 108</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>diklat@rskartikahusada.mil.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Jam Layanan: Senin - Jumat (07.30 - 15.30 WIB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Facilities & Public Resources */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Services for Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div
              onClick={() => setCurrentView('rooms')}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <DoorOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm">
                Fasilitas & Ruangan
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Tinjau {rooms.length} sarana laboratorium, IGD, ICU & ruang rawat stase.
              </p>
              <div className="mt-3 flex items-center text-[11px] font-semibold text-emerald-400 gap-1">
                <span>Jelajahi Fasilitas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('library')}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm">
                e-Library & Pedoman
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Akses buku panduan stase, modul klinis, dan pedoman orientasi.
              </p>
              <div className="mt-3 flex items-center text-[11px] font-semibold text-blue-400 gap-1">
                <span>Buka e-Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('landing')}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm">
                Beranda Publik
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Kembali ke landing page profil Instalasi Pendidikan RSKH.
              </p>
              <div className="mt-3 flex items-center text-[11px] font-semibold text-amber-400 gap-1">
                <span>Lihat Beranda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Practice Rooms Available for Observation */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Daftar Sarana Pendidikan Terbuka untuk Observasi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fasilitas pembelajaran klinik yang mendukung stase mahasiswa dan kunjungan studi banding
                </p>
              </div>
              <button
                onClick={() => setCurrentView('rooms')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Lihat Semua Ruangan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.slice(0, 4).map((room) => (
                <div
                  key={room.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {room.type} • Lt. {room.floor}
                    </span>
                    <h5 className="font-bold text-slate-200 text-xs sm:text-sm">
                      {room.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      Kapasitas {room.capacity} Mahasiswa • Pembimbing: {room.supervisorName}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tersedia
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Observation Guidance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Prosedur Izin Penelitian & Studi Banding di RSKH</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400">LANGKAH 01</span>
                <div className="font-bold text-slate-200">Surat Pengantar</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Membawa surat resmi dari kampus/instansi asal ditujukan kepada Kepala Rumah Sakit TK II Kartika Husada.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400">LANGKAH 02</span>
                <div className="font-bold text-slate-200">Registrasi & QR Pass</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lakukan registrasi di sistem e-Instaldik untuk mendapatkan nomor izin dan Visitor Pass digital resmi.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400">LANGKAH 03</span>
                <div className="font-bold text-slate-200">Orientasi & Pelaksanaan</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Menghubungi Kainstaldik untuk pengarahan tata tertib rumah sakit militer sebelum observasi lapangan.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
