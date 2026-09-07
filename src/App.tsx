import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { ToastContainer } from './components/ToastContainer';
import { PdfViewerModal } from './components/PdfViewerModal';
import { DigitalIdCardModal } from './components/cards/DigitalIdCardModal';
import { UniversalQrScannerModal } from './components/modals/UniversalQrScannerModal';
import { BatchCardPrintModal } from './components/cards/BatchCardPrintModal';

// Dashboards
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { CIDashboard } from './components/dashboards/CIDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { LecturerDashboard } from './components/dashboards/LecturerDashboard';
import { GuestDashboard } from './components/dashboards/GuestDashboard';
import { AuthModal } from './components/auth/AuthModal';

// Feature Modules
import { MasterDataModule } from './components/modules/MasterDataModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { DigitalCardModule } from './components/modules/DigitalCardModule';
import { UserProfileModule } from './components/modules/UserProfileModule';
import { ScheduleCalendarModule } from './components/modules/ScheduleCalendarModule';
import { RoomsModule } from './components/modules/RoomsModule';
import { ConsultationModule } from './components/modules/ConsultationModule';
import { DocumentTaskModule } from './components/modules/DocumentTaskModule';
import { ELibraryModule } from './components/modules/ELibraryModule';
import { TestModule } from './components/modules/TestModule';
import { EvaluationModule } from './components/modules/EvaluationModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { NotificationCenterModule } from './components/modules/NotificationCenterModule';
import { SettingsModule } from './components/modules/SettingsModule';

const MainAppContent: React.FC = () => {
  const { currentRole, currentView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If Guest role and on landing page, render public landing
  if (currentRole === 'tamu' && currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
        <LandingPage />
        <ToastContainer />
        <PdfViewerModal />
        <DigitalIdCardModal />
        <UniversalQrScannerModal />
        <BatchCardPrintModal />
        <AuthModal />
      </div>
    );
  }

  // Render content based on currentView and role
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        if (currentRole === 'admin') return <AdminDashboard />;
        if (currentRole === 'ci') return <CIDashboard />;
        if (currentRole === 'mahasiswa') return <StudentDashboard />;
        if (currentRole === 'dosen') return <LecturerDashboard />;
        if (currentRole === 'tamu') return <GuestDashboard />;
        return <AdminDashboard />;

      case 'master_data':
      case 'master-data':
      case 'students':
      case 'ci':
      case 'lecturers':
      case 'institutions':
      case 'visitors':
      case 'mahasiswa':
      case 'dosen':
      case 'institusi':
        return <MasterDataModule forcedTab={currentView === 'master_data' || currentView === 'master-data' ? undefined : (currentView as any)} />;

      case 'attendance':
      case 'presensi':
      case 'absensi':
        return <AttendanceModule />;

      case 'digital_cards':
      case 'digital-card':
      case 'kartu-digital':
      case 'kartu':
        return <DigitalCardModule />;

      case 'profile':
      case 'profil':
        return <UserProfileModule />;

      case 'schedules':
      case 'jadwal':
        return <ScheduleCalendarModule />;

      case 'rooms':
      case 'ruangan':
        return <RoomsModule />;

      case 'documents':
      case 'dokumen':
      case 'tasks':
        return <DocumentTaskModule />;

      case 'consultation':
      case 'konsultasi':
        return <ConsultationModule />;

      case 'tests':
        return <TestModule />;

      case 'pretest':
        return <TestModule forcedType="pre-test" />;

      case 'posttest':
        return <TestModule forcedType="post-test" />;

      case 'evaluations':
      case 'evaluasi':
        return <EvaluationModule />;

      case 'library':
        return <ELibraryModule />;

      case 'reports':
      case 'laporan':
        return <ReportsModule />;

      case 'notifications':
      case 'notifikasi':
        return <NotificationCenterModule />;

      case 'settings':
      case 'pengaturan':
        return <SettingsModule />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen h-screen flex bg-[#f8fafc] font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
      {/* Left Sleek Role-Based Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onCloseMobile={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sleek Top Header Navbar */}
        <HeaderNavbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Dynamic Center Stage Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6 custom-scrollbar">
          {renderCurrentView()}
        </main>

        {/* Sleek Footer */}
        <footer className="mt-auto h-10 border-t border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between text-[10px] text-slate-400 shrink-0 select-none">
          <div>&copy; 2026 Instaldik RS TK II Kartika Husada - Sistem Informasi Terpadu</div>
          <div className="flex items-center gap-4 font-semibold">
            <span>Versi 2.5.0-PRO</span>
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Status Server: Optimal
            </span>
          </div>
        </footer>
      </div>

      {/* Global Interactive Overlays & Modals */}
      <ToastContainer />
      <PdfViewerModal />
      <DigitalIdCardModal />
      <UniversalQrScannerModal />
      <BatchCardPrintModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
