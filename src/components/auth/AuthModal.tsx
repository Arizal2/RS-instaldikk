import React, { useState, useEffect } from 'react';
import {
  UserRole,
  RegisterUserData,
  User
} from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Copy,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  FileBadge,
  Check
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModal,
    closeAuthModal,
    registerUser,
    authenticateUser,
    allUsers,
    institutions,
    rooms,
    login
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'credentials'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('mahasiswa');
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [regIdentifier, setRegIdentifier] = useState(''); // NIM/NIP/NIDN
  const [regInstitution, setRegInstitution] = useState('');
  const [regStudyProgram, setRegStudyProgram] = useState('');
  const [regSpecialization, setRegSpecialization] = useState('');
  const [regEducationLevel, setRegEducationLevel] = useState<'D3' | 'D4' | 'S1' | 'Profesi Ners' | 'Profesi Dokter' | 'Spesialis'>('Profesi Ners');
  const [regSemester, setRegSemester] = useState<number>(1);
  const [regRoomId, setRegRoomId] = useState('');
  const [regVisitorPurpose, setRegVisitorPurpose] = useState<'Kunjungan' | 'Rapat' | 'Pendidikan' | 'Studi Banding' | 'Penelitian' | 'Kerja Sama' | 'Lainnya'>('Studi Banding');
  const [regAdminPasscode, setRegAdminPasscode] = useState('');
  
  const [registerError, setRegisterError] = useState('');
  const [registeredAccount, setRegisteredAccount] = useState<User | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync tab with authModal changes
  useEffect(() => {
    if (authModal.isOpen) {
      setActiveTab(authModal.initialTab || 'login');
      if (authModal.defaultRole) {
        setSelectedRole(authModal.defaultRole);
      }
      setLoginError('');
      setLoginSuccess('');
      setRegisterError('');
      setRegisteredAccount(null);
    }
  }, [authModal.isOpen, authModal.initialTab, authModal.defaultRole]);

  // Set default room and institution on mount/role change
  useEffect(() => {
    if (institutions.length > 0 && !regInstitution) {
      setRegInstitution(institutions[0].name);
    }
    if (rooms.length > 0 && !regRoomId) {
      setRegRoomId(rooms[0].id);
    }
  }, [institutions, rooms, regInstitution, regRoomId]);

  if (!authModal.isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginIdentifier.trim()) {
      setLoginError('Mohon isi Username, NIM, NIP, atau Email Anda.');
      return;
    }

    const res = authenticateUser(loginIdentifier, loginPassword);
    if (res.success) {
      setLoginSuccess(`Login berhasil! Selamat datang, ${res.user?.name}.`);
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Validations
    if (!regName.trim()) {
      setRegisterError('Nama lengkap wajib diisi.');
      return;
    }
    if (!regUsername.trim()) {
      setRegisterError('Username wajib diisi.');
      return;
    }
    if (regUsername.length < 3) {
      setRegisterError('Username minimal 3 karakter tanpa spasi.');
      return;
    }
    if (!regPassword) {
      setRegisterError('Kata sandi (password) wajib diisi.');
      return;
    }
    if (regPassword.length < 4) {
      setRegisterError('Kata sandi minimal 4 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Konfirmasi kata sandi tidak sama dengan kata sandi.');
      return;
    }

    const cleanUsername = regUsername.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanEmail = regEmail.trim().toLowerCase() || `${cleanUsername}@rskartikahusada.mil.id`;

    const selectedRoom = rooms.find(r => r.id === regRoomId);

    const payload: RegisterUserData = {
      name: regName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: regPassword,
      role: selectedRole,
      phone: regPhone.trim() || '0812-3456-7890',
      gender: regGender,
      identifierNumber: regIdentifier.trim(),
      institution: regInstitution.trim() || (selectedRole === 'admin' ? 'RS TK II Kartika Husada' : 'Universitas Mitra'),
      studyProgram: regStudyProgram.trim() || (selectedRole === 'mahasiswa' ? 'Profesi Ners (S.Kep)' : ''),
      specialization: regSpecialization.trim(),
      educationLevel: regEducationLevel,
      semester: regSemester,
      roomId: regRoomId,
      roomName: selectedRoom ? selectedRoom.name : 'Instalasi Pendidikan RSKH',
      visitorPurpose: regVisitorPurpose,
      adminPasscode: regAdminPasscode
    };

    const res = registerUser(payload);
    if (res.success && res.user) {
      setRegisteredAccount(res.user);
    } else {
      setRegisterError(res.message);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickLoginRole = (role: UserRole) => {
    const foundUser = allUsers.find(u => u.role === role);
    if (foundUser) {
      login(foundUser);
      closeAuthModal();
    }
  };

  const roleMeta: Record<UserRole, { label: string; badge: string; color: string; desc: string; defaultUser: string; defaultPass: string }> = {
    admin: {
      label: 'Admin Instaldik',
      badge: 'bg-red-500/10 text-red-400 border-red-500/30',
      color: 'border-red-500/40 text-red-400',
      desc: 'Pengelola diklat, verifikasi stase, ujian & kartu digital',
      defaultUser: 'admin',
      defaultPass: 'admin123'
    },
    ci: {
      label: 'Clinical Instructor (CI)',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      color: 'border-emerald-500/40 text-emerald-400',
      desc: 'Pembimbing klinik rumah sakit, presensi & logbook',
      defaultUser: 'ci_siti',
      defaultPass: 'ci123'
    },
    dosen: {
      label: 'Dosen Pembimbing',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      color: 'border-purple-500/40 text-purple-400',
      desc: 'Dosen institusi kampus mitra & evaluasi mahasiswa',
      defaultUser: 'lec_yuliana',
      defaultPass: 'dosen123'
    },
    mahasiswa: {
      label: 'Mahasiswa Praktik',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      color: 'border-blue-500/40 text-blue-400',
      desc: 'Praktikan klinik, ujian pre/post test, QR kartu & logbook',
      defaultUser: 'std_rizal',
      defaultPass: 'mhs123'
    },
    tamu: {
      label: 'Tamu / Pengunjung',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      color: 'border-amber-500/40 text-amber-400',
      desc: 'Studi banding, peneliti eksternal & visitor pass',
      defaultUser: 'tamu_irwan',
      defaultPass: 'tamu123'
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Hospital Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400/30">
                KH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider uppercase">
                    Autentikasi 5 Akses
                  </span>
                  <span className="text-xs text-slate-400">RS TK II Kartika Husada</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Sistem Informasi e-Instaldik
                </h2>
              </div>
            </div>

            <button
              id="close-auth-modal-btn"
              onClick={closeAuthModal}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-5 p-1 bg-slate-950/60 border border-slate-800 rounded-xl">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setActiveTab('login');
                setRegisteredAccount(null);
                setLoginError('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Masuk (Login)</span>
            </button>

            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisteredAccount(null);
                setRegisterError('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Akun (5 Role)</span>
            </button>

            <button
              id="auth-tab-credentials"
              type="button"
              onClick={() => {
                setActiveTab('credentials');
                setRegisteredAccount(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'credentials'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Daftar Kredensial</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Masuk ke Akun Anda
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gunakan Username, NIM, NIP, atau Email dan kata sandi yang telah Anda daftarkan.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{loginError}</div>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{loginSuccess}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Username / NIM / NIP / Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="login-identifier-input"
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="Contoh: admin, ci_siti, std_rizal, atau email"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Kata Sandi (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('credentials')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Lupa / Cek Password Demo?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="submit-login-btn"
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </button>
              </form>

              {/* Callout to Register */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Belum memiliki akun sendiri?
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Daftar sekarang untuk Admin, CI, Dosen, Mahasiswa, atau Tamu.
                  </p>
                </div>
                <button
                  id="go-to-register-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegisteredAccount(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
                >
                  Klik Daftar Akun
                </button>
              </div>

              {/* Quick Login 5 Roles (Demo Shortcuts) */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Masuk Cepat Demo (1-Klik)
                  </span>
                  <span className="text-[11px] text-slate-500">5 Akses Siap Pakai</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['admin', 'ci', 'mahasiswa', 'dosen', 'tamu'] as UserRole[]).map((r) => {
                    const meta = roleMeta[r];
                    return (
                      <button
                        key={r}
                        id={`quick-login-${r}`}
                        type="button"
                        onClick={() => handleQuickLoginRole(r)}
                        className="p-2.5 text-left rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${meta.badge}`}>
                            {r.toUpperCase()}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {meta.label}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          User: <code className="text-slate-300 font-mono">{meta.defaultUser}</code>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              {/* If newly registered, show credentials card */}
              {registeredAccount ? (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Akun Berhasil Didaftarkan!
                      </h3>
                      <p className="text-xs text-emerald-300/80 mt-1 max-w-md mx-auto">
                        Selamat, akun <span className="font-semibold text-white">{registeredAccount.name}</span> dengan akses peran <span className="font-bold uppercase text-emerald-400">{registeredAccount.role}</span> telah aktif dan tersimpan dalam sistem.
                      </p>
                    </div>

                    {/* Credential summary box */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-left space-y-3 max-w-lg mx-auto">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                        Kredensial Login Anda Sendiri
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">Username:</span>
                        <div className="flex items-center gap-2 font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          <span>{registeredAccount.username}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(registeredAccount.username, 'username')}
                            className="text-slate-400 hover:text-white"
                            title="Salin Username"
                          >
                            {copiedField === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">Kata Sandi (Password):</span>
                        <div className="flex items-center gap-2 font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          <span>{registeredAccount.password}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(registeredAccount.password || '', 'password')}
                            className="text-slate-400 hover:text-white"
                            title="Salin Password"
                          >
                            {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">Peran / Akses:</span>
                        <span className="font-semibold text-slate-200 uppercase px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                          {roleMeta[registeredAccount.role].label}
                        </span>
                      </div>

                      {registeredAccount.identifierNumber && (
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-slate-400">NIM / NIP / ID:</span>
                          <span className="font-mono text-slate-200">
                            {registeredAccount.identifierNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          login(registeredAccount);
                          closeAuthModal();
                        }}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Langsung Masuk Dashboard ({registeredAccount.role.toUpperCase()})</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setRegisteredAccount(null);
                          setRegName('');
                          setRegUsername('');
                          setRegPassword('');
                          setRegConfirmPassword('');
                        }}
                        className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm rounded-xl transition-all"
                      >
                        Daftar Akun Lainnya
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Pilih Peran & Daftarkan Akun Sendiri
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih salah satu dari 5 akses di bawah ini. Akun dan password Anda akan dibuat khusus sesuai peran.
                    </p>
                  </div>

                  {registerError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div className="leading-relaxed">{registerError}</div>
                    </div>
                  )}

                  {/* 5 Roles Selection Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      1. Pilih Akses Peran Pengguna (5 Role)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {(['admin', 'ci', 'dosen', 'mahasiswa', 'tamu'] as UserRole[]).map((roleKey, idx) => {
                        const meta = roleMeta[roleKey];
                        const isSelected = selectedRole === roleKey;
                        return (
                          <button
                            key={roleKey}
                            id={`select-reg-role-${roleKey}`}
                            type="button"
                            onClick={() => setSelectedRole(roleKey)}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono text-slate-400">
                                #{idx + 1}
                              </span>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-700" />
                              )}
                            </div>
                            <div>
                              <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {meta.label}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                                {meta.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role Specific Notice */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="text-xs text-slate-300">
                      Mendaftar sebagai <span className="font-bold text-white">{roleMeta[selectedRole].label}</span>. Anda akan mendapatkan username dan kata sandi mandiri yang langsung aktif di sistem.
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3.5 pt-1">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. Identitas Akun & Kredensial
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nama Lengkap & Gelar *
                        </label>
                        <input
                          id="reg-name-input"
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Contoh: Ns. Budi Santoso, S.Kep"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Username (Untuk Login) *
                        </label>
                        <input
                          id="reg-username-input"
                          type="text"
                          required
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                          placeholder="Contoh: budi_santoso"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-slate-300">
                            Kata Sandi (Password) *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="text-[11px] text-slate-400 hover:text-slate-200"
                          >
                            {showRegPassword ? 'Sembunyikan' : 'Lihat'}
                          </button>
                        </div>
                        <input
                          id="reg-password-input"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Minimal 4 karakter"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Konfirmasi Kata Sandi *
                        </label>
                        <input
                          id="reg-confirm-password-input"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi di atas"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Alamat Email Aktif
                        </label>
                        <input
                          id="reg-email-input"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="Contoh: nama@domain.com"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nomor WhatsApp / HP
                        </label>
                        <input
                          id="reg-phone-input"
                          type="text"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Contoh: 0812-9876-5432"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Role Specific Section */}
                    <div className="pt-2 border-t border-slate-800 space-y-3.5">
                      <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        3. Informasi Khusus Peran ({roleMeta[selectedRole].label})
                      </div>

                      {/* Mahasiswa Fields */}
                      {selectedRole === 'mahasiswa' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Nomor Induk Mahasiswa (NIM) *
                            </label>
                            <input
                              id="reg-nim-input"
                              type="text"
                              required
                              value={regIdentifier}
                              onChange={(e) => setRegIdentifier(e.target.value)}
                              placeholder="Contoh: 2024010199"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Asal Universitas / Poltekkes
                            </label>
                            <input
                              type="text"
                              value={regInstitution}
                              onChange={(e) => setRegInstitution(e.target.value)}
                              placeholder="Contoh: Poltekkes Kemenkes Pontianak"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Program Studi
                            </label>
                            <input
                              type="text"
                              value={regStudyProgram}
                              onChange={(e) => setRegStudyProgram(e.target.value)}
                              placeholder="Contoh: S1 Keperawatan & Profesi Ners"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Jenjang & Semester
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={regEducationLevel}
                                onChange={(e) => setRegEducationLevel(e.target.value as any)}
                                className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                              >
                                <option value="S1">S1</option>
                                <option value="Profesi Ners">Profesi Ners</option>
                                <option value="Profesi Dokter">Profesi Dokter</option>
                                <option value="D3">D3</option>
                                <option value="D4">D4</option>
                              </select>
                              <select
                                value={regSemester}
                                onChange={(e) => setRegSemester(Number(e.target.value))}
                                className="w-1/2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                  <option key={s} value={s}>Semester {s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Ruangan Stase Penugasan Awal
                            </label>
                            <select
                              value={regRoomId}
                              onChange={(e) => setRegRoomId(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            >
                              {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                  {room.name} ({room.type} - Lantai {room.floor})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* CI Fields */}
                      {selectedRole === 'ci' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              NIP / NRP Clinical Instructor *
                            </label>
                            <input
                              type="text"
                              required
                              value={regIdentifier}
                              onChange={(e) => setRegIdentifier(e.target.value)}
                              placeholder="Contoh: 198205142006042002"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Spesialisasi / Keahlian Klinis
                            </label>
                            <input
                              type="text"
                              value={regSpecialization}
                              onChange={(e) => setRegSpecialization(e.target.value)}
                              placeholder="Contoh: Keperawatan Gawat Darurat & Kritis"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Ruangan Homebase Praktik
                            </label>
                            <select
                              value={regRoomId}
                              onChange={(e) => setRegRoomId(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            >
                              {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                  {room.name} ({room.type})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Dosen Fields */}
                      {selectedRole === 'dosen' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              NIDN / NIP Dosen Kampus *
                            </label>
                            <input
                              type="text"
                              required
                              value={regIdentifier}
                              onChange={(e) => setRegIdentifier(e.target.value)}
                              placeholder="Contoh: 0012087501"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Institusi / Universitas Kampus
                            </label>
                            <input
                              type="text"
                              value={regInstitution}
                              onChange={(e) => setRegInstitution(e.target.value)}
                              placeholder="Contoh: Universitas Tanjungpura"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Program Studi / Fakultas
                            </label>
                            <input
                              type="text"
                              value={regStudyProgram}
                              onChange={(e) => setRegStudyProgram(e.target.value)}
                              placeholder="Contoh: Fakultas Kedokteran & Keperawatan"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>
                        </div>
                      )}

                      {/* Admin Fields */}
                      {selectedRole === 'admin' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              NRP / NIP Personel Instaldik *
                            </label>
                            <input
                              type="text"
                              required
                              value={regIdentifier}
                              onChange={(e) => setRegIdentifier(e.target.value)}
                              placeholder="Contoh: 11040019200885"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Jabatan / Satuan di RSKH
                            </label>
                            <input
                              type="text"
                              value={regSpecialization}
                              onChange={(e) => setRegSpecialization(e.target.value)}
                              placeholder="Contoh: Kainstaldik / Staf Diklat"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>
                        </div>
                      )}

                      {/* Tamu Fields */}
                      {selectedRole === 'tamu' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Asal Instansi / Perusahaan / Kampus
                            </label>
                            <input
                              type="text"
                              value={regInstitution}
                              onChange={(e) => setRegInstitution(e.target.value)}
                              placeholder="Contoh: Dinas Kesehatan / RS Lain"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Keperluan Kunjungan
                            </label>
                            <select
                              value={regVisitorPurpose}
                              onChange={(e) => setRegVisitorPurpose(e.target.value as any)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
                            >
                              <option value="Studi Banding">Studi Banding</option>
                              <option value="Penelitian">Penelitian Klinis</option>
                              <option value="Pendidikan">Konsultasi Pendidikan</option>
                              <option value="Rapat">Rapat Koordinasi</option>
                              <option value="Kerja Sama">Kerja Sama Institusi</option>
                              <option value="Kunjungan">Kunjungan Umum</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Registration Button */}
                  <div className="pt-3">
                    <button
                      id="submit-register-btn"
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Daftar Akun {roleMeta[selectedRole].label}</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Dengan mendaftar, akun dan kata sandi Anda akan otomatis aktif untuk akses sistem e-Instaldik RSKH.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: CREDENTIALS GUIDE (5 ROLES) */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Daftar Kredensial 5 Role Akses
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setiap peran memiliki user dan password sendiri-sendiri. Anda dapat menggunakan akun di bawah ini atau mendaftarkan akun baru.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(['admin', 'ci', 'dosen', 'mahasiswa', 'tamu'] as UserRole[]).map((r, idx) => {
                  const meta = roleMeta[r];
                  const sampleUser = allUsers.find(u => u.role === r);

                  return (
                    <div
                      key={r}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {idx + 1}.
                          </span>
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${meta.badge}`}>
                            {meta.label}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {sampleUser ? sampleUser.name : meta.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 pl-5">
                          {meta.desc}
                        </p>

                        <div className="pl-5 pt-1 flex flex-wrap items-center gap-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">User:</span>
                            <span className="text-emerald-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {sampleUser?.username || meta.defaultUser}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">Password:</span>
                            <span className="text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {sampleUser?.password || meta.defaultPass}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(sampleUser?.username || meta.defaultUser);
                            setLoginPassword(sampleUser?.password || meta.defaultPass);
                            setActiveTab('login');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          Isi ke Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLoginRole(r)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                        >
                          <span>Masuk</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset helper */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Ingin mendaftar dengan akun baru?</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Klik tab Daftar Akun di atas untuk membuat user dan password sendiri.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setRegisteredAccount(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-semibold text-xs whitespace-nowrap"
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
