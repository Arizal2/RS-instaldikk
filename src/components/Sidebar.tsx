import React from 'react';
import { useApp } from '../context/AppContext';
import { HospitalLogo } from './common/HospitalLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Stethoscope,
  Building2,
  CalendarDays,
  DoorOpen,
  MessageSquare,
  FileCheck2,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  FileText,
  Bell,
  Settings,
  UserCheck,
  Building,
  Sparkles,
  Home,
  Info,
  Layers,
  LogOut,
  ShieldAlert,
  IdCard,
  Clock,
  QrCode,
  Printer
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    currentUser,
    currentRole,
    currentView,
    setCurrentView,
    documents,
    chatMessages,
    notifications,
    tests,
    logout,
    openScanner,
    openBatchPrint
  } = useApp();

  // Pending counts
  const pendingDocsCount = documents.filter(d => d.reviewStatus === 'Menunggu Pemeriksaan').length;
  const unreadChatsCount = chatMessages.filter(m => !m.isRead).length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const activeTestsCount = tests.filter(t => t.isActive).length;

  const navigateTo = (view: string) => {
    setCurrentView(view);
    onCloseMobile();
  };

  // Menu definitions strictly per role
  const getNavItems = () => {
    if (currentRole === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
        { id: 'master_data', label: 'Master Data Terpadu', icon: Layers, badge: 'CRUD' },
        { id: 'students', label: 'Data Mahasiswa', icon: GraduationCap },
        { id: 'digital_cards', label: 'Kartu Digital & ID', icon: IdCard, badge: 'QR' },
        { id: 'attendance', label: 'Absensi & Presensi QR', icon: Clock, badge: 'Live' },
        { id: 'ci', label: 'Clinical Instructor (CI)', icon: Stethoscope },
        { id: 'lecturers', label: 'Dosen Pembimbing', icon: Users },
        { id: 'institutions', label: 'Institusi Pendidikan', icon: Building2 },
        { id: 'rooms', label: 'Ruangan Praktik', icon: DoorOpen },
        { id: 'schedules', label: 'Jadwal Praktik', icon: CalendarDays },
        { id: 'consultation', label: 'Konsultasi & Bimbingan', icon: MessageSquare, count: unreadChatsCount },
        { id: 'documents', label: 'Dokumen & Tugas', icon: FileCheck2, count: pendingDocsCount },
        { id: 'library', label: 'e-Library Digital', icon: BookOpen },
        { id: 'pretest', label: 'Pre-Test (CBT)', icon: ClipboardList },
        { id: 'posttest', label: 'Post-Test (CBT)', icon: CheckCircle2 },
        { id: 'evaluations', label: 'Evaluasi Pembelajaran', icon: FileText },
        { id: 'reports', label: 'Laporan & Rekap Nilai', icon: FileText, badge: 'Export' },
        { id: 'profile', label: 'Profil Akun Saya', icon: UserCheck },
        { id: 'notifications', label: 'Pusat Notifikasi', icon: Bell, count: unreadNotifsCount },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings }
      ];
    }

    if (currentRole === 'mahasiswa') {
      return [
        { id: 'dashboard', label: 'Dashboard Mahasiswa', icon: LayoutDashboard },
        { id: 'digital_cards', label: 'Kartu Digital & QR', icon: IdCard, badge: 'E-ID' },
        { id: 'attendance', label: 'Presensi & Kehadiran', icon: Clock },
        { id: 'profile', label: 'Profil Saya', icon: UserCheck },
        { id: 'schedules', label: 'Jadwal Praktik', icon: CalendarDays },
        { id: 'rooms', label: 'Ruangan Stase', icon: DoorOpen },
        { id: 'consultation', label: 'Konsultasi CI & Dosen', icon: MessageSquare, count: unreadChatsCount },
        { id: 'documents', label: 'Tugas & Logbook', icon: FileCheck2 },
        { id: 'library', label: 'e-Library Digital', icon: BookOpen },
        { id: 'pretest', label: 'Pre-Test (CBT)', icon: ClipboardList, count: activeTestsCount },
        { id: 'posttest', label: 'Post-Test (CBT)', icon: CheckCircle2 },
        { id: 'evaluations', label: 'Evaluasi Pembelajaran', icon: FileText },
        { id: 'notifications', label: 'Notifikasi', icon: Bell, count: unreadNotifsCount }
      ];
    }

    if (currentRole === 'ci') {
      return [
        { id: 'dashboard', label: 'Dashboard CI', icon: LayoutDashboard },
        { id: 'digital_cards', label: 'Kartu Digital CI', icon: IdCard },
        { id: 'attendance', label: 'Presensi Mahasiswa', icon: Clock },
        { id: 'students', label: 'Mahasiswa Bimbingan', icon: GraduationCap },
        { id: 'schedules', label: 'Jadwal Praktik', icon: CalendarDays },
        { id: 'consultation', label: 'Konsultasi & Kasus', icon: MessageSquare, count: unreadChatsCount },
        { id: 'documents', label: 'Review Tugas & Logbook', icon: FileCheck2, count: pendingDocsCount },
        { id: 'pretest', label: 'Pre-Test', icon: ClipboardList },
        { id: 'posttest', label: 'Post-Test', icon: CheckCircle2 },
        { id: 'evaluations', label: 'Evaluasi Mahasiswa', icon: FileText },
        { id: 'profile', label: 'Profil CI', icon: UserCheck },
        { id: 'notifications', label: 'Notifikasi', icon: Bell, count: unreadNotifsCount }
      ];
    }

    if (currentRole === 'dosen') {
      return [
        { id: 'dashboard', label: 'Dashboard Dosen', icon: LayoutDashboard },
        { id: 'attendance', label: 'Presensi Bimbingan', icon: Clock },
        { id: 'students', label: 'Mahasiswa Bimbingan', icon: GraduationCap },
        { id: 'schedules', label: 'Jadwal Praktik', icon: CalendarDays },
        { id: 'consultation', label: 'Konsultasi', icon: MessageSquare, count: unreadChatsCount },
        { id: 'documents', label: 'Dokumen Mahasiswa', icon: FileCheck2 },
        { id: 'evaluations', label: 'Evaluasi Mahasiswa', icon: FileText },
        { id: 'profile', label: 'Profil Dosen', icon: UserCheck },
        { id: 'notifications', label: 'Notifikasi', icon: Bell, count: unreadNotifsCount }
      ];
    }

    // Tamu / Guest
    return [
      { id: 'dashboard', label: 'Portal Tamu & Peneliti', icon: LayoutDashboard },
      { id: 'digital_cards', label: 'Visitor Pass Digital', icon: IdCard, badge: 'QR' },
      { id: 'rooms', label: 'Fasilitas & Ruangan', icon: DoorOpen },
      { id: 'library', label: 'e-Library & Pedoman', icon: BookOpen },
      { id: 'landing', label: 'Beranda Profil Instaldik', icon: Home }
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0a192f] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out select-none shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <HospitalLogo variant="emblem" size="md" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                e-Instaldik <span className="text-emerald-400 font-serif">RSKH</span>
              </h2>
              <p className="text-[10px] text-emerald-300/90 font-medium">RS TK II Kartika Husada</p>
            </div>
          </div>
        </div>

        {/* Quick QR & Scanner Widget */}
        <div className="p-3 border-b border-slate-800/80">
          <button
            onClick={() => openScanner('attendance')}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-between text-left transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                  Scanner Presensi
                </div>
                <div className="text-[10px] text-amber-400/80">Check-In / Out QR</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Menu Utama ({currentRole.toUpperCase()})
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-amber-400/60 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-amber-400 font-medium capitalize truncate">
                  {currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition shrink-0"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
