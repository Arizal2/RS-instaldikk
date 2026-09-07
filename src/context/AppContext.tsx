import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Student,
  ClinicalInstructor,
  Lecturer,
  Institution,
  StudyProgram,
  PracticeRoom,
  PracticeSchedule,
  DocumentItem,
  ChatMessage,
  LibraryItem,
  TestItem,
  TestAttempt,
  LearningEvaluation,
  NotificationItem,
  ActivityLog,
  ReviewStatus,
  ScheduleStatus,
  Visitor,
  AttendanceRecord,
  AttendanceStatus,
  ShiftType,
  RegisterUserData,
  AuthModalState
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_INSTITUTIONS,
  INITIAL_STUDY_PROGRAMS,
  INITIAL_CLINICAL_INSTRUCTORS,
  INITIAL_LECTURERS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_SCHEDULES,
  INITIAL_DOCUMENTS,
  INITIAL_LIBRARY_ITEMS,
  INITIAL_TESTS,
  INITIAL_TEST_ATTEMPTS,
  INITIAL_EVALUATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_VISITORS,
  INITIAL_ATTENDANCE_RECORDS
} from '../data/initialData';
import {
  generateStudentAttendanceToken,
  generateCIQrToken,
  generateVisitorPassToken,
  calculateDuration,
  determineAttendanceStatus
} from '../utils/qrAndAttendance';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface PdfViewerState {
  isOpen: boolean;
  title: string;
  url: string;
  format: string;
  docType?: string;
  author?: string;
}

export interface DigitalCardModalState {
  isOpen: boolean;
  student?: Student;
  ci?: ClinicalInstructor;
  visitor?: Visitor;
}

export interface ScannerModalState {
  isOpen: boolean;
  mode: 'attendance' | 'verify' | 'general';
}

export interface BatchPrintModalState {
  isOpen: boolean;
  selectedStudentIds: string[];
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  allUsers: User[];
  
  // Data collections
  students: Student[];
  clinicalInstructors: ClinicalInstructor[];
  lecturers: Lecturer[];
  institutions: Institution[];
  studyPrograms: StudyProgram[];
  rooms: PracticeRoom[];
  schedules: PracticeSchedule[];
  documents: DocumentItem[];
  libraryItems: LibraryItem[];
  tests: TestItem[];
  testAttempts: TestAttempt[];
  evaluations: LearningEvaluation[];
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  visitors: Visitor[];
  attendanceRecords: AttendanceRecord[];
  
  // CRUD Actions
  // Students
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleStudentAccountStatus: (id: string) => void;
  resetStudentPassword: (id: string) => string;
  generateStudentDigitalCard: (id: string) => void;
  importStudents: (newStudents: Omit<Student, 'id'>[]) => { successCount: number; duplicateCount: number; errors: string[] };
  bulkUpdateStudents: (ids: string[], data: Partial<Student>) => void;
  
  // Clinical Instructors
  addCI: (ci: Omit<ClinicalInstructor, 'id'>) => void;
  updateCI: (id: string, data: Partial<ClinicalInstructor>) => void;
  deleteCI: (id: string) => void;

  // Lecturers
  addLecturer: (lecturer: Omit<Lecturer, 'id'>) => void;
  updateLecturer: (id: string, data: Partial<Lecturer>) => void;
  deleteLecturer: (id: string) => void;

  // Institutions
  addInstitution: (inst: Omit<Institution, 'id'>) => void;
  updateInstitution: (id: string, data: Partial<Institution>) => void;
  deleteInstitution: (id: string) => void;

  // Study Programs (Prodi)
  addStudyProgram: (prog: Omit<StudyProgram, 'id'>) => void;
  updateStudyProgram: (id: string, data: Partial<StudyProgram>) => void;
  deleteStudyProgram: (id: string) => void;

  // Rooms
  addRoom: (room: Omit<PracticeRoom, 'id'>) => void;
  updateRoom: (id: string, data: Partial<PracticeRoom>) => void;
  deleteRoom: (id: string) => void;

  // Schedules
  addSchedule: (schedule: Omit<PracticeSchedule, 'id'>) => void;
  updateSchedule: (id: string, data: Partial<PracticeSchedule>) => void;
  updateScheduleStatus: (id: string, status: ScheduleStatus) => void;
  deleteSchedule: (id: string) => void;

  // Attendance
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, data: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  checkInStudentViaQR: (tokenOrNim: string, shift?: ShiftType, roomId?: string, manualTime?: string) => { success: boolean; message: string; record?: AttendanceRecord; student?: Student };
  checkOutStudentViaQR: (tokenOrNim: string, manualTime?: string) => { success: boolean; message: string; record?: AttendanceRecord; student?: Student };

  // Visitors
  addVisitor: (visitor: Omit<Visitor, 'id' | 'createdAt' | 'qrPassToken' | 'status'>) => Visitor;
  updateVisitor: (id: string, data: Partial<Visitor>) => void;
  checkoutVisitor: (id: string) => void;

  // Profile Management
  updateUserProfile: (userId: string, data: Partial<User>) => void;

  // Documents
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'reviewStatus'>) => void;
  reviewDocument: (id: string, status: ReviewStatus, feedback?: string, grade?: number) => void;
  deleteDocument: (id: string) => void;

  // Library
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  updateLibraryItem: (id: string, data: Partial<LibraryItem>) => void;
  deleteLibraryItem: (id: string) => void;
  incrementDownload: (id: string) => void;

  // Tests
  addTest: (test: Omit<TestItem, 'id' | 'createdAt'>) => void;
  updateTest: (id: string, data: Partial<TestItem>) => void;
  deleteTest: (id: string) => void;
  toggleTestActive: (id: string) => void;
  submitTestAttempt: (attempt: Omit<TestAttempt, 'id' | 'completedAt'>) => TestAttempt;

  // Evaluations
  submitEvaluation: (evaluation: Omit<LearningEvaluation, 'id' | 'submittedAt'>) => void;

  // Chat
  sendMessage: (recipientId: string, text: string, attachment?: ChatMessage['attachment']) => void;
  markChatAsRead: (senderId: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  logActivity: (action: string, entity: string, details: string, status?: 'success' | 'failed') => void;

  // UI Modals & Helpers
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  pdfViewer: PdfViewerState;
  openPdfViewer: (title: string, url: string, format?: string, docType?: string, author?: string) => void;
  closePdfViewer: () => void;
  digitalCardModal: DigitalCardModalState;
  openDigitalCard: (item: { student?: Student; ci?: ClinicalInstructor; visitor?: Visitor }) => void;
  closeDigitalCard: () => void;
  scannerModal: ScannerModalState;
  openScanner: (mode?: 'attendance' | 'verify' | 'general') => void;
  closeScanner: () => void;
  batchPrintModal: BatchPrintModalState;
  openBatchPrint: (studentIds?: string[]) => void;
  closeBatchPrint: () => void;
  authModal: AuthModalState;
  openAuthModal: (tab?: 'login' | 'register' | 'credentials', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  registerUser: (userData: RegisterUserData) => { success: boolean; message: string; user?: User };
  authenticateUser: (identifier: string, password?: string) => { success: boolean; message: string; user?: User };
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'e_instaldik_rskh_';

function getStoredOrInitial<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return initial;
}

let uniqueIdCounter = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  uniqueIdCounter = (uniqueIdCounter + 1) % 1000000;
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${Date.now()}_${uniqueIdCounter}_${rand}`;
};

function deduplicateAndSanitize<T extends { id: string }>(items: T[], prefix: string): T[] {
  const seen = new Set<string>();
  return items.map((item, idx) => {
    let id = item.id;
    if (!id || seen.has(id)) {
      id = `${prefix}_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`;
    }
    seen.add(id);
    return { ...item, id };
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const stored = getStoredOrInitial('users_list', INITIAL_USERS);
    const seenIds = new Set<string>();
    // Ensure existing or newly loaded users have passwords mapped and unique ids
    return stored.map((u, idx) => {
      let id = u.id;
      if (!id || seenIds.has(id)) {
        id = `usr_${u.role}_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`;
      }
      seenIds.add(id);
      const match = INITIAL_USERS.find(iu => iu.id === u.id || iu.username.toLowerCase() === u.username.toLowerCase());
      return {
        ...u,
        id,
        password: u.password || (match ? match.password : 'kartika123')
      };
    });
  });
  const [currentUser, setCurrentUser] = useState<User>(() => getStoredOrInitial('user', INITIAL_USERS[0]));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getStoredOrInitial('isLoggedIn', true));
  const [currentView, setCurrentView] = useState<string>(() => getStoredOrInitial('currentView', 'dashboard'));

  // Data states with persistence and ID deduplication (recovers gracefully from any stale duplicates in localStorage)
  const [students, setStudents] = useState<Student[]>(() => deduplicateAndSanitize(getStoredOrInitial('students', INITIAL_STUDENTS), 'std'));
  const [clinicalInstructors, setClinicalInstructors] = useState<ClinicalInstructor[]>(() => deduplicateAndSanitize(getStoredOrInitial('cis', INITIAL_CLINICAL_INSTRUCTORS), 'ci'));
  const [lecturers, setLecturers] = useState<Lecturer[]>(() => deduplicateAndSanitize(getStoredOrInitial('lecturers', INITIAL_LECTURERS), 'lec'));
  const [institutions, setInstitutions] = useState<Institution[]>(() => deduplicateAndSanitize(getStoredOrInitial('institutions', INITIAL_INSTITUTIONS), 'inst'));
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>(() => deduplicateAndSanitize(getStoredOrInitial('study_programs', INITIAL_STUDY_PROGRAMS), 'prog'));
  const [rooms, setRooms] = useState<PracticeRoom[]>(() => deduplicateAndSanitize(getStoredOrInitial('rooms', INITIAL_ROOMS), 'room'));
  const [schedules, setSchedules] = useState<PracticeSchedule[]>(() => deduplicateAndSanitize(getStoredOrInitial('schedules', INITIAL_SCHEDULES), 'sch'));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => deduplicateAndSanitize(getStoredOrInitial('documents', INITIAL_DOCUMENTS), 'doc'));
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => deduplicateAndSanitize(getStoredOrInitial('library', INITIAL_LIBRARY_ITEMS), 'lib'));
  const [tests, setTests] = useState<TestItem[]>(() => deduplicateAndSanitize(getStoredOrInitial('tests', INITIAL_TESTS), 'test'));
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => deduplicateAndSanitize(getStoredOrInitial('test_attempts', INITIAL_TEST_ATTEMPTS), 'att'));
  const [evaluations, setEvaluations] = useState<LearningEvaluation[]>(() => deduplicateAndSanitize(getStoredOrInitial('evaluations', INITIAL_EVALUATIONS), 'eval'));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => deduplicateAndSanitize(getStoredOrInitial('chats', INITIAL_CHAT_MESSAGES), 'msg'));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => deduplicateAndSanitize(getStoredOrInitial('notifications', INITIAL_NOTIFICATIONS), 'notif'));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => deduplicateAndSanitize(getStoredOrInitial('activity_logs', INITIAL_ACTIVITY_LOGS), 'log'));
  const [visitors, setVisitors] = useState<Visitor[]>(() => deduplicateAndSanitize(getStoredOrInitial('visitors', INITIAL_VISITORS), 'vis'));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => deduplicateAndSanitize(getStoredOrInitial('attendance_records', INITIAL_ATTENDANCE_RECORDS), 'att_rec'));

  // UI States
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [pdfViewer, setPdfViewer] = useState<PdfViewerState>({
    isOpen: false,
    title: '',
    url: '',
    format: 'pdf'
  });
  const [digitalCardModal, setDigitalCardModal] = useState<DigitalCardModalState>({
    isOpen: false
  });
  const [scannerModal, setScannerModal] = useState<ScannerModalState>({
    isOpen: false,
    mode: 'attendance'
  });
  const [batchPrintModal, setBatchPrintModal] = useState<BatchPrintModalState>({
    isOpen: false,
    selectedStudentIds: []
  });
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    initialTab: 'login'
  });

  const openAuthModal = (tab: 'login' | 'register' | 'credentials' = 'login', defaultRole?: UserRole) => {
    setAuthModal({
      isOpen: true,
      initialTab: tab,
      defaultRole
    });
  };

  const closeAuthModal = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'users_list', JSON.stringify(allUsers));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'currentView', JSON.stringify(currentView));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'cis', JSON.stringify(clinicalInstructors));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'lecturers', JSON.stringify(lecturers));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'institutions', JSON.stringify(institutions));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'study_programs', JSON.stringify(studyPrograms));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'rooms', JSON.stringify(rooms));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'schedules', JSON.stringify(schedules));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'documents', JSON.stringify(documents));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'library', JSON.stringify(libraryItems));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'tests', JSON.stringify(tests));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'test_attempts', JSON.stringify(testAttempts));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'evaluations', JSON.stringify(evaluations));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'chats', JSON.stringify(chatMessages));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'activity_logs', JSON.stringify(activityLogs));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'visitors', JSON.stringify(visitors));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'attendance_records', JSON.stringify(attendanceRecords));
  }, [
    currentUser, allUsers, isLoggedIn, currentView, students, clinicalInstructors, lecturers,
    institutions, studyPrograms, rooms, schedules, documents, libraryItems, tests,
    testAttempts, evaluations, chatMessages, notifications, activityLogs, visitors, attendanceRecords
  ]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openPdfViewer = (title: string, url: string, format: string = 'pdf', docType?: string, author?: string) => {
    setPdfViewer({
      isOpen: true,
      title,
      url,
      format,
      docType,
      author
    });
  };

  const closePdfViewer = () => {
    setPdfViewer(prev => ({ ...prev, isOpen: false }));
  };

  const openDigitalCard = (item: { student?: Student; ci?: ClinicalInstructor; visitor?: Visitor }) => {
    setDigitalCardModal({
      isOpen: true,
      ...item
    });
  };

  const closeDigitalCard = () => {
    setDigitalCardModal({ isOpen: false });
  };

  const openScanner = (mode: 'attendance' | 'verify' | 'general' = 'attendance') => {
    setScannerModal({
      isOpen: true,
      mode
    });
  };

  const closeScanner = () => {
    setScannerModal({ isOpen: false, mode: 'attendance' });
  };

  const openBatchPrint = (studentIds?: string[]) => {
    setBatchPrintModal({
      isOpen: true,
      selectedStudentIds: studentIds && studentIds.length > 0 ? studentIds : students.map(s => s.id)
    });
  };

  const closeBatchPrint = () => {
    setBatchPrintModal({ isOpen: false, selectedStudentIds: [] });
  };

  const logActivity = (action: string, entity: string, details: string, status: 'success' | 'failed' = 'success') => {
    const newLog: ActivityLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toLocaleString('id-ID'),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      details,
      status,
      ipOrDevice: '192.168.10.' + (Math.floor(Math.random() * 80) + 10) + ' (Web Client)'
    };
    setActivityLogs(prev => {
      const filtered = prev.filter(l => l.id !== newLog.id);
      return [newLog, ...filtered.slice(0, 199)];
    });
  };

  const login = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    showToast('Selamat Datang', `Berhasil masuk sebagai ${user.name} (${user.role.toUpperCase()})`, 'success');
    logActivity('LOGIN', 'Sistem e-Instaldik RSKH', `User ${user.name} berhasil login.`);
  };

  const logout = () => {
    const guestUser = INITIAL_USERS.find(u => u.role === 'tamu') || INITIAL_USERS[0];
    setCurrentUser(guestUser);
    setIsLoggedIn(false);
    setCurrentView('landing');
    showToast('Logout Berhasil', 'Anda telah keluar dari sesi aplikasi.', 'info');
    logActivity('LOGOUT', 'Sistem e-Instaldik RSKH', 'Sesi berakhir.');
  };

  const switchRole = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role) || {
      id: 'usr_' + role,
      name: role === 'admin' ? 'Mayor Ckm dr. Andi Wijaya, Sp.PD' :
            role === 'ci' ? 'Ns. Siti Rahmawati, M.Kep' :
            role === 'mahasiswa' ? 'Rizal Fahmi Pratama' :
            role === 'dosen' ? 'Dr. Ns. Yuliana Triastuti, M.Kep' : 'Dr. H. Irwan Gunawan, M.Kes',
      email: `${role}@rskartikahusada.mil.id`,
      username: role,
      role: role
    };
    setCurrentUser(targetUser);
    setIsLoggedIn(role !== 'tamu');
    setCurrentView(role === 'tamu' ? 'landing' : 'dashboard');
    showToast('Role Berganti', `Sekarang aktif sebagai: ${role.toUpperCase()} (${targetUser.name})`, 'info');
    logActivity('SWITCH_ROLE', `Role: ${role}`, `Beralih ke tampilan role ${role}`);
  };

  const registerUser = (userData: RegisterUserData): { success: boolean; message: string; user?: User } => {
    const cleanUsername = userData.username.trim().toLowerCase();
    const cleanEmail = userData.email.trim().toLowerCase();

    // Check duplicate
    const existing = allUsers.find(u => 
      u.username.toLowerCase() === cleanUsername || 
      u.email.toLowerCase() === cleanEmail ||
      (userData.identifierNumber && u.identifierNumber && u.identifierNumber.toLowerCase() === userData.identifierNumber.trim().toLowerCase())
    );

    if (existing) {
      return { 
        success: false, 
        message: `Pendaftaran gagal: Username "${cleanUsername}" atau Email "${cleanEmail}" sudah terdaftar.` 
      };
    }

    if (!userData.password || userData.password.length < 3) {
      return {
        success: false,
        message: 'Password minimal 3 karakter.'
      };
    }

    const newId = generateUniqueId(`usr_${userData.role}`);
    const newUser: User = {
      id: newId,
      name: userData.name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      password: userData.password,
      role: userData.role,
      phone: userData.phone || '',
      identifierNumber: userData.identifierNumber || '',
      institution: userData.institution || (userData.role === 'admin' ? 'RS TK II Kartika Husada' : 'Universitas Tanjungpura'),
      studyProgram: userData.studyProgram || '',
      specialization: userData.specialization || '',
      gender: userData.gender || 'Laki-laki',
      address: userData.address || '',
      bio: userData.bio || `Pengguna terdaftar peran ${userData.role.toUpperCase()} e-Instaldik RSKH`,
      registeredAt: new Date().toISOString()
    };

    setAllUsers(prev => [newUser, ...prev]);

    // Sync sub-entities based on role
    if (userData.role === 'mahasiswa') {
      const studentId = generateUniqueId('std');
      const matchedInst = institutions.find(i => i.name.toLowerCase() === (userData.institution || '').toLowerCase());
      const newStudent: Student = {
        id: studentId,
        nim: userData.identifierNumber || ('NIM-' + Math.floor(100000 + Math.random() * 900000)),
        name: userData.name.trim(),
        gender: userData.gender || 'Laki-laki',
        phone: userData.phone || '0812-3456-7890',
        email: cleanEmail,
        avatar: '',
        institutionId: matchedInst?.id || institutions[0]?.id || 'inst_1',
        institutionName: userData.institution || institutions[0]?.name || 'Universitas Tanjungpura',
        studyProgram: userData.studyProgram || 'Profesi Ners (S.Kep)',
        educationLevel: userData.educationLevel || 'S1',
        semester: userData.semester || 1,
        periodStart: new Date().toISOString().split('T')[0],
        periodEnd: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        roomId: userData.roomId || rooms[0]?.id || 'room_1',
        roomName: userData.roomName || rooms[0]?.name || 'Instalasi Gawat Darurat (IGD)',
        ciId: clinicalInstructors[0]?.id || 'ci_1',
        ciName: clinicalInstructors[0]?.name || 'Clinical Instructor RSKH',
        lecturerId: lecturers[0]?.id || 'lec_1',
        lecturerName: lecturers[0]?.name || 'Dosen Pembimbing Kampus',
        status: 'Aktif',
        competencyProgress: 0,
        accountStatus: 'Aktif',
        cardStatus: 'Aktif',
        qrCodeToken: generateUniqueId('STDKH')
      };
      setStudents(prev => [newStudent, ...prev]);
    } else if (userData.role === 'ci') {
      const ciId = generateUniqueId('ci');
      const newCI: ClinicalInstructor = {
        id: ciId,
        nip: userData.identifierNumber || ('NIP ' + Date.now()),
        name: userData.name.trim(),
        title: userData.specialization || 'Clinical Instructor Klinis',
        specialization: userData.specialization || 'Clinical Instructor Keperawatan / Medis',
        department: userData.roomName || 'Instalasi Rawat Inap & Pendidikan',
        phone: userData.phone || '0812-3456-7890',
        email: cleanEmail,
        avatar: '',
        roomId: userData.roomId || rooms[0]?.id || 'room_1',
        assignedStudentsCount: 0,
        status: 'Aktif'
      };
      setClinicalInstructors(prev => [newCI, ...prev]);
    } else if (userData.role === 'dosen') {
      const lecId = generateUniqueId('lec');
      const matchedInst = institutions.find(i => i.name.toLowerCase() === (userData.institution || '').toLowerCase());
      const newLecturer: Lecturer = {
        id: lecId,
        nidn: userData.identifierNumber || ('NIDN ' + Date.now()),
        name: userData.name.trim(),
        title: 'Dosen Pembimbing Lapangan',
        institutionId: matchedInst?.id || institutions[0]?.id || 'inst_1',
        institutionName: userData.institution || institutions[0]?.name || 'Universitas Tanjungpura',
        studyProgram: userData.studyProgram || 'Pendidikan Klinis & Keperawatan',
        phone: userData.phone || '0812-3456-7890',
        email: cleanEmail,
        avatar: '',
        assignedStudentsCount: 0
      };
      setLecturers(prev => [newLecturer, ...prev]);
    } else if (userData.role === 'tamu') {
      const visId = generateUniqueId('vis');
      const newVisitor: Visitor = {
        id: visId,
        registrationNumber: 'VIS-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
        name: userData.name.trim(),
        institution: userData.institution || 'Tamu / Umum',
        position: userData.specialization || 'Pengunjung / Peneliti',
        phone: userData.phone || '0812-3456-7890',
        email: cleanEmail,
        purpose: userData.visitorPurpose || 'Kunjungan',
        targetPersonOrUnit: 'Instalasi Pendidikan (Instaldik) RSKH',
        visitDate: new Date().toISOString().split('T')[0],
        entryTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'Aktif',
        qrPassToken: generateUniqueId('PASS'),
        createdAt: new Date().toISOString()
      };
      setVisitors(prev => [newVisitor, ...prev]);
    }

    logActivity('REGISTER', `Pendaftaran Akun (${userData.role.toUpperCase()})`, `Akun user: "${newUser.username}" (${newUser.name}) berhasil terdaftar.`);
    showToast('Pendaftaran Berhasil!', `Akun ${newUser.name} (${userData.role.toUpperCase()}) berhasil didaftarkan.`, 'success');

    return { success: true, message: 'Pendaftaran akun berhasil!', user: newUser };
  };

  const authenticateUser = (identifier: string, password?: string): { success: boolean; message: string; user?: User } => {
    const cleanId = identifier.trim().toLowerCase();
    const matched = allUsers.find(u => 
      u.username.toLowerCase() === cleanId || 
      u.email.toLowerCase() === cleanId || 
      (u.identifierNumber && u.identifierNumber.toLowerCase() === cleanId)
    );

    if (!matched) {
      return { success: false, message: `Akun "${identifier}" tidak ditemukan dalam sistem.` };
    }

    if (password && password.trim()) {
      if (matched.password && matched.password !== password.trim()) {
        return { success: false, message: 'Kata sandi (password) tidak cocok. Silakan cek daftar kredensial akun.' };
      }
    }

    login(matched);
    return { success: true, message: 'Login berhasil!', user: matched };
  };

  // Profile Management (RBAC: user can edit personal details, phone, bio, avatar, address)
  const updateUserProfile = (userId: string, data: Partial<User>) => {
    // 1. Update currentUser if matching
    if (currentUser.id === userId || currentUser.username === data.username) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }

    // 2. Update in allUsers list
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));

    // 3. Update in corresponding sub-collection if applicable
    if (currentUser.role === 'mahasiswa') {
      setStudents(prev => prev.map(s => {
        if (s.email === currentUser.email || s.nim === currentUser.identifierNumber || s.name === currentUser.name) {
          return {
            ...s,
            name: data.name || s.name,
            phone: data.phone || s.phone,
            email: data.email || s.email,
            avatar: data.avatar || s.avatar,
            address: data.address || s.address,
            gender: data.gender || s.gender
          };
        }
        return s;
      }));
    } else if (currentUser.role === 'ci') {
      setClinicalInstructors(prev => prev.map(c => {
        if (c.email === currentUser.email || c.nip === currentUser.identifierNumber || c.name === currentUser.name) {
          return {
            ...c,
            name: data.name || c.name,
            phone: data.phone || c.phone,
            email: data.email || c.email,
            avatar: data.avatar || c.avatar,
            specialization: data.specialization || c.specialization,
            gender: data.gender || c.gender
          };
        }
        return c;
      }));
    } else if (currentUser.role === 'dosen') {
      setLecturers(prev => prev.map(l => {
        if (l.email === currentUser.email || l.nidn === currentUser.identifierNumber || l.name === currentUser.name) {
          return {
            ...l,
            name: data.name || l.name,
            phone: data.phone || l.phone,
            email: data.email || l.email,
            avatar: data.avatar || l.avatar
          };
        }
        return l;
      }));
    }

    showToast('Profil Diperbarui', 'Informasi profil Anda berhasil disimpan.', 'success');
    logActivity('UPDATE_PROFILE', currentUser.name, 'Pembaruan data profil mandiri.');
  };

  // CRUD Students
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const id = generateUniqueId('std');
    const token = studentData.qrCodeToken || generateStudentAttendanceToken(id, studentData.nim);
    const cardNum = studentData.cardNumber || `RSKH-KMP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(students.length + 1).padStart(3, '0')}`;
    
    const newStudent: Student = {
      ...studentData,
      id,
      qrCodeToken: token,
      cardNumber: cardNum,
      accountStatus: studentData.accountStatus || 'Aktif',
      cardStatus: studentData.cardStatus || 'Aktif',
      cardIssuedDate: studentData.cardIssuedDate || new Date().toISOString().split('T')[0],
      registrationNumber: studentData.registrationNumber || `REG-RSKH-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`
    };

    setStudents(prev => [newStudent, ...prev]);
    showToast('Mahasiswa Terdaftar', `Data ${studentData.name} dan Kartu Digital berhasil dibuat.`, 'success');
    logActivity('TAMBAH_MAHASISWA', studentData.name, `NIM: ${studentData.nim}, No Reg: ${newStudent.registrationNumber}`);
    return newStudent;
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast('Data Diperbarui', 'Data mahasiswa berhasil diperbarui.', 'success');
    logActivity('EDIT_MAHASISWA', data.name || id, 'Pembaruan atribut data mahasiswa.');
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Mahasiswa Dihapus', `Data ${target?.name || id} telah dihapus dari sistem.`, 'info');
    logActivity('HAPUS_MAHASISWA', target?.name || id, `NIM: ${target?.nim}`);
  };

  const toggleStudentAccountStatus = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.accountStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
        showToast('Status Akun Berubah', `Akun ${s.name} sekarang berstatus ${nextStatus}.`, nextStatus === 'Aktif' ? 'success' : 'warning');
        logActivity('STATUS_AKUN', s.name, `Mengubah status akun mahasiswa menjadi ${nextStatus}.`);
        return { ...s, accountStatus: nextStatus };
      }
      return s;
    }));
  };

  const resetStudentPassword = (id: string): string => {
    const tempPass = 'RSKH' + Math.floor(100000 + Math.random() * 900000);
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        logActivity('RESET_PASSWORD', s.name, `Reset password mahasiswa ke PIN sementara: ${tempPass}`);
        return { ...s, temporaryPassword: tempPass, password: tempPass };
      }
      return s;
    }));
    showToast('Password Direset', `Password sementara baru: ${tempPass}`, 'success');
    return tempPass;
  };

  const generateStudentDigitalCard = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const token = generateStudentAttendanceToken(s.id, s.nim);
        const cardNum = `RSKH-KMP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
        logActivity('GENERATE_KARTU', s.name, `Terbit kartu digital baru: ${cardNum}`);
        showToast('Kartu Digital Diterbitkan', `Kartu ID dan QR Absensi ${s.name} berhasil di-generate.`, 'success');
        return {
          ...s,
          cardNumber: cardNum,
          qrCodeToken: token,
          cardStatus: 'Aktif',
          cardIssuedDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));
  };

  const bulkUpdateStudents = (ids: string[], data: Partial<Student>) => {
    setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, ...data } : s));
    showToast('Perubahan Massal Berhasil', `${ids.length} mahasiswa berhasil diperbarui.`, 'success');
    logActivity('EDIT_MASSAL_MAHASISWA', `${ids.length} mahasiswa`, JSON.stringify(data));
  };

  const importStudents = (newStudentsData: Omit<Student, 'id'>[]): { successCount: number; duplicateCount: number; errors: string[] } => {
    const existingNims = new Set(students.map(s => s.nim.toLowerCase().trim()));
    const validToAdd: Student[] = [];
    const errors: string[] = [];
    let duplicateCount = 0;

    newStudentsData.forEach((item, index) => {
      const trimmedNim = item.nim?.trim();
      if (!trimmedNim || !item.name?.trim()) {
        errors.push(`Baris ${index + 1}: Nama dan NIM wajib diisi.`);
        return;
      }
      if (existingNims.has(trimmedNim.toLowerCase())) {
        duplicateCount++;
        errors.push(`Baris ${index + 1}: NIM ${trimmedNim} (${item.name}) sudah terdaftar di sistem.`);
        return;
      }

      existingNims.add(trimmedNim.toLowerCase());
      const id = generateUniqueId(`std_${index}`);
      validToAdd.push({
        ...item,
        id,
        gender: item.gender || 'Laki-laki',
        institutionId: item.institutionId || 'inst_1',
        institutionName: item.institutionName || 'Universitas Tanjungpura',
        studyProgram: item.studyProgram || 'Profesi Ners',
        semester: item.semester || 1,
        phone: item.phone || '-',
        email: item.email || `${trimmedNim.toLowerCase()}@student.ac.id`,
        avatar: item.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        periodStart: item.periodStart || new Date().toISOString().split('T')[0],
        periodEnd: item.periodEnd || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        roomId: item.roomId || 'room_1',
        roomName: item.roomName || 'Intensive Care Unit (ICU)',
        ciId: item.ciId || 'ci_1',
        ciName: item.ciName || 'Ns. Siti Rahmawati, M.Kep',
        lecturerId: item.lecturerId || 'lec_1',
        lecturerName: item.lecturerName || 'Dr. Ns. Yuliana Triastuti, M.Kep',
        status: 'Aktif',
        competencyProgress: 0,
        accountStatus: 'Aktif',
        cardStatus: 'Aktif',
        cardNumber: `RSKH-KMP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(validToAdd.length + 1).padStart(3, '0')}`,
        qrCodeToken: generateStudentAttendanceToken(id, trimmedNim),
        cardIssuedDate: new Date().toISOString().split('T')[0]
      });
    });

    if (validToAdd.length > 0) {
      setStudents(prev => [...validToAdd, ...prev]);
      logActivity('IMPORT_EXCEL', `${validToAdd.length} Mahasiswa Baru`, `Import massal berhasil. Duplikat dilewati: ${duplicateCount}`);
      showToast('Import Berhasil', `${validToAdd.length} mahasiswa berhasil diimpor ke sistem.`, 'success');
    } else {
      showToast('Import Gagal / Kosong', 'Tidak ada data valid yang dapat diimpor.', 'warning');
    }

    return {
      successCount: validToAdd.length,
      duplicateCount,
      errors
    };
  };

  // Attendance Management
  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: generateUniqueId('att_rec')
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
    showToast('Absensi Tercatat', `Absensi untuk ${record.studentName} berhasil disimpan.`, 'success');
    logActivity('ABSENSI_MANUAL', record.studentName, `Status: ${record.status}, Tanggal: ${record.date}`);
  };

  const updateAttendanceRecord = (id: string, data: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('Absensi Diperbarui', 'Data absensi berhasil diubah.', 'success');
    logActivity('EDIT_ABSENSI', id, `Pembaruan status/jam absensi.`);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(a => a.id !== id));
    showToast('Absensi Dihapus', 'Data kehadiran telah dihapus.', 'info');
    logActivity('HAPUS_ABSENSI', id, 'Penghapusan catatan absensi.');
  };

  const checkInStudentViaQR = (
    tokenOrNim: string,
    shift: ShiftType = 'Pagi',
    roomId?: string,
    manualTime?: string
  ): { success: boolean; message: string; record?: AttendanceRecord; student?: Student } => {
    const cleanQuery = tokenOrNim.trim().toLowerCase();
    
    // Find student by token, NIM, or ID
    const student = students.find(s => 
      s.qrCodeToken.toLowerCase() === cleanQuery ||
      s.nim.toLowerCase() === cleanQuery ||
      s.id.toLowerCase() === cleanQuery
    );

    if (!student) {
      logActivity('SCAN_QR_FAILED', tokenOrNim, 'QR Token atau NIM tidak ditemukan dalam database.', 'failed');
      return { success: false, message: 'QR Token atau Mahasiswa tidak terdaftar dalam sistem e-Instaldik RSKH.' };
    }

    if (student.accountStatus === 'Nonaktif') {
      logActivity('SCAN_QR_BLOCKED', student.name, 'Akun dinonaktifkan.', 'failed');
      return { success: false, message: `Akun mahasiswa ${student.name} sedang DINONAKTIFKAN. Hubungi bagian Instaldik.` };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayDayName = dayNames[new Date().getDay()];

    // Check if already checked in today
    const existingRec = attendanceRecords.find(a => a.studentId === student.id && a.date === todayDate);
    if (existingRec && existingRec.checkInTime) {
      return {
        success: false,
        message: `Mahasiswa ${student.name} SUDAH CHECK-IN hari ini pada pukul ${existingRec.checkInTime} (${existingRec.status}). Gunakan Check-Out saat pulang.`,
        student,
        record: existingRec
      };
    }

    const currentTime = manualTime || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    const calculatedStatus = determineAttendanceStatus(currentTime, shift);

    const newRecord: AttendanceRecord = {
      id: generateUniqueId('att_rec'),
      date: todayDate,
      dayName: todayDayName,
      studentId: student.id,
      studentName: student.name,
      studentNim: student.nim,
      studentAvatar: student.avatar,
      institutionName: student.institutionName,
      studyProgram: student.studyProgram,
      roomId: roomId || student.roomId,
      roomName: (rooms.find(r => r.id === roomId)?.name) || student.roomName,
      shift,
      ciId: student.ciId,
      ciName: student.ciName,
      checkInTime: currentTime,
      duration: '-',
      status: calculatedStatus,
      verificationMethod: 'QR Scanner',
      verifiedBy: currentUser.name || 'Scanner Instaldik',
      verifiedAt: `${todayDate} ${currentTime}`
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    logActivity('SCAN_QR_CHECKIN', student.name, `Check-In ${shift} berhasil pada pukul ${currentTime} (Status: ${calculatedStatus})`, 'success');
    showToast('Check-In Berhasil', `${student.name} — ${calculatedStatus.toUpperCase()} (${currentTime})`, calculatedStatus === 'Hadir' ? 'success' : 'warning');

    return {
      success: true,
      message: `Check-In Berhasil! Status: ${calculatedStatus} pada jam ${currentTime}.`,
      student,
      record: newRecord
    };
  };

  const checkOutStudentViaQR = (
    tokenOrNim: string,
    manualTime?: string
  ): { success: boolean; message: string; record?: AttendanceRecord; student?: Student } => {
    const cleanQuery = tokenOrNim.trim().toLowerCase();
    const student = students.find(s => 
      s.qrCodeToken.toLowerCase() === cleanQuery ||
      s.nim.toLowerCase() === cleanQuery ||
      s.id.toLowerCase() === cleanQuery
    );

    if (!student) {
      return { success: false, message: 'Mahasiswa tidak ditemukan.' };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const existingRec = attendanceRecords.find(a => a.studentId === student.id && a.date === todayDate);

    if (!existingRec || !existingRec.checkInTime) {
      return {
        success: false,
        message: `Mahasiswa ${student.name} BELUM CHECK-IN hari ini (${todayDate}). Harap Check-In masuk terlebih dahulu.`,
        student
      };
    }

    if (existingRec.checkOutTime) {
      return {
        success: false,
        message: `Mahasiswa ${student.name} SUDAH CHECK-OUT pada pukul ${existingRec.checkOutTime}. Durasi: ${existingRec.duration}`,
        student,
        record: existingRec
      };
    }

    const checkOutTime = manualTime || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    const dur = calculateDuration(existingRec.checkInTime, checkOutTime);

    const updatedRec: AttendanceRecord = {
      ...existingRec,
      checkOutTime,
      duration: dur,
      status: 'Pulang'
    };

    setAttendanceRecords(prev => prev.map(a => a.id === existingRec.id ? updatedRec : a));
    logActivity('SCAN_QR_CHECKOUT', student.name, `Check-Out pada ${checkOutTime}. Total durasi praktik: ${dur}`, 'success');
    showToast('Check-Out Berhasil', `${student.name} pulang pada ${checkOutTime}. Durasi: ${dur}`, 'success');

    return {
      success: true,
      message: `Check-Out Selesai. Total durasi praktik stase: ${dur}`,
      student,
      record: updatedRec
    };
  };

  // Visitor Management
  const addVisitor = (visData: Omit<Visitor, 'id' | 'createdAt' | 'qrPassToken' | 'status'>): Visitor => {
    const id = generateUniqueId('vis');
    const token = generateVisitorPassToken(id);
    const regNum = `VIS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(visitors.length + 1).padStart(3, '0')}`;

    const newVisitor: Visitor = {
      ...visData,
      id,
      registrationNumber: regNum,
      status: 'Aktif',
      qrPassToken: token,
      createdAt: new Date().toLocaleString('id-ID')
    };

    setVisitors(prev => [newVisitor, ...prev]);
    showToast('Tamu Terdaftar', `Visitor Pass diterbitkan untuk ${visData.name}`, 'success');
    logActivity('REGISTRASI_TAMU', visData.name, `Instansi: ${visData.institution}, Keperluan: ${visData.purpose}`);
    return newVisitor;
  };

  const updateVisitor = (id: string, data: Partial<Visitor>) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    showToast('Data Tamu Diperbarui', 'Data kunjungan berhasil disimpan.', 'success');
    logActivity('EDIT_TAMU', id, 'Pembaruan data tamu.');
  };

  const checkoutVisitor = (id: string) => {
    const exitTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'Selesai', exitTime } : v));
    showToast('Kunjungan Selesai', `Tamu telah check-out pada ${exitTime}.`, 'info');
    logActivity('CHECKOUT_TAMU', id, `Tamu selesai berkunjung pada ${exitTime}`);
  };

  // CI Management
  const addCI = (ciData: Omit<ClinicalInstructor, 'id'>) => {
    const id = generateUniqueId('ci');
    const token = generateCIQrToken(id, ciData.nip);
    const newCI: ClinicalInstructor = {
      ...ciData,
      id,
      accountStatus: 'Aktif',
      qrCodeToken: token
    };
    setClinicalInstructors(prev => [newCI, ...prev]);
    showToast('CI Ditambahkan', `${ciData.name} berhasil didaftarkan sebagai Clinical Instructor.`, 'success');
    logActivity('TAMBAH_CI', ciData.name, `NIP: ${ciData.nip}, Spesialisasi: ${ciData.specialization}`);
  };

  const updateCI = (id: string, data: Partial<ClinicalInstructor>) => {
    setClinicalInstructors(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('Data CI Diperbarui', 'Informasi CI berhasil diperbarui.', 'success');
    logActivity('EDIT_CI', data.name || id, 'Pembaruan data Clinical Instructor.');
  };

  const deleteCI = (id: string) => {
    const target = clinicalInstructors.find(c => c.id === id);
    setClinicalInstructors(prev => prev.filter(c => c.id !== id));
    showToast('CI Dihapus', `Data CI ${target?.name || id} telah dihapus.`, 'info');
    logActivity('HAPUS_CI', target?.name || id, `NIP: ${target?.nip}`);
  };

  // Lecturer Management
  const addLecturer = (lecData: Omit<Lecturer, 'id'>) => {
    const newLecturer: Lecturer = {
      ...lecData,
      id: generateUniqueId('lec'),
      accountStatus: 'Aktif'
    };
    setLecturers(prev => [newLecturer, ...prev]);
    showToast('Dosen Ditambahkan', `${lecData.name} berhasil didaftarkan.`, 'success');
    logActivity('TAMBAH_DOSEN', lecData.name, `NIDN: ${lecData.nidn}, Kampus: ${lecData.institutionName}`);
  };

  const updateLecturer = (id: string, data: Partial<Lecturer>) => {
    setLecturers(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    showToast('Data Dosen Diperbarui', 'Informasi dosen berhasil diperbarui.', 'success');
    logActivity('EDIT_DOSEN', data.name || id, 'Pembaruan data dosen pembimbing.');
  };

  const deleteLecturer = (id: string) => {
    const target = lecturers.find(l => l.id === id);
    setLecturers(prev => prev.filter(l => l.id !== id));
    showToast('Dosen Dihapus', `Data ${target?.name || id} telah dihapus.`, 'info');
    logActivity('HAPUS_DOSEN', target?.name || id, `NIDN: ${target?.nidn}`);
  };

  // Institutions & Rooms
  const addInstitution = (instData: Omit<Institution, 'id'>) => {
    const newInst: Institution = { ...instData, id: generateUniqueId('inst') };
    setInstitutions(prev => [newInst, ...prev]);
    showToast('Institusi Ditambahkan', `${instData.name} berhasil didaftarkan.`, 'success');
  };

  const updateInstitution = (id: string, data: Partial<Institution>) => {
    setInstitutions(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    showToast('Institusi Diperbarui', 'Data institusi berhasil disimpan.', 'success');
  };

  const deleteInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
    showToast('Institusi Dihapus', 'Data institusi dihapus.', 'info');
  };

  // Study Programs (Prodi)
  const addStudyProgram = (progData: Omit<StudyProgram, 'id'>) => {
    const newProg: StudyProgram = { ...progData, id: generateUniqueId('prog') };
    setStudyPrograms(prev => [newProg, ...prev]);
    showToast('Program Studi Ditambahkan', `${progData.name} berhasil didaftarkan.`, 'success');
    logActivity('TAMBAH_PRODI', progData.name, `Jenjang: ${progData.degree}`);
  };

  const updateStudyProgram = (id: string, data: Partial<StudyProgram>) => {
    setStudyPrograms(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    showToast('Program Studi Diperbarui', 'Data program studi berhasil disimpan.', 'success');
    logActivity('UPDATE_PRODI', data.name || id, 'Data program studi diperbarui');
  };

  const deleteStudyProgram = (id: string) => {
    const target = studyPrograms.find(p => p.id === id);
    setStudyPrograms(prev => prev.filter(p => p.id !== id));
    showToast('Program Studi Dihapus', `Program studi ${target?.name || id} telah dihapus.`, 'info');
    logActivity('HAPUS_PRODI', target?.name || id, 'Program studi dihapus');
  };

  const addRoom = (roomData: Omit<PracticeRoom, 'id'>) => {
    const newRoom: PracticeRoom = { ...roomData, id: generateUniqueId('room') };
    setRooms(prev => [newRoom, ...prev]);
    showToast('Ruangan Ditambahkan', `${roomData.name} berhasil disimpan.`, 'success');
  };

  const updateRoom = (id: string, data: Partial<PracticeRoom>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    showToast('Ruangan Diperbarui', 'Data ruangan berhasil disimpan.', 'success');
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    showToast('Ruangan Dihapus', 'Data ruangan dihapus.', 'info');
  };

  // Schedules
  const addSchedule = (scheduleData: Omit<PracticeSchedule, 'id'>) => {
    const newSchedule: PracticeSchedule = { ...scheduleData, id: generateUniqueId('sch') };
    setSchedules(prev => [newSchedule, ...prev]);
    showToast('Jadwal Ditambahkan', `Jadwal praktik untuk ${scheduleData.studentName} telah dibuat.`, 'success');
    logActivity('TAMBAH_JADWAL', scheduleData.studentName, `Ruangan: ${scheduleData.roomName}, Shift: ${scheduleData.shift}`);
  };

  const updateSchedule = (id: string, data: Partial<PracticeSchedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast('Jadwal Diperbarui', 'Jadwal praktik berhasil disimpan.', 'success');
  };

  const updateScheduleStatus = (id: string, status: ScheduleStatus) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    showToast('Status Jadwal Berubah', `Status jadwal diubah menjadi ${status}.`, 'info');
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    showToast('Jadwal Dihapus', 'Jadwal praktik telah dihapus.', 'info');
  };

  // Documents
  const uploadDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt' | 'reviewStatus'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: generateUniqueId('doc'),
      uploadedAt: new Date().toISOString().split('T')[0],
      reviewStatus: 'Menunggu Pemeriksaan'
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast('Dokumen Diunggah', `"${docData.title}" berhasil diunggah untuk verifikasi.`, 'success');
    logActivity('UPLOAD_DOKUMEN', docData.title, `Tipe: ${docData.type}, Pengunggah: ${docData.studentName}`);
  };

  const reviewDocument = (id: string, status: ReviewStatus, feedback?: string, grade?: number) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          reviewStatus: status,
          feedbackNotes: feedback || d.feedbackNotes,
          score: grade !== undefined ? grade : d.score,
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toLocaleString('id-ID')
        };
      }
      return d;
    }));
    showToast('Review Selesai', `Status dokumen diubah menjadi: ${status}`, status === 'Diterima' ? 'success' : 'warning');
    logActivity('REVIEW_DOKUMEN', id, `Status review: ${status}, Nilai: ${grade ?? '-'}`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Dokumen Dihapus', 'Dokumen telah dihapus.', 'info');
  };

  // Library
  const addLibraryItem = (itemData: Omit<LibraryItem, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const newItem: LibraryItem = {
      ...itemData,
      id: generateUniqueId('lib'),
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };
    setLibraryItems(prev => [newItem, ...prev]);
    showToast('Materi Ditambahkan', `"${itemData.title}" berhasil dipublikasikan ke perpustakaan.`, 'success');
  };

  const updateLibraryItem = (id: string, data: Partial<LibraryItem>) => {
    setLibraryItems(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    showToast('Materi Diperbarui', 'Materi perpustakaan berhasil diperbarui.', 'success');
  };

  const deleteLibraryItem = (id: string) => {
    setLibraryItems(prev => prev.filter(l => l.id !== id));
    showToast('Materi Dihapus', 'Materi telah dihapus.', 'info');
  };

  const incrementDownload = (id: string) => {
    setLibraryItems(prev => prev.map(l => l.id === id ? { ...l, downloadCount: l.downloadCount + 1 } : l));
  };

  // Tests
  const addTest = (testData: Omit<TestItem, 'id' | 'createdAt'>) => {
    const newTest: TestItem = {
      ...testData,
      id: generateUniqueId('test'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTests(prev => [newTest, ...prev]);
    showToast('Ujian Dibuat', `"${testData.title}" berhasil dibuat.`, 'success');
  };

  const updateTest = (id: string, data: Partial<TestItem>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Ujian Diperbarui', 'Data ujian telah disimpan.', 'success');
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
    showToast('Ujian Dihapus', 'Ujian telah dihapus.', 'info');
  };

  const toggleTestActive = (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  const submitTestAttempt = (attemptData: Omit<TestAttempt, 'id' | 'completedAt'>): TestAttempt => {
    const newAttempt: TestAttempt = {
      ...attemptData,
      id: generateUniqueId('att'),
      completedAt: new Date().toLocaleString('id-ID')
    };
    setTestAttempts(prev => [newAttempt, ...prev]);
    showToast(
      newAttempt.passed ? 'Selamat! Ujian Lulus' : 'Ujian Selesai',
      `Skor Anda: ${newAttempt.score}/100 (${newAttempt.totalCorrect}/${newAttempt.totalQuestions} Benar)`,
      newAttempt.passed ? 'success' : 'warning'
    );
    logActivity('UJIAN_SELESAI', attemptData.testTitle, `Skor: ${attemptData.score} (Lulus: ${attemptData.passed ? 'Ya' : 'Tidak'})`);
    return newAttempt;
  };

  // Evaluations
  const submitEvaluation = (evalData: Omit<LearningEvaluation, 'id' | 'submittedAt'>) => {
    const newEval: LearningEvaluation = {
      ...evalData,
      id: generateUniqueId('eval'),
      submittedAt: new Date().toLocaleString('id-ID')
    };
    setEvaluations(prev => [newEval, ...prev]);
    showToast('Evaluasi Terkirim', 'Terima kasih atas penilaian dan masukan Anda untuk peningkatan mutu Instaldik RSKH.', 'success');
    logActivity('SUBMIT_EVALUASI', `Stase ${evalData.roomName}`, `Tingkat kepuasan: ${evalData.satisfactionLevel}`);
  };

  // Chat
  const sendMessage = (recipientId: string, text: string, attachment?: ChatMessage['attachment']) => {
    const newMsg: ChatMessage = {
      id: generateUniqueId('msg'),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      recipientId,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      attachment
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const markChatAsRead = (senderId: string) => {
    setChatMessages(prev => prev.map(m => {
      if (m.senderId === senderId && m.recipientId === currentUser.id) {
        return { ...m, isRead: true };
      }
      return m;
    }));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Notifikasi Ditandai', 'Semua notifikasi telah dibaca.', 'info');
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: generateUniqueId('notif'),
      timestamp: new Date().toLocaleString('id-ID'),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resetAllDataToDefault = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    setStudents(INITIAL_STUDENTS);
    setClinicalInstructors(INITIAL_CLINICAL_INSTRUCTORS);
    setLecturers(INITIAL_LECTURERS);
    setInstitutions(INITIAL_INSTITUTIONS);
    setStudyPrograms(INITIAL_STUDY_PROGRAMS);
    setRooms(INITIAL_ROOMS);
    setSchedules(INITIAL_SCHEDULES);
    setDocuments(INITIAL_DOCUMENTS);
    setLibraryItems(INITIAL_LIBRARY_ITEMS);
    setTests(INITIAL_TESTS);
    setTestAttempts(INITIAL_TEST_ATTEMPTS);
    setEvaluations(INITIAL_EVALUATIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setVisitors(INITIAL_VISITORS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    showToast('Reset Selesai', 'Data demo awal e-Instaldik RSKH berhasil dipulihkan.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        isLoggedIn,
        currentView,
        setCurrentView,
        login,
        logout,
        switchRole,
        allUsers,
        students,
        clinicalInstructors,
        lecturers,
        institutions,
        studyPrograms,
        rooms,
        schedules,
        documents,
        libraryItems,
        tests,
        testAttempts,
        evaluations,
        chatMessages,
        notifications,
        activityLogs,
        visitors,
        attendanceRecords,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentAccountStatus,
        resetStudentPassword,
        generateStudentDigitalCard,
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
        addRoom,
        updateRoom,
        deleteRoom,
        addSchedule,
        updateSchedule,
        updateScheduleStatus,
        deleteSchedule,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        checkInStudentViaQR,
        checkOutStudentViaQR,
        addVisitor,
        updateVisitor,
        checkoutVisitor,
        updateUserProfile,
        uploadDocument,
        reviewDocument,
        deleteDocument,
        addLibraryItem,
        updateLibraryItem,
        deleteLibraryItem,
        incrementDownload,
        addTest,
        updateTest,
        deleteTest,
        toggleTestActive,
        submitTestAttempt,
        submitEvaluation,
        sendMessage,
        markChatAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        logActivity,
        toasts,
        showToast,
        removeToast,
        pdfViewer,
        openPdfViewer,
        closePdfViewer,
        digitalCardModal,
        openDigitalCard,
        closeDigitalCard,
        scannerModal,
        openScanner,
        closeScanner,
        batchPrintModal,
        openBatchPrint,
        closeBatchPrint,
        authModal,
        openAuthModal,
        closeAuthModal,
        registerUser,
        authenticateUser,
        resetAllDataToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
