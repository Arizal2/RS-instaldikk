import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { HospitalLogo } from './common/HospitalLogo';
import {
  Shield,
  GraduationCap,
  Stethoscope,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Building2,
  Users,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight,
  Lock,
  Eye,
  FileCheck2,
  Hospital
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const {
    login,
    allUsers,
    setCurrentView,
    rooms,
    institutions,
    students,
    libraryItems,
    openPdfViewer,
    showToast,
    openAuthModal
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('admin');
  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role) || allUsers[0];
    login(targetUser);
    setIsLoginModalOpen(false);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      showToast('Login Gagal', 'Silakan masukkan username atau pilih salah satu akun demo di bawah.', 'error');
      return;
    }
    const matched = allUsers.find(u => u.username.toLowerCase() === customUsername.toLowerCase().trim()) || allUsers[0];
    login(matched);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Announcement */}
      <div className="bg-[#07111e] text-amber-300 text-xs py-2 px-4 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
              KODAM XII / TANJUNGPURA
            </span>
            <span className="text-slate-300 text-xs truncate">
              Rumah Sakit TK II Kartika Husada - Pusat Pendidikan & Pelatihan Kesehatan Militer & Sipil
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Pelayanan 24 Jam</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> (0561) 773123</span>
          </div>
        </div>
      </div>

      {/* Navigation Header for Landing */}
      <header className="sticky top-0 z-30 bg-[#0B192C] text-white border-b border-slate-800/80 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <HospitalLogo variant="full" size="md" theme="dark" />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#tentang" className="hover:text-amber-400 transition-colors">Tentang Instaldik</a>
            <a href="#program" className="hover:text-amber-400 transition-colors">Program Pendidikan</a>
            <a href="#fasilitas" className="hover:text-amber-400 transition-colors">Fasilitas Praktik</a>
            <a href="#ruangan" className="hover:text-amber-400 transition-colors">Ruangan Klinis</a>
            <a href="#elibrary" className="hover:text-amber-400 transition-colors">e-Library Publik</a>
            <a href="#kontak" className="hover:text-amber-400 transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-landing-register"
              onClick={() => openAuthModal('register')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Daftar Akun (5 Role)</span>
            </button>

            <button
              id="btn-landing-login"
              onClick={() => openAuthModal('login')}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk Sistem (Login)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0B192C] via-[#0e2139] to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative background grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#d4af3715_1px,transparent_1px),linear-gradient(to_bottom,#d4af3715_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Informasi Terpadu Instalasi Pendidikan RSKH</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              e-Instaldik <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">RSKH</span>
            </h1>

            <p className="text-lg sm:text-xl text-amber-200/90 font-medium font-serif italic">
              “Digitalisasi Pendidikan dan Praktik Klinik Terintegrasi”
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Platform tata kelola terintegrasi untuk mahasiswa kedokteran, profesi ners, kebidanan, dan farmasi klinis di Rumah Sakit TK II Kartika Husada. Memfasilitasi rotasi klinis, logbook digital, pre/post-test terstandar, konsultasi bimbingan CI & Dosen, serta evaluasi mutu berkesinambungan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-btn-login"
                onClick={() => openAuthModal('login')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-btn-register"
                onClick={() => openAuthModal('register')}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4" />
                <span>Daftar Akun Baru (5 Role)</span>
              </button>

              <button
                id="hero-btn-credentials"
                onClick={() => openAuthModal('credentials')}
                className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-amber-300 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Cek Password 5 Role</span>
              </button>
            </div>

            {/* Highlights badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">Akreditasi Paripurna STARKES</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Supervisi CI Berlisensi</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">Logbook & SOAP Digital</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role Selector Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Hospital className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Akses Cepat Demo Pengguna</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  Ready to Test
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Klik salah satu role di bawah untuk langsung mencoba aplikasi e-Instaldik RSKH tanpa perlu input password:
              </p>

              <div className="space-y-2.5">
                <button
                  id="quick-login-admin"
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-rose-300">
                        Admin Instaldik RSKH
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mayor Ckm dr. Andi Wijaya, Sp.PD (Full Access)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>

                <button
                  id="quick-login-ci"
                  onClick={() => handleQuickLogin('ci')}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">
                        Clinical Instructor (CI)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ns. Siti Rahmawati, M.Kep (Bimbingan & Review)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>

                <button
                  id="quick-login-mahasiswa"
                  onClick={() => handleQuickLogin('mahasiswa')}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                        Mahasiswa Praktik
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Rizal Fahmi Pratama (Ners UNTAN)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>

                <button
                  id="quick-login-dosen"
                  onClick={() => handleQuickLogin('dosen')}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-blue-500/30 hover:border-blue-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300">
                        Dosen Pembimbing Kampus
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Dr. Ns. Yuliana Triastuti, M.Kep (Monitoring)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>

                <button
                  id="quick-login-tamu"
                  onClick={() => handleQuickLogin('tamu')}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">
                        Tamu & Pengunjung / Peneliti
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Drs. H. Bambang Subagyo (Studi Banding & Pass QR)
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Users className="w-4 h-4" />
                  <span>Klik Di Sini Untuk Daftar Akun Baru (User & Password Sendiri)</span>
                </button>
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span>Pilihan 5 Role: Admin, CI, Dosen, Mhs, Tamu</span>
                  <button 
                    onClick={() => openAuthModal('credentials')} 
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Lihat Akun Demo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Counter Bar */}
      <section className="bg-[#07111e] text-white py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">114+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Mahasiswa Aktif Praktik</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">{rooms.length}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Ruangan Stase Klinis</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{institutions.length}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Institusi Mitra Universitas</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">1,040+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Alumni Tenaga Kesehatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Tentang Instaldik RSKH */}
      <section id="tentang" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>PROFIL INSTALASI PENDIDIKAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C]">
              Menghasilkan Tenaga Medis Unggul, Berdisiplin & Profesional
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instalasi Pendidikan (Instaldik) Rumah Sakit TK II Kartika Husada merupakan unit pelaksana teknis yang bertanggung jawab mengoordinasikan seluruh kegiatan pendidikan, pelatihan, dan praktik klinik di rumah sakit.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dengan memadukan kedisiplinan prajurit kesehatan TNI Angkatan Darat serta standar pelayanan medis mutakhir, Instaldik RSKH membina mahasiswa calon dokter, ners, bidan, dan apoteker menjadi insan kesehatan yang beretika, tanggap, dan adaptif di medan pengabdian.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-xs text-[#0B192C] flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> Visi Instaldik
                </h4>
                <p className="text-xs text-slate-500">
                  Menjadi rumah sakit pendidikan terkemuka di Kalimantan Barat yang unggul dalam pelayanan trauma, bedah, dan kegawatdaruratan.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h4 className="font-bold text-xs text-[#0B192C] flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> Misi Utama
                </h4>
                <p className="text-xs text-slate-500">
                  Menyelenggarakan bimbingan klinis komprehensif berstandar IPKP STARKES dengan menjunjung tinggi keselamatan pasien.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"
                alt="Gedung RS Kartika Husada"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  RS PENDIDIKAN TK II
                </span>
                <h3 className="font-bold text-base mt-1">Rumah Sakit TK II Kartika Husada</h3>
                <p className="text-xs text-slate-300">Jl. Adi Sucipto Km 3.5, Sungai Raya, Kubu Raya / Pontianak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Program Pendidikan */}
      <section id="program" className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Kemitraan Akademik
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C] mt-2">
              Program Pendidikan & Stase Praktik Klinik
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Kerjasama resmi penyelenggaraan kepaniteraan klinik dan praktik lapangan bersama perguruan tinggi kesehatan terakreditasi:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutions.map(inst => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={inst.logo}
                      alt={inst.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {inst.code}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1 leading-tight">{inst.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {inst.address}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mahasiswa Aktif:</span>
                      <span className="font-bold text-blue-700">{inst.activeStudents} Orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Alumni Lulus:</span>
                      <span className="font-semibold text-slate-800">{inst.totalAlumni} Lulusan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Narahubung:</span>
                      <span className="text-slate-700 truncate max-w-[140px]">{inst.contactPerson}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[11px]">
                    ● MoU Aktif 2026-2029
                  </span>
                  <span className="text-slate-400">{inst.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Ruangan Praktik Klinis */}
      <section id="ruangan" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Wahana Pendidikan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C] mt-2">
              Ruangan & Unit Praktik Klinis
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Fasilitas ruangan dengan kelengkapan alat biomedis modern dan rasio bimbingan ideal.
            </p>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Lihat Jadwal Seluruh Ruangan →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.slice(0, 8).map(room => (
            <div
              key={room.id}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0B192C] text-amber-400">
                    {room.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {room.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                  {room.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" /> {room.building} ({room.floor})
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="text-slate-500">Kapasitas Mahasiswa:</span>
                  <span className="font-bold text-slate-800">{room.currentStudentsCount} / {room.capacity}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(room.currentStudentsCount / room.capacity) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 truncate">
                  CI Penanggung Jawab: <span className="font-semibold text-slate-700">{room.ciInChargeName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: e-Library Publik */}
      <section id="elibrary" className="py-16 bg-[#0B192C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/30">
                Perpustakaan Digital
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                e-Library & Materi Edukasi Terbuka
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Akses modul SOP, pedoman keselamatan pasien, dan buku ajar klinis RS TK II Kartika Husada.
              </p>
            </div>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              Buka Katalog Lengkap (10+ Modul)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryItems.filter(i => i.isPublic).slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col justify-between group hover:border-amber-400/80 transition"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {item.docType} • {item.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    {item.author}
                  </p>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {item.fileFormat} • {item.fileSize}
                  </span>

                  <button
                    onClick={() => openPdfViewer(item.title, item.pdfUrl, item.fileFormat, item.docType, item.author)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca Dokumen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Informasi & Berita Terbaru */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            PENGUMUMAN & WARTA
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B192C] mt-2">
            Informasi Terbaru Instaldik RSKH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-medium">01 September 2026</span>
            <h4 className="font-bold text-sm text-[#0B192C] mt-1">
              Pembukaan Orientasi Mahasiswa Praktik Periode Ganjil 2026/2027
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Seluruh mahasiswa stase baru diwajibkan menyelesaikan Pre-Test Keselamatan Pasien dan PPI di portal e-Instaldik sebelum dinas perdana.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-medium">28 Agustus 2026</span>
            <h4 className="font-bold text-sm text-[#0B192C] mt-1">
              Sosialisasi Kebijakan Digitalisasi Logbook dan Format SOAP Online
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Pengumpulan tugas asuhan keperawatan dan laporan kasus kini terintegrasi langsung dengan verifikasi tanda tangan digital para CI.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-medium">20 Agustus 2026</span>
            <h4 className="font-bold text-sm text-[#0B192C] mt-1">
              Workshop Peningkatan Kapasitas Clinical Instructor (CI) Kemenkes RI
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              25 Tenaga Medis & Perawat Senior RSKH menyelesaikan pelatihan bimbingan klinik berbasis outcome-based education.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Kontak & Lokasi */}
      <section id="kontak" className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center font-serif text-base">
                RSKH
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Instalasi Pendidikan (Instaldik)</h3>
                <p className="text-xs text-amber-400">RS TK II Kartika Husada • Kesdam XII/Tpr</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Gedung Instalasi Pendidikan Lt. 2, Kompleks Rumah Sakit TK II Kartika Husada, Jl. Adi Sucipto Km 3.5, Sungai Raya, Kabupaten Kubu Raya, Kalimantan Barat 78391.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Sekretariat Instaldik: (0561) 773123 ext. 204</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>instaldik@rskartikahusada.mil.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Jam Layanan Administrasi: Senin - Jumat (07.00 - 15.30 WIB)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-sm text-white mb-2">Pusat Bantuan & Layanan Mahasiswa Praktik</h4>
            <p className="text-xs text-slate-400 mb-4">
              Ada pertanyaan terkait jadwal dinas, pengajuan izin stase, atau kendala akun e-Instaldik? Silakan hubungi meja piket Instaldik:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/628115789001"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Hotline Instaldik</span>
              </a>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                Masuk ke Sistem e-Instaldik
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 Rumah Sakit TK II Kartika Husada. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>e-Instaldik RSKH • Versi Terintegrasi v2.4 (React & TypeScript)</p>
        </div>
      </section>

      {/* Interactive Login Modal with 1-Click Role Accounts */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
          >
            <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <HospitalLogo variant="emblem" size="md" />
                <div>
                  <h3 className="font-bold text-base text-white">Login e-Instaldik <span className="text-emerald-400 font-serif">RSKH</span></h3>
                  <p className="text-xs text-slate-300">Pilih akun role atau input kredensial</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                1-Klik Masuk Sesuai Role (Demo Mode)
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  id="modal-login-admin"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition flex items-center gap-2.5"
                >
                  <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-rose-900">Admin Instaldik</div>
                    <div className="text-[10px] text-rose-700 truncate">dr. Andi Wijaya</div>
                  </div>
                </button>

                <button
                  id="modal-login-ci"
                  onClick={() => handleQuickLogin('ci')}
                  className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition flex items-center gap-2.5"
                >
                  <Stethoscope className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-amber-900">Clinical Instructor</div>
                    <div className="text-[10px] text-amber-700 truncate">Ns. Siti Rahmawati</div>
                  </div>
                </button>

                <button
                  id="modal-login-mahasiswa"
                  onClick={() => handleQuickLogin('mahasiswa')}
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition flex items-center gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-900">Mahasiswa Praktik</div>
                    <div className="text-[10px] text-emerald-700 truncate">Rizal Fahmi Pratama</div>
                  </div>
                </button>

                <button
                  id="modal-login-dosen"
                  onClick={() => handleQuickLogin('dosen')}
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition flex items-center gap-2.5"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-blue-900">Dosen Kampus</div>
                    <div className="text-[10px] text-blue-700 truncate">Dr. Ns. Yuliana</div>
                  </div>
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">atau login manual</span>
                </div>
              </div>

              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username / NIM / NIP
                  </label>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={e => setCustomUsername(e.target.value)}
                    placeholder="Contoh: admin / ci_siti / std_rizal"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md transition mt-2"
                >
                  Masuk Sekarang
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
