import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Eye,
  CheckCheck,
  Calendar,
  FileCheck,
  MessageSquare,
  ClipboardList,
  Menu,
  X,
  UserPlus,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    currentRole,
    currentView,
    switchRole,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView,
    openPdfViewer,
    libraryItems,
    openAuthModal
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesConfig: { role: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    { role: 'admin', label: 'Admin Instaldik', icon: Shield, color: 'bg-rose-500 text-white', desc: 'Kelola seluruh sistem & master data' },
    { role: 'ci', label: 'Clinical Instructor (CI)', icon: Stethoscope, color: 'bg-amber-500 text-white', desc: 'Bimbingan klinis, review & evaluasi' },
    { role: 'mahasiswa', label: 'Mahasiswa Praktik', icon: GraduationCap, color: 'bg-emerald-500 text-white', desc: 'Jadwal, tugas, test & konsultasi' },
    { role: 'dosen', label: 'Dosen Pembimbing', icon: BookOpen, color: 'bg-blue-500 text-white', desc: 'Monitoring bimbingan kampus' },
    { role: 'tamu', label: 'Tamu / Publik', icon: Eye, color: 'bg-slate-500 text-white', desc: 'Informasi umum & publik' }
  ];

  const currentRoleInfo = rolesConfig.find(r => r.role === currentRole) || rolesConfig[0];

  // Breadcrumbs title helper
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return currentRole === 'admin' ? 'Statistik Global' : `Dashboard ${currentRole.toUpperCase()}`;
      case 'master_data':
      case 'master-data':
        return 'Master Data Terpadu';
      case 'students':
      case 'mahasiswa':
        return 'Data Mahasiswa Praktik';
      case 'ci':
        return 'Clinical Instructor (CI)';
      case 'lecturers':
      case 'dosen':
        return 'Dosen Pembimbing';
      case 'institutions':
      case 'institusi':
        return 'Institusi Mitra Pendidikan';
      case 'rooms':
      case 'ruangan':
        return 'Ruangan & Stase Klinik';
      case 'schedules':
      case 'jadwal':
        return 'Jadwal Praktik & Shift Dinas';
      case 'consultation':
      case 'konsultasi':
        return 'Konsultasi & Bimbingan Klinis';
      case 'documents':
      case 'dokumen':
      case 'tasks':
        return 'Dokumen & Logbook Praktik';
      case 'library':
        return 'e-Library Digital';
      case 'pretest':
        return 'Pre-Test (CBT)';
      case 'posttest':
        return 'Post-Test (CBT)';
      case 'evaluations':
      case 'evaluasi':
        return 'Evaluasi & Penilaian Pembelajaran';
      case 'reports':
      case 'laporan':
        return 'Laporan & Rekapitulasi Nilai';
      case 'notifications':
      case 'notifikasi':
        return 'Pusat Notifikasi & Agenda';
      case 'settings':
      case 'pengaturan':
        return 'Pengaturan Sistem & Database';
      case 'profile':
        return 'Profil Pengguna';
      default:
        return 'Instalasi Pendidikan';
    }
  };

  // Quick search results
  const filteredLibrary = searchQuery.trim()
    ? libraryItems.filter(
        i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-4 text-slate-400">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
          aria-label="Toggle navigasi"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-slate-800 font-semibold hover:text-amber-600 transition text-sm cursor-pointer"
          >
            Beranda
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500 font-medium truncate max-w-[150px] sm:max-w-[280px]">
            {getViewTitle()}
          </span>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="relative flex-1 max-w-xs md:max-w-sm mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-header-input"
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Cari materi e-Library, SOP..."
            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Popup */}
        {isSearchOpen && searchQuery.trim() && (
          <div 
            onMouseLeave={() => setIsSearchOpen(false)}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 p-2 text-xs"
          >
            <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
              Hasil e-Library & SOP ({filteredLibrary.length})
            </div>
            {filteredLibrary.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Tidak ada materi dengan kata kunci "{searchQuery}".
              </div>
            ) : (
              filteredLibrary.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    openPdfViewer(item.title, item.pdfUrl, item.fileFormat, item.docType, item.author);
                    setIsSearchOpen(false);
                  }}
                  className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs text-slate-800 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                    {item.category}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            id="btn-role-switcher"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition shadow-xs cursor-pointer"
            title="Ganti Role Akun Demo"
          >
            <span className={`w-2 h-2 rounded-full ${
              currentRole === 'admin' ? 'bg-rose-500' :
              currentRole === 'ci' ? 'bg-amber-500' :
              currentRole === 'mahasiswa' ? 'bg-emerald-500' :
              currentRole === 'dosen' ? 'bg-blue-500' : 'bg-slate-400'
            }`}></span>
            <span className="font-semibold text-slate-800 hidden sm:inline">{currentRoleInfo.label}</span>
            <span className="font-semibold text-slate-800 sm:hidden uppercase text-[11px]">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {isRoleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Pilih Akses Role (RBAC)</span>
                </div>
                <div className="space-y-1 mt-1">
                  {rolesConfig.map(r => {
                    const Icon = r.icon;
                    const isSelected = r.role === currentRole;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition cursor-pointer ${
                          isSelected ? 'bg-amber-500/10 border border-amber-500 text-amber-900' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${r.color} shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {r.label}
                            {isSelected && <span className="text-[10px] text-amber-600 font-bold">● Aktif</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight truncate">
                            {r.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notif-bell"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white font-bold">
                {unreadNotifs.length}
              </div>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      Pemberitahuan ({unreadNotifs.length} Baru)
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Tandai Semua</span>
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      Tidak ada notifikasi baru.
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const isUnread = !notif.isRead;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionUrl) {
                              setCurrentView(notif.actionUrl);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3 transition cursor-pointer flex items-start gap-3 ${
                            isUnread ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50 opacity-75'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'jadwal' && <Calendar className="w-4 h-4 text-blue-500" />}
                            {notif.type === 'tugas' && <FileCheck className="w-4 h-4 text-emerald-500" />}
                            {notif.type === 'konsultasi' && <MessageSquare className="w-4 h-4 text-amber-500" />}
                            {notif.type === 'ujian' && <ClipboardList className="w-4 h-4 text-purple-500" />}
                            {notif.type === 'evaluasi' && <GraduationCap className="w-4 h-4 text-rose-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className={`font-semibold truncate ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                                {notif.title}
                              </h5>
                              <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentView('notifications');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] text-slate-600 hover:text-amber-600 transition font-medium cursor-pointer"
                  >
                    Buka Pusat Notifikasi Lengkap →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Hospital Location and Credential */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-800">RS TK II Kartika Husada</p>
          <p className="text-[10px] text-slate-400">Kubu Raya, Kalimantan Barat</p>
        </div>

        {/* User Profile Button */}
        <div className="relative" ref={profileRef}>
          <button
            id="btn-user-profile-menu"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 text-xs"
              >
                <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Profil Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('landing');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>Lihat Beranda Publik</span>
                  </button>

                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-emerald-50 text-emerald-700 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Akun Baru (5 Role)</span>
                  </button>

                  <button
                    onClick={() => {
                      openAuthModal('credentials');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-amber-50 text-amber-800 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Info Password 5 Role</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    id="btn-logout"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

