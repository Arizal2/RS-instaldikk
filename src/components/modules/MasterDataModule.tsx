import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  ClinicalInstructor,
  Lecturer,
  Institution,
  StudyProgram,
  PracticeRoom,
  Visitor
} from '../../types';
import {
  Users,
  GraduationCap,
  Stethoscope,
  Building2,
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  IdCard,
  KeyRound,
  ShieldCheck,
  UploadCloud,
  Printer,
  Copy,
  DoorOpen
} from 'lucide-react';

import { StudentsTab } from './master-data/StudentsTab';
import { InstitutionsTab } from './master-data/InstitutionsTab';
import { StudyProgramsTab } from './master-data/StudyProgramsTab';
import { ClinicalInstructorsTab } from './master-data/ClinicalInstructorsTab';
import { LecturersTab } from './master-data/LecturersTab';
import { VisitorsTab } from './master-data/VisitorsTab';

import { StudentFormModal } from './master-data/StudentFormModal';
import { InstitutionFormModal } from './master-data/InstitutionFormModal';
import { StudyProgramFormModal } from './master-data/StudyProgramFormModal';
import { CIFormModal } from './master-data/CIFormModal';
import { LecturerFormModal } from './master-data/LecturerFormModal';

interface Props {
  forcedTab?: 'students' | 'ci' | 'lecturers' | 'institutions' | 'prodi' | 'visitors';
}

export const MasterDataModule: React.FC<Props> = ({ forcedTab }) => {
  const {
    students,
    clinicalInstructors,
    lecturers,
    institutions,
    studyPrograms,
    rooms,
    visitors,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentAccountStatus,
    resetStudentPassword,
    importStudents,
    bulkUpdateStudents,
    addCI,
    updateCI,
    deleteCI,
    addLecturer,
    updateLecturer,
    deleteLecturer,
    addInstitution,
    updateInstitution,
    deleteInstitution,
    addStudyProgram,
    updateStudyProgram,
    deleteStudyProgram,
    addVisitor,
    checkoutVisitor,
    openDigitalCard,
    openBatchPrint,
    showToast,
    logActivity,
    openPdfViewer
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'ci' | 'lecturers' | 'institutions' | 'prodi' | 'visitors'>(
    forcedTab || 'students'
  );

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);

  const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
  const [editingProdi, setEditingProdi] = useState<StudyProgram | null>(null);

  const [isCIModalOpen, setIsCIModalOpen] = useState(false);
  const [editingCI, setEditingCI] = useState<ClinicalInstructor | null>(null);

  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);

  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [resetPasswordResult, setResetPasswordResult] = useState<{ name: string; tempPass: string } | null>(null);

  // Visitor Form Modal
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    identityNumber: '',
    institution: '',
    purpose: 'Kunjungan Supervisi Dosen Praktik',
    destinationUnit: 'Instalasi Pendidikan (Instaldik)',
    phone: '',
    visitDate: new Date().toISOString().split('T')[0],
    entryTime: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`
  });

  // Student selection handlers
  const handleToggleSelectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Student CRUD
  const handleSaveStudent = (data: any, id?: string) => {
    if (id) {
      updateStudent(id, data);
      showToast('Data Mahasiswa Diperbarui', `Data ${data.name} berhasil disimpan.`, 'success');
    } else {
      const inst = institutions.find(i => i.id === data.institutionId);
      const room = rooms.find(r => r.id === data.roomId);
      const ci = clinicalInstructors.find(c => c.id === data.ciId);
      const lec = lecturers.find(l => l.id === data.lecturerId);

      addStudent({
        ...data,
        institutionName: inst?.name || 'Universitas Tanjungpura',
        roomName: room?.name || 'Intensive Care Unit (ICU)',
        ciName: ci?.name || 'Ns. Siti Rahmawati, M.Kep',
        lecturerName: lec?.name || 'Dr. Ns. Yuliana Triastuti, M.Kep',
        status: 'Aktif',
        competencyProgress: 0,
        accountStatus: 'Aktif',
        cardStatus: 'Aktif'
      });
      showToast('Mahasiswa Terdaftar', `${data.name} berhasil didaftarkan ke stase.`, 'success');
    }
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data mahasiswa "${name}"?`)) {
      deleteStudent(id);
      showToast('Mahasiswa Dihapus', `Data "${name}" telah dihapus.`, 'info');
    }
  };

  const handleResetPassword = (student: Student) => {
    const temp = resetStudentPassword(student.id);
    setResetPasswordResult({ name: student.name, tempPass: temp });
  };

  // Institution CRUD
  const handleSaveInstitution = (data: any, id?: string) => {
    if (id) {
      updateInstitution(id, data);
      showToast('Institusi Diperbarui', `Data kampus "${data.name}" berhasil diperbarui.`, 'success');
    } else {
      addInstitution(data);
      showToast('Institusi Ditambahkan', `Kampus "${data.name}" berhasil didaftarkan.`, 'success');
    }
  };

  const handleDeleteInstitution = (id: string, name: string) => {
    if (confirm(`Hapus institusi "${name}"? Semua prodi dan mahasiswa terkait tetap tersimpan.`)) {
      deleteInstitution(id);
      showToast('Institusi Dihapus', `Kampus "${name}" telah dihapus.`, 'info');
    }
  };

  // Study Program CRUD
  const handleSaveStudyProgram = (data: any, id?: string) => {
    if (id) {
      updateStudyProgram(id, data);
      showToast('Prodi Diperbarui', `Program studi "${data.name}" berhasil diperbarui.`, 'success');
    } else {
      addStudyProgram(data);
      showToast('Prodi Ditambahkan', `Program studi "${data.name}" berhasil didaftarkan.`, 'success');
    }
  };

  const handleDeleteStudyProgram = (id: string, name: string) => {
    if (confirm(`Hapus program studi "${name}"?`)) {
      deleteStudyProgram(id);
      showToast('Prodi Dihapus', `Program studi "${name}" telah dihapus.`, 'info');
    }
  };

  // CI CRUD
  const handleSaveCI = (data: any, id?: string) => {
    if (id) {
      updateCI(id, data);
      showToast('Data CI Diperbarui', `Data "${data.name}" berhasil disimpan.`, 'success');
    } else {
      addCI(data);
      showToast('CI Ditambahkan', `Clinical Instructor "${data.name}" berhasil ditambahkan.`, 'success');
    }
  };

  const handleDeleteCI = (id: string, name: string) => {
    if (confirm(`Hapus data Clinical Instructor "${name}"?`)) {
      deleteCI(id);
      showToast('CI Dihapus', `Clinical Instructor "${name}" telah dihapus.`, 'info');
    }
  };

  // Lecturer CRUD
  const handleSaveLecturer = (data: any, id?: string) => {
    if (id) {
      updateLecturer(id, data);
      showToast('Data Dosen Diperbarui', `Data "${data.name}" berhasil disimpan.`, 'success');
    } else {
      addLecturer(data);
      showToast('Dosen Ditambahkan', `Dosen "${data.name}" berhasil ditambahkan.`, 'success');
    }
  };

  const handleDeleteLecturer = (id: string, name: string) => {
    if (confirm(`Hapus data dosen pembimbing "${name}"?`)) {
      deleteLecturer(id);
      showToast('Dosen Dihapus', `Dosen "${name}" telah dihapus.`, 'info');
    }
  };

  // Visitor handler
  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addVisitor(visitorForm);
    setIsVisitorModalOpen(false);
    openDigitalCard({ visitor: created });
    showToast('Tamu Terdaftar', `Visitor Pass untuk ${created.name} berhasil diterbitkan.`, 'success');
  };

  // Import CSV handler
  const handleProcessImportCsv = () => {
    if (!importCsvText.trim()) {
      showToast('Data Kosong', 'Tempel teks CSV atau data mahasiswa.', 'warning');
      return;
    }

    const lines = importCsvText.trim().split('\n');
    const parsedData: Omit<Student, 'id'>[] = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && (line.toLowerCase().includes('nim') || line.toLowerCase().includes('nama'))) return;

      const cols = line.split(/[,;\t]/).map(c => c.replace(/^["']|["']$/g, '').trim());
      if (cols.length >= 2 && cols[0] && cols[1]) {
        parsedData.push({
          nim: cols[0],
          name: cols[1],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          gender: (cols[2] === 'Perempuan' || cols[2] === 'P') ? 'Perempuan' : 'Laki-laki',
          institutionId: institutions[0]?.id || 'inst_1',
          institutionName: cols[3] || institutions[0]?.name || 'Universitas Tanjungpura',
          studyProgram: cols[4] || 'Profesi Ners',
          semester: parseInt(cols[5]) || 7,
          phone: cols[6] || '0812-3456-7890',
          email: `${cols[0].toLowerCase()}@student.untan.ac.id`,
          periodStart: '2026-09-01',
          periodEnd: '2026-11-30',
          roomId: rooms[0]?.id || 'room_1',
          roomName: rooms[0]?.name || 'Intensive Care Unit (ICU)',
          ciId: clinicalInstructors[0]?.id || 'ci_1',
          ciName: clinicalInstructors[0]?.name || 'Ns. Siti Rahmawati, M.Kep',
          lecturerId: lecturers[0]?.id || 'lec_1',
          lecturerName: lecturers[0]?.name || 'Dr. Ns. Yuliana Triastuti, M.Kep',
          status: 'Aktif',
          competencyProgress: 0,
          accountStatus: 'Aktif',
          cardStatus: 'Aktif',
          qrCodeToken: `RSKH-STD-${cols[0]}-${Date.now()}`
        });
      }
    });

    if (parsedData.length > 0) {
      importStudents(parsedData);
      setIsImportModalOpen(false);
      setImportCsvText('');
    } else {
      showToast('Format Tidak Valid', 'Pastikan data memuat minimal NIM dan Nama.', 'error');
    }
  };

  const handleExportCSV = () => {
    logActivity('EXPORT_MAHASISWA_CSV', 'Master Data Mahasiswa', `${students.length} data diekspor.`);
    const headers = ['NIM', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Institusi', 'Program Studi', 'Semester', 'Ruangan Stase', 'CI', 'No HP', 'Email', 'No Kartu', 'Status Akun'];
    const rows = students.map(s => [
      s.nim,
      s.nik || '-',
      `"${s.name}"`,
      s.gender,
      `"${s.institutionName}"`,
      `"${s.studyProgram}"`,
      s.semester,
      `"${s.roomName}"`,
      `"${s.ciName}"`,
      s.phone,
      s.email,
      s.cardNumber || '-',
      s.accountStatus || 'Aktif'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Mahasiswa_RSKH_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Berhasil', 'Data mahasiswa berhasil diunduh.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Master Data Pendidikan & Registrasi
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                Instaldik RSKH
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Kelola data mahasiswa, program studi, kampus mitra & MoU, CI, dosen pembimbing, dan buku tamu
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'students' && (
            <>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-amber-400" />
                Import Excel/CSV
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-400" />
                Export CSV
              </button>

              <button
                onClick={() => openBatchPrint(selectedStudentIds)}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Cetak Kartu ({selectedStudentIds.length > 0 ? selectedStudentIds.length : 'Semua'})
              </button>
            </>
          )}

          <button
            onClick={() => {
              if (activeTab === 'students') {
                setEditingStudent(null);
                setIsStudentModalOpen(true);
              } else if (activeTab === 'institutions') {
                setEditingInst(null);
                setIsInstModalOpen(true);
              } else if (activeTab === 'prodi') {
                setEditingProdi(null);
                setIsProdiModalOpen(true);
              } else if (activeTab === 'ci') {
                setEditingCI(null);
                setIsCIModalOpen(true);
              } else if (activeTab === 'lecturers') {
                setEditingLecturer(null);
                setIsLecturerModalOpen(true);
              } else if (activeTab === 'visitors') {
                setIsVisitorModalOpen(true);
              }
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              Tambah {activeTab === 'students' ? 'Mahasiswa' : activeTab === 'institutions' ? 'Kampus' : activeTab === 'prodi' ? 'Prodi' : activeTab === 'ci' ? 'CI' : activeTab === 'lecturers' ? 'Dosen' : 'Tamu'}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'students'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mahasiswa Praktik ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('institutions')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'institutions'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institusi / Kampus ({institutions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prodi')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'prodi'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Program Studi ({studyPrograms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ci')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'ci'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Instructor ({clinicalInstructors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lecturers')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'lecturers'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dosen Pembimbing ({lecturers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'visitors'
              ? 'bg-[#0B192C] text-amber-400 shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>Buku Tamu ({visitors.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'students' && (
          <StudentsTab
            students={students}
            institutions={institutions}
            rooms={rooms}
            selectedStudentIds={selectedStudentIds}
            onToggleSelectAll={handleToggleSelectAllStudents}
            onToggleSelectOne={handleToggleSelectStudent}
            onAdd={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            onEdit={(st) => {
              setEditingStudent(st);
              setIsStudentModalOpen(true);
            }}
            onDetail={(st) => setDetailStudent(st)}
            onOpenCard={(st) => openDigitalCard({ student: st })}
            onResetPassword={handleResetPassword}
            onToggleStatus={(id) => toggleStudentAccountStatus(id)}
            onDelete={handleDeleteStudent}
            onBulkActivate={() => {
              bulkUpdateStudents(selectedStudentIds, { accountStatus: 'Aktif' });
              setSelectedStudentIds([]);
              showToast('Status Diperbarui', `${selectedStudentIds.length} akun mahasiswa diaktifkan.`, 'success');
            }}
            onBulkDeactivate={() => {
              bulkUpdateStudents(selectedStudentIds, { accountStatus: 'Nonaktif' });
              setSelectedStudentIds([]);
              showToast('Status Diperbarui', `${selectedStudentIds.length} akun dinonaktifkan.`, 'info');
            }}
            onBulkDelete={() => {
              if (confirm(`Hapus ${selectedStudentIds.length} mahasiswa terpilih?`)) {
                selectedStudentIds.forEach(id => deleteStudent(id));
                setSelectedStudentIds([]);
                showToast('Mahasiswa Dihapus', 'Data mahasiswa terpilih telah dihapus.', 'info');
              }
            }}
          />
        )}

        {activeTab === 'institutions' && (
          <InstitutionsTab
            institutions={institutions}
            onAdd={() => {
              setEditingInst(null);
              setIsInstModalOpen(true);
            }}
            onEdit={(inst) => {
              setEditingInst(inst);
              setIsInstModalOpen(true);
            }}
            onDelete={handleDeleteInstitution}
          />
        )}

        {activeTab === 'prodi' && (
          <StudyProgramsTab
            studyPrograms={studyPrograms}
            institutions={institutions}
            onAdd={() => {
              setEditingProdi(null);
              setIsProdiModalOpen(true);
            }}
            onEdit={(prodi) => {
              setEditingProdi(prodi);
              setIsProdiModalOpen(true);
            }}
            onDelete={handleDeleteStudyProgram}
          />
        )}

        {activeTab === 'ci' && (
          <ClinicalInstructorsTab
            clinicalInstructors={clinicalInstructors}
            onAdd={() => {
              setEditingCI(null);
              setIsCIModalOpen(true);
            }}
            onEdit={(ci) => {
              setEditingCI(ci);
              setIsCIModalOpen(true);
            }}
            onDelete={handleDeleteCI}
            onOpenCard={(ci) => openDigitalCard({ ci })}
          />
        )}

        {activeTab === 'lecturers' && (
          <LecturersTab
            lecturers={lecturers}
            institutions={institutions}
            onAdd={() => {
              setEditingLecturer(null);
              setIsLecturerModalOpen(true);
            }}
            onEdit={(lec) => {
              setEditingLecturer(lec);
              setIsLecturerModalOpen(true);
            }}
            onDelete={handleDeleteLecturer}
          />
        )}

        {activeTab === 'visitors' && (
          <VisitorsTab
            visitors={visitors}
            onAdd={() => setIsVisitorModalOpen(true)}
            onCheckout={(id) => {
              checkoutVisitor(id);
              showToast('Check-Out Sukses', 'Tamu telah melakukan check-out.', 'info');
            }}
            onOpenPass={(vis) => openDigitalCard({ visitor: vis })}
          />
        )}
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
        institutions={institutions}
        studyPrograms={studyPrograms}
        rooms={rooms}
        clinicalInstructors={clinicalInstructors}
        lecturers={lecturers}
      />

      <InstitutionFormModal
        isOpen={isInstModalOpen}
        onClose={() => setIsInstModalOpen(false)}
        onSave={handleSaveInstitution}
        initialData={editingInst}
      />

      <StudyProgramFormModal
        isOpen={isProdiModalOpen}
        onClose={() => setIsProdiModalOpen(false)}
        onSave={handleSaveStudyProgram}
        initialData={editingProdi}
        institutions={institutions}
      />

      <CIFormModal
        isOpen={isCIModalOpen}
        onClose={() => setIsCIModalOpen(false)}
        onSave={handleSaveCI}
        initialData={editingCI}
        rooms={rooms}
      />

      <LecturerFormModal
        isOpen={isLecturerModalOpen}
        onClose={() => setIsLecturerModalOpen(false)}
        onSave={handleSaveLecturer}
        initialData={editingLecturer}
        institutions={institutions}
      />

      {/* Visitor Form Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-slate-800 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-amber-500" />
                Registrasi Tamu / Visitor Pass Baru
              </h3>
              <button
                onClick={() => setIsVisitorModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Tamu *</label>
                <input
                  type="text"
                  required
                  value={visitorForm.name}
                  onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                  placeholder="Nama Lengkap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK / No. Identitas *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.identityNumber}
                    onChange={(e) => setVisitorForm({ ...visitorForm, identityNumber: e.target.value })}
                    placeholder="617101..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instansi / Kampus Asal *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.institution}
                    onChange={(e) => setVisitorForm({ ...visitorForm, institution: e.target.value })}
                    placeholder="Universitas / Instansi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keperluan Kunjungan *</label>
                <input
                  type="text"
                  required
                  value={visitorForm.purpose}
                  onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                  placeholder="Supervisi Praktik / Kunjungan Dinas"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Dituju</label>
                  <input
                    type="text"
                    value={visitorForm.destinationUnit}
                    onChange={(e) => setVisitorForm({ ...visitorForm, destinationUnit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    placeholder="0812-..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Terbitkan Visitor Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal for Student */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-slate-800 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <img
                  src={detailStudent.avatar}
                  alt={detailStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{detailStudent.name}</h3>
                  <div className="text-xs font-mono text-amber-700">NIM: {detailStudent.nim} • {detailStudent.institutionName}</div>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 border-b pb-1">Identitas Mahasiswa</h4>
                <div><span className="text-slate-400">NIK:</span> {detailStudent.nik || '-'}</div>
                <div><span className="text-slate-400">Tempat, Tgl Lahir:</span> {detailStudent.birthPlace || 'Pontianak'}, {detailStudent.birthDate || '2001-01-01'}</div>
                <div><span className="text-slate-400">Jenis Kelamin:</span> {detailStudent.gender}</div>
                <div><span className="text-slate-400">Nomor HP:</span> {detailStudent.phone}</div>
                <div><span className="text-slate-400">Email:</span> {detailStudent.email}</div>
                <div><span className="text-slate-400">Alamat:</span> {detailStudent.address || 'Pontianak'}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 border-b pb-1">Data Praktik Klinik</h4>
                <div><span className="text-slate-400">No. Registrasi:</span> {detailStudent.registrationNumber || '-'}</div>
                <div><span className="text-slate-400">Ruangan Stase:</span> <span className="font-bold text-slate-900">{detailStudent.roomName}</span></div>
                <div><span className="text-slate-400">Program Studi:</span> {detailStudent.studyProgram}</div>
                <div><span className="text-slate-400">Periode:</span> {detailStudent.periodStart} s/d {detailStudent.periodEnd}</div>
                <div><span className="text-slate-400">Clinical Instructor:</span> {detailStudent.ciName}</div>
                <div><span className="text-slate-400">Dosen Pembimbing:</span> {detailStudent.lecturerName}</div>
                <div><span className="text-slate-400">No. Kartu Digital:</span> <span className="font-mono font-bold text-amber-700">{detailStudent.cardNumber}</span></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <button
                onClick={() => {
                  const s = detailStudent;
                  setDetailStudent(null);
                  openDigitalCard({ student: s });
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2"
              >
                <IdCard className="w-4 h-4" />
                Buka Kartu Digital
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Notification Dialog */}
      {resetPasswordResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Password Sementara Mahasiswa</h3>
            <p className="text-xs text-slate-500 mt-1">
              Password untuk <span className="font-bold text-slate-800">{resetPasswordResult.name}</span> berhasil di-reset:
            </p>
            <div className="my-4 p-3 bg-slate-100 rounded-2xl font-mono text-lg font-bold text-amber-700 tracking-wider">
              {resetPasswordResult.tempPass}
            </div>
            <p className="text-[11px] text-slate-400">
              Salin dan berikan kode PIN ini kepada mahasiswa untuk login pertama kali.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(resetPasswordResult.tempPass);
                setResetPasswordResult(null);
                showToast('Disalin', 'Password sementara disalin ke clipboard.', 'success');
              }}
              className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              Salin & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Import CSV / Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 text-slate-800 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-500" />
                Import Data Mahasiswa (Excel / CSV)
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Tempel data CSV atau teks berformat: <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800">NIM, Nama, JenisKelamin, Institusi, ProgramStudi, Semester, NoHP</code>
            </p>

            <textarea
              rows={8}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              placeholder="Contoh:&#10;I1031201099, Siti Sarah Aisyah, Perempuan, Universitas Tanjungpura, Profesi Ners, 8, 0812-4433-2211&#10;I1031201100, Ahmad Fauzan, Laki-laki, Universitas Tanjungpura, Profesi Ners, 8, 0852-9988-1122"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessImportCsv}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                Proses Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
