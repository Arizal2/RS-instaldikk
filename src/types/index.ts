export type UserRole = 'admin' | 'ci' | 'mahasiswa' | 'dosen' | 'tamu';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  identifierNumber?: string; // NIM / NIP / NIDN
  institution?: string;
  studyProgram?: string;
  specialization?: string;
  bio?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  address?: string;
  registeredAt?: string;
}

export type AccountStatus = 'Aktif' | 'Nonaktif' | 'Belum Diverifikasi';
export type CardStatus = 'Aktif' | 'Akan Berakhir' | 'Kadaluarsa' | 'Dinonaktifkan';
export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Dinas/Penugasan' | 'Tidak Hadir' | 'Pulang';

export interface Student {
  id: string;
  // Identitas
  nim: string;
  nik?: string;
  name: string;
  nickname?: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace?: string;
  birthDate?: string;
  address?: string;
  phone: string;
  email: string;
  avatar: string;
  
  // Pendidikan
  institutionId: string;
  institutionName: string;
  faculty?: string;
  studyProgram: string;
  educationLevel?: 'D3' | 'D4' | 'S1' | 'Profesi Ners' | 'Profesi Dokter' | 'Spesialis';
  semester: number;
  academicYear?: string;

  // Data Praktik
  registrationNumber?: string;
  periodStart: string;
  periodEnd: string;
  roomId: string;
  roomName: string;
  practiceGroup?: string;
  ciId: string;
  ciName: string;
  lecturerId: string;
  lecturerName: string;
  status: 'Aktif' | 'Selesai' | 'Pra-Praktik' | 'Cuti';
  competencyProgress: number; // 0 - 100

  // Akun & Kartu Digital
  username?: string;
  password?: string;
  temporaryPassword?: string;
  role?: 'MAHASISWA';
  accountStatus: AccountStatus;
  cardStatus: CardStatus;
  cardNumber?: string;
  qrCodeToken: string;
  cardIssuedDate?: string;
}

export interface ClinicalInstructor {
  id: string;
  // Identitas
  nip: string;
  nik?: string;
  name: string;
  title: string;
  gender?: 'Laki-laki' | 'Perempuan';
  phone: string;
  email: string;
  avatar: string;
  specialization: string;
  department: string;
  
  // Kompetensi & Penugasan
  education?: string;
  position?: string;
  certifications?: string[];
  clinicalCompetency?: string[];
  roomId?: string;
  assignedStudentsCount: number;
  periodAssignment?: string;
  institutionPartners?: string[];

  // Akun & Kartu
  username?: string;
  accountStatus?: AccountStatus;
  qrCodeToken?: string;
  status: 'Aktif' | 'Cuti';
}

export interface Lecturer {
  id: string;
  nidn: string;
  nidk?: string;
  name: string;
  title: string;
  institutionId: string;
  institutionName: string;
  faculty?: string;
  studyProgram: string;
  phone: string;
  email: string;
  avatar: string;
  assignedStudentsCount: number;
  accountStatus?: AccountStatus;
}

export interface Visitor {
  id: string;
  registrationNumber: string;
  name: string;
  institution: string;
  position: string;
  phone: string;
  email: string;
  purpose: 'Kunjungan' | 'Rapat' | 'Pendidikan' | 'Studi Banding' | 'Penelitian' | 'Kerja Sama' | 'Lainnya';
  targetPersonOrUnit: string;
  visitDate: string;
  entryTime: string;
  exitTime?: string;
  avatar?: string;
  notes?: string;
  status: 'Aktif' | 'Selesai' | 'Kadaluarsa';
  qrPassToken: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // Senin, Selasa, dll
  studentId: string;
  studentName: string;
  studentNim: string;
  studentAvatar?: string;
  institutionName: string;
  studyProgram: string;
  roomId: string;
  roomName: string;
  shift: ShiftType;
  ciId: string;
  ciName: string;
  checkInTime?: string; // HH:mm (e.g. 07:03)
  checkOutTime?: string; // HH:mm (e.g. 15:05)
  duration?: string; // e.g. "08 Jam 02 Menit"
  status: AttendanceStatus;
  verificationMethod: 'QR Scanner' | 'Manual Admin' | 'Verifikasi CI';
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  activeStudents: number;
  totalAlumni: number;
  logo: string;
  accreditation?: string;
  mouNumber?: string;
  mouExpiryDate?: string;
  website?: string;
}

export interface StudyProgram {
  id: string;
  institutionId: string;
  institutionName?: string;
  name: string;
  degree: string; // 'D3' | 'D4' | 'S1' | 'Profesi' | 'Spesialis'
  level: string;
  code?: string;
  headOfProgram?: string;
  activeStudentsCount?: number;
}

export interface PracticeRoom {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  currentStudentsCount: number;
  ciInChargeId: string;
  ciInChargeName: string;
  description: string;
  status: 'Aktif' | 'Penuh' | 'Maintenance';
  equipment: string[];
}

export type ShiftType = 'Pagi' | 'Siang' | 'Malam';
export type ScheduleStatus = 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai' | 'Dibatalkan';

export interface PracticeSchedule {
  id: string;
  studentId: string;
  studentName: string;
  institutionName: string;
  studyProgram: string;
  startDate: string;
  endDate: string;
  shift: ShiftType;
  roomId: string;
  roomName: string;
  ciId: string;
  ciName: string;
  lecturerId: string;
  lecturerName: string;
  status: ScheduleStatus;
  notes?: string;
}

export type DocumentType = 'Tugas Harian' | 'Laporan Kasus' | 'Logbook' | 'Dokumentasi Foto' | 'Jurnal Refleksi' | 'SOP Evaluasi';
export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'jpg' | 'png';
export type ReviewStatus = 'Menunggu Pemeriksaan' | 'Diterima' | 'Perlu Revisi' | 'Ditolak';

export interface DocumentItem {
  id: string;
  title: string;
  type: DocumentType;
  format: DocumentFormat;
  fileName: string;
  fileSize: string; // e.g. "2.4 MB"
  fileUrl: string;
  studentId: string;
  studentName: string;
  institutionName: string;
  roomId: string;
  roomName: string;
  ciId: string;
  ciName: string;
  uploadedAt: string;
  reviewStatus: ReviewStatus;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  grade?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  recipientId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachment?: {
    name: string;
    type: string;
    size: string;
    url: string;
  };
}

export interface ConsultationSession {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  institution: string;
  ciId: string;
  ciName: string;
  lecturerId: string;
  lecturerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountStudent: number;
  unreadCountCI: number;
  unreadCountLecturer: number;
}

export type LibraryCategory =
  | 'Keperawatan'
  | 'Kedokteran'
  | 'Kebidanan'
  | 'Farmasi'
  | 'Manajemen Rumah Sakit'
  | 'Keselamatan Pasien'
  | 'PPI'
  | 'PMKP'
  | 'Kegawatdaruratan'
  | 'ICU'
  | 'Lainnya';

export type LibraryDocType = 'Buku' | 'Modul' | 'SOP' | 'Panduan Praktik' | 'Jurnal' | 'Materi Pembelajaran' | 'Video Pembelajaran' | 'Dokumen Pendidikan';

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: LibraryCategory;
  docType: LibraryDocType;
  year: number;
  publisher?: string;
  keywords: string[];
  description: string;
  isPublic: boolean;
  fileSize: string;
  fileFormat: string;
  downloadCount: number;
  coverImage: string;
  pdfUrl: string;
  videoUrl?: string;
  uploadedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: 'Pilihan Ganda' | 'Benar/Salah' | 'Studi Kasus / Vignette';
  question: string;
  caseVignette?: string; // Optional clinical scenario / patient vignette
  imageUrl?: string; // Optional clinical image / EKG / CT / X-Ray url
  category?: string;
  options?: QuestionOption[]; // for multiple choice (A, B, C, D, E)
  correctAnswer: string; // option id or 'Benar'/'Salah'
  explanation: string;
  score: number;
}

export interface TestItem {
  id: string;
  title: string;
  type: 'Pre-Test' | 'Post-Test';
  category: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  isActive: boolean;
  totalQuestions: number;
  questions: Question[];
  createdAt: string;
  authorName: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  testType: 'Pre-Test' | 'Post-Test';
  studentId: string;
  studentName: string;
  institutionName: string;
  score: number;
  passed: boolean;
  totalCorrect: number;
  totalQuestions: number;
  completedAt: string;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface LearningEvaluation {
  id: string;
  studentId: string;
  studentName?: string; // empty if anonymous
  isAnonymous: boolean;
  institutionName: string;
  roomId: string;
  roomName: string;
  ciId: string;
  ciName: string;
  lecturerId: string;
  lecturerName: string;
  period: string;
  submittedAt: string;
  
  // Rating 1 - 5
  ratingCI: number;
  ratingLecturer: number;
  ratingEnvironment: number;
  ratingFacility: number;
  ratingLearningProcess: number;
  ratingMaterials: number;
  ratingSchedule: number;
  ratingInstaldikService: number;
  
  satisfactionLevel: 'Sangat Puas' | 'Puas' | 'Cukup' | 'Kurang' | 'Sangat Kurang';
  favoriteExperience: string;
  constructiveFeedback: string;
  suggestionsForInstaldik: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // specific user or all if undefined
  targetRole?: UserRole | 'all';
  type: 'jadwal' | 'tugas' | 'konsultasi' | 'ujian' | 'evaluasi' | 'sistem';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  details: string;
  ipOrDevice?: string;
  status?: 'success' | 'failed';
}

export interface RegisterUserData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  identifierNumber?: string; // NIM, NIP, NIDN, NRP, NIK
  institution?: string;
  studyProgram?: string;
  specialization?: string;
  address?: string;
  bio?: string;
  // Mahasiswa specific
  semester?: number;
  educationLevel?: 'D3' | 'D4' | 'S1' | 'Profesi Ners' | 'Profesi Dokter' | 'Spesialis';
  roomId?: string;
  roomName?: string;
  // Tamu specific
  visitorPurpose?: 'Kunjungan' | 'Rapat' | 'Pendidikan' | 'Studi Banding' | 'Penelitian' | 'Kerja Sama' | 'Lainnya';
  adminPasscode?: string;
}

export interface AuthModalState {
  isOpen: boolean;
  initialTab: 'login' | 'register' | 'credentials';
  defaultRole?: UserRole;
}

