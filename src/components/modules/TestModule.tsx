import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TestItem, Question, TestAttempt, QuestionOption } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Printer,
  Copy,
  HelpCircle,
  BarChart3,
  Bookmark,
  Send,
  SlidersHorizontal,
  GraduationCap,
  ShieldCheck,
  FileText,
  Lock,
  Unlock,
  Layers,
  Flame,
  FileUp,
  Image as ImageIcon,
  CheckSquare,
  ListPlus,
  FolderSync
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TestModule: React.FC<{ forcedType?: 'pre-test' | 'post-test' }> = ({ forcedType }) => {
  const {
    tests,
    testAttempts,
    currentRole,
    currentUser,
    students,
    rooms,
    addTest,
    updateTest,
    deleteTest,
    toggleTestActive,
    submitTestAttempt,
    showToast,
    logActivity
  } = useApp();

  const isTeacherOrAdmin = ['admin', 'ci', 'dosen'].includes(currentRole);

  // Active navigation view tab
  const [activeTab, setActiveTab] = useState<'pre-test' | 'post-test' | 'bank-soal' | 'gradebook'>(
    forcedType || 'pre-test'
  );

  // ================= EXAM TAKING STATES =================
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<TestAttempt | null>(null);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState<boolean>(false);

  // ================= MANAGEMENT / INPUT SOAL STATES =================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);
  const [managingQuestionsTest, setManagingQuestionsTest] = useState<TestItem | null>(null);
  
  // Question editor modal
  const [isQuestionEditorModalOpen, setIsQuestionEditorModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    targetTestId: string;
    question: Question;
    index: number;
  } | null>(null);

  // Question Form Fields
  const [targetTestIdForQuestion, setTargetTestIdForQuestion] = useState<string>('');
  const [qType, setQType] = useState<'Pilihan Ganda' | 'Benar/Salah' | 'Studi Kasus / Vignette'>('Pilihan Ganda');
  const [qCategory, setQCategory] = useState<string>('Keselamatan Pasien & PPI');
  const [qCaseVignette, setQCaseVignette] = useState<string>('');
  const [qText, setQText] = useState<string>('');
  const [qImageUrl, setQImageUrl] = useState<string>('');
  const [qOptions, setQOptions] = useState<{ id: string; text: string }[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]);
  const [qCorrectAnswer, setQCorrectAnswer] = useState<string>('A');
  const [qExplanation, setQExplanation] = useState<string>('');
  const [qScore, setQScore] = useState<number>(25);
  const [syncToPostTestPair, setSyncToPostTestPair] = useState<boolean>(false);

  // Bulk Paste / Quick Import Modal State
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [bulkTargetTestId, setBulkTargetTestId] = useState<string>('');
  const [bulkRawText, setBulkRawText] = useState<string>('');

  // Create / Edit Test Package Form State
  const [testFormTitle, setTestFormTitle] = useState('');
  const [testFormType, setTestFormType] = useState<'Pre-Test' | 'Post-Test'>('Pre-Test');
  const [testFormCategory, setTestFormCategory] = useState('Keselamatan Pasien & PPI');
  const [testFormDesc, setTestFormDesc] = useState('');
  const [testFormDuration, setTestFormDuration] = useState<number>(30);
  const [testFormPassingScore, setTestFormPassingScore] = useState<number>(75);
  const [testFormIsActive, setTestFormIsActive] = useState<boolean>(true);

  // ================= GRADEBOOK & DETAIL MODAL STATES =================
  const [gradebookFilterType, setGradebookFilterType] = useState<'ALL' | 'Pre-Test' | 'Post-Test'>('ALL');
  const [gradebookSearch, setGradebookSearch] = useState('');
  const [viewingAttempt, setViewingAttempt] = useState<TestAttempt | null>(null);

  // Bank Soal Filter
  const [bankTypeFilter, setBankTypeFilter] = useState<'ALL' | 'Pre-Test' | 'Post-Test'>('ALL');
  const [bankCategoryFilter, setBankCategoryFilter] = useState<string>('ALL');
  const [bankSearch, setBankSearch] = useState<string>('');

  // Categories list
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    tests.forEach(t => set.add(t.category));
    return Array.from(set);
  }, [tests]);

  // Available tests for card list view
  const availableTests = useMemo(() => {
    return tests.filter(t => {
      if (activeTab === 'pre-test' && t.type !== 'Pre-Test') return false;
      if (activeTab === 'post-test' && t.type !== 'Post-Test') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchCategory = t.category.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchDesc) return false;
      }
      if (selectedCategoryFilter !== 'ALL' && t.category !== selectedCategoryFilter) return false;
      return true;
    });
  }, [tests, activeTab, searchQuery, selectedCategoryFilter]);

  // All questions aggregated for Bank Soal view
  const allBankQuestions = useMemo(() => {
    const list: {
      testId: string;
      testTitle: string;
      testType: 'Pre-Test' | 'Post-Test';
      testCategory: string;
      question: Question;
      questionIndex: number;
    }[] = [];

    tests.forEach(t => {
      t.questions.forEach((q, idx) => {
        list.push({
          testId: t.id,
          testTitle: t.title,
          testType: t.type,
          testCategory: t.category,
          question: q,
          questionIndex: idx
        });
      });
    });

    return list.filter(item => {
      if (bankTypeFilter !== 'ALL' && item.testType !== bankTypeFilter) return false;
      if (bankCategoryFilter !== 'ALL' && item.testCategory !== bankCategoryFilter) return false;
      if (bankSearch.trim()) {
        const q = bankSearch.toLowerCase();
        const matchQ = item.question.question.toLowerCase().includes(q);
        const matchVignette = (item.question.caseVignette || '').toLowerCase().includes(q);
        const matchExp = (item.question.explanation || '').toLowerCase().includes(q);
        const matchTitle = item.testTitle.toLowerCase().includes(q);
        if (!matchQ && !matchVignette && !matchExp && !matchTitle) return false;
      }
      return true;
    });
  }, [tests, bankTypeFilter, bankCategoryFilter, bankSearch]);

  // Filtered Gradebook attempts
  const filteredAttempts = useMemo(() => {
    return testAttempts.filter(att => {
      if (gradebookFilterType !== 'ALL' && att.testType !== gradebookFilterType) return false;
      if (gradebookSearch.trim()) {
        const q = gradebookSearch.toLowerCase();
        const matchName = att.studentName.toLowerCase().includes(q);
        const matchTitle = att.testTitle.toLowerCase().includes(q);
        const matchInst = att.institutionName.toLowerCase().includes(q);
        if (!matchName && !matchTitle && !matchInst) return false;
      }
      if (currentRole === 'mahasiswa' && att.studentId !== currentUser.id && !att.studentName.toLowerCase().includes(currentUser.name.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [testAttempts, gradebookFilterType, gradebookSearch, currentRole, currentUser]);

  // Timer effect during active test
  useEffect(() => {
    let timer: any;
    if (activeTest && !isTestFinished && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTest, isTestFinished, timeRemaining]);

  // Start a test
  const startTest = (test: TestItem) => {
    if (!test.questions || test.questions.length === 0) {
      showToast('Soal Belum Tersedia', 'Paket ujian ini belum memiliki butir soal. Silakan hubungi instruktur/admin.', 'warning');
      return;
    }
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeRemaining(test.durationMinutes * 60);
    setIsTestFinished(false);
    setLastSubmission(null);
    setShowConfirmSubmitModal(false);
    logActivity('MULAI_UJIAN', test.title, `Mulai mengerjakan ${test.type} (${test.questions.length} Soal)`);
  };

  const handleSelectAnswer = (questionId: string, answerValue: string) => {
    if (isTestFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleFinishTest = () => {
    if (!activeTest) return;
    setShowConfirmSubmitModal(false);

    let correctCount = 0;
    const recordedAnswers = activeTest.questions.map(q => {
      const selected = selectedAnswers[q.id] || '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount += 1;
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect
      };
    });

    const calculatedScore = Math.round((correctCount / activeTest.questions.length) * 100);
    const isPassed = calculatedScore >= activeTest.passingScore;
    const timeSpent = (activeTest.durationMinutes * 60) - timeRemaining;

    const submissionResult = submitTestAttempt({
      testId: activeTest.id,
      testTitle: activeTest.title,
      testType: activeTest.type,
      studentId: currentUser.id,
      studentName: currentUser.name,
      institutionName: currentUser.institution || 'Universitas Tanjungpura',
      score: calculatedScore,
      passed: isPassed,
      totalCorrect: correctCount,
      totalQuestions: activeTest.questions.length,
      timeSpentSeconds: timeSpent > 0 ? timeSpent : 60,
      answers: recordedAnswers
    });

    setLastSubmission(submissionResult);
    setIsTestFinished(true);

    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      showToast('Ujian Selesai - LULUS!', `Selamat, Anda LULUS dengan skor ${calculatedScore}/100!`, 'success');
    } else {
      showToast('Ujian Selesai', `Skor Anda: ${calculatedScore}/100. Standar kelulusan adalah ${activeTest.passingScore}.`, 'warning');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open Create / Edit Test Modal
  const openCreateTestModal = (presetType?: 'Pre-Test' | 'Post-Test') => {
    setEditingTest(null);
    setTestFormTitle('');
    setTestFormType(presetType || (activeTab === 'post-test' ? 'Post-Test' : 'Pre-Test'));
    setTestFormCategory('Keselamatan Pasien & PPI');
    setTestFormDesc('');
    setTestFormDuration(30);
    setTestFormPassingScore(75);
    setTestFormIsActive(true);
    setIsCreateTestModalOpen(true);
  };

  const openEditTestModal = (test: TestItem) => {
    setEditingTest(test);
    setTestFormTitle(test.title);
    setTestFormType(test.type);
    setTestFormCategory(test.category);
    setTestFormDesc(test.description);
    setTestFormDuration(test.durationMinutes);
    setTestFormPassingScore(test.passingScore);
    setTestFormIsActive(test.isActive);
    setIsCreateTestModalOpen(true);
  };

  const handleSaveTestForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFormTitle.trim()) {
      showToast('Peringatan', 'Judul paket ujian wajib diisi.', 'warning');
      return;
    }

    if (editingTest) {
      updateTest(editingTest.id, {
        title: testFormTitle,
        type: testFormType,
        category: testFormCategory,
        description: testFormDesc,
        durationMinutes: Number(testFormDuration) || 30,
        passingScore: Number(testFormPassingScore) || 75,
        isActive: testFormIsActive
      });
      showToast('Paket Ujian Diperbarui', `Paket "${testFormTitle}" berhasil disimpan.`, 'success');
    } else {
      addTest({
        title: testFormTitle,
        type: testFormType,
        category: testFormCategory,
        description: testFormDesc || `Paket ujian evaluasi standar ${testFormType} stase klinik RS TK II Kartika Husada.`,
        durationMinutes: Number(testFormDuration) || 30,
        passingScore: Number(testFormPassingScore) || 75,
        isActive: testFormIsActive,
        totalQuestions: 0,
        questions: [],
        authorName: currentUser.name || 'Instruktur Instaldik RSKH'
      });
      showToast('Paket Ujian Berhasil Dibuat', `Paket "${testFormTitle}" telah ditambahkan. Anda sekarang dapat mengisi butir soal.`, 'success');
    }

    setIsCreateTestModalOpen(false);
  };

  // ================= QUESTION INPUT & CRUD =================
  const openAddQuestionModal = (defaultTestId?: string) => {
    setEditingQuestion(null);
    const chosenTestId = defaultTestId || managingQuestionsTest?.id || (tests.length > 0 ? tests[0].id : '');
    setTargetTestIdForQuestion(chosenTestId);
    
    // Auto populate category from chosen test
    const foundTest = tests.find(t => t.id === chosenTestId);
    setQCategory(foundTest?.category || 'Keselamatan Pasien & PPI');
    setQType('Pilihan Ganda');
    setQCaseVignette('');
    setQText('');
    setQImageUrl('');
    setQOptions([
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ]);
    setQCorrectAnswer('A');
    setQExplanation('');
    setQScore(25);
    setSyncToPostTestPair(false);
    setIsQuestionEditorModalOpen(true);
  };

  const openEditQuestionModal = (targetTestId: string, question: Question, index: number) => {
    setEditingQuestion({ targetTestId, question, index });
    setTargetTestIdForQuestion(targetTestId);
    setQType(question.type || 'Pilihan Ganda');
    setQCategory(question.category || 'Keselamatan Pasien & PPI');
    setQCaseVignette(question.caseVignette || '');
    setQText(question.question);
    setQImageUrl(question.imageUrl || '');
    
    if (question.type === 'Benar/Salah') {
      setQOptions([
        { id: 'Benar', text: 'Benar' },
        { id: 'Salah', text: 'Salah' }
      ]);
    } else if (question.options && question.options.length > 0) {
      setQOptions(JSON.parse(JSON.stringify(question.options)));
    } else {
      setQOptions([
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ]);
    }
    
    setQCorrectAnswer(question.correctAnswer);
    setQExplanation(question.explanation || '');
    setQScore(question.score || 25);
    setSyncToPostTestPair(false);
    setIsQuestionEditorModalOpen(true);
  };

  const handleAddOptionE = () => {
    if (qOptions.length < 5) {
      setQOptions(prev => [...prev, { id: 'E', text: '' }]);
    }
  };

  const handleRemoveOptionE = () => {
    if (qOptions.length === 5) {
      setQOptions(prev => prev.slice(0, 4));
      if (qCorrectAnswer === 'E') {
        setQCorrectAnswer('A');
      }
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTestIdForQuestion) {
      showToast('Peringatan', 'Silakan pilih target paket ujian terlebih dahulu.', 'warning');
      return;
    }

    if (!qText.trim()) {
      showToast('Peringatan', 'Teks pertanyaan wajib diisi.', 'warning');
      return;
    }

    const targetTest = tests.find(t => t.id === targetTestIdForQuestion);
    if (!targetTest) {
      showToast('Error', 'Paket ujian target tidak ditemukan.', 'error');
      return;
    }

    const newQuestionObj: Question = {
      id: editingQuestion ? editingQuestion.question.id : `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: qType,
      category: qCategory,
      caseVignette: qCaseVignette.trim() || undefined,
      imageUrl: qImageUrl.trim() || undefined,
      question: qText.trim(),
      options: qType === 'Benar/Salah' ? undefined : qOptions.map(opt => ({ id: opt.id, text: opt.text.trim() })),
      correctAnswer: qCorrectAnswer,
      explanation: qExplanation.trim() || 'Kunci jawaban mengacu pada panduan SPO RS TK II Kartika Husada dan pedoman Kemenkes RI.',
      score: Number(qScore) || 25
    };

    let updatedQuestions = [...targetTest.questions];
    if (editingQuestion) {
      updatedQuestions[editingQuestion.index] = newQuestionObj;
      showToast('Butir Soal Diperbarui', `Soal nomor #${editingQuestion.index + 1} berhasil disimpan.`, 'success');
    } else {
      updatedQuestions.push(newQuestionObj);
      showToast('Butir Soal Ditambahkan', `Soal baru berhasil ditambahkan ke "${targetTest.title}".`, 'success');
    }

    updateTest(targetTest.id, {
      questions: updatedQuestions,
      totalQuestions: updatedQuestions.length
    });

    // Auto synchronize to matching Post-Test or Pre-Test if checked
    if (syncToPostTestPair && !editingQuestion) {
      const isPre = targetTest.type === 'Pre-Test';
      const counterpartType = isPre ? 'Post-Test' : 'Pre-Test';
      const matchingCounterpart = tests.find(t => t.type === counterpartType && t.category === targetTest.category);
      
      if (matchingCounterpart) {
        const counterpartQuestions = [...matchingCounterpart.questions, {
          ...newQuestionObj,
          id: `q_sync_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
        }];
        updateTest(matchingCounterpart.id, {
          questions: counterpartQuestions,
          totalQuestions: counterpartQuestions.length
        });
        showToast('Sinkronisasi Berhasil', `Butir soal juga otomatis disalin ke ${matchingCounterpart.title}.`, 'info');
      }
    }

    // Update managingQuestionsTest state if currently inside that view
    if (managingQuestionsTest && managingQuestionsTest.id === targetTest.id) {
      setManagingQuestionsTest({
        ...managingQuestionsTest,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length
      });
    }

    setIsQuestionEditorModalOpen(false);
  };

  const handleDeleteQuestion = (targetTestId: string, questionIndex: number) => {
    const targetTest = tests.find(t => t.id === targetTestId);
    if (!targetTest) return;

    if (!confirm(`Hapus butir soal #${questionIndex + 1}?`)) return;

    const updated = targetTest.questions.filter((_, idx) => idx !== questionIndex);
    updateTest(targetTest.id, {
      questions: updated,
      totalQuestions: updated.length
    });

    if (managingQuestionsTest && managingQuestionsTest.id === targetTest.id) {
      setManagingQuestionsTest({
        ...managingQuestionsTest,
        questions: updated,
        totalQuestions: updated.length
      });
    }

    showToast('Soal Dihapus', 'Butir soal telah dihapus dari paket ujian.', 'info');
  };

  const handleDuplicateQuestion = (targetTestId: string, question: Question) => {
    const targetTest = tests.find(t => t.id === targetTestId);
    if (!targetTest) return;

    const duplicatedQ: Question = {
      ...JSON.parse(JSON.stringify(question)),
      id: `q_dup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };

    const updated = [...targetTest.questions, duplicatedQ];
    updateTest(targetTest.id, {
      questions: updated,
      totalQuestions: updated.length
    });

    if (managingQuestionsTest && managingQuestionsTest.id === targetTest.id) {
      setManagingQuestionsTest({
        ...managingQuestionsTest,
        questions: updated,
        totalQuestions: updated.length
      });
    }

    showToast('Soal Diduplikasi', 'Butir soal berhasil diduplikasi.', 'success');
  };

  const handleCrossDuplicateToCounterpart = (question: Question, currentType: 'Pre-Test' | 'Post-Test', category: string) => {
    const targetType = currentType === 'Pre-Test' ? 'Post-Test' : 'Pre-Test';
    const targetTest = tests.find(t => t.type === targetType && t.category === category) || tests.find(t => t.type === targetType);

    if (!targetTest) {
      showToast('Gagal Duplikasi', `Belum ada paket ${targetType} yang tersedia. Silakan buat paket terlebih dahulu.`, 'warning');
      return;
    }

    const clonedQ: Question = {
      ...JSON.parse(JSON.stringify(question)),
      id: `q_cross_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };

    const updated = [...targetTest.questions, clonedQ];
    updateTest(targetTest.id, {
      questions: updated,
      totalQuestions: updated.length
    });

    showToast('Berhasil Disalin', `Soal berhasil disalin ke paket "${targetTest.title}".`, 'success');
  };

  // ================= BULK TEXT IMPORT PARSER =================
  const handleOpenBulkImport = (defaultTestId?: string) => {
    const chosenTestId = defaultTestId || managingQuestionsTest?.id || (tests.length > 0 ? tests[0].id : '');
    setBulkTargetTestId(chosenTestId);
    setBulkRawText(`[Soal 1]
Pertanyaan: Sesuai SKP 1 (Sasaran Keselamatan Pasien), verifikasi identitas pasien minimal menggunakan 2 parameter, yaitu:
A. Nomor kamar dan nama dokter DPJP
B. Nama lengkap pasien dan tanggal lahir / nomor rekam medis
C. Diagnosis penyakit dan nomor tempat tidur
D. Keluhan pasien dan nama perawat
KUNCI: B
PEMBAHASAN: Verifikasi identitas mutlak menggunakan nama lengkap dan tanggal lahir / nomor RM, dilarang menggunakan nomor kamar.
BOBOT: 25

[Soal 2]
Pertanyaan: Prosedur hand hygiene cuci tangan menggunakan cairan berbasis alkohol (Handrub) memerlukan durasi waktu efektif:
A. 10-15 detik
B. 20-30 detik
C. 40-60 detik
D. 2 menit penuh
KUNCI: B
PEMBAHASAN: Standar WHO & PPI Kemenkes: Handrub 20-30 detik, cuci tangan air mengalir + sabun 40-60 detik.
BOBOT: 25`);
    setIsBulkImportModalOpen(true);
  };

  const handleExecuteBulkImport = () => {
    if (!bulkTargetTestId) {
      showToast('Peringatan', 'Pilih paket ujian target terlebih dahulu.', 'warning');
      return;
    }

    const targetTest = tests.find(t => t.id === bulkTargetTestId);
    if (!targetTest) return;

    if (!bulkRawText.trim()) {
      showToast('Peringatan', 'Teks soal tidak boleh kosong.', 'warning');
      return;
    }

    // Simple robust block parser
    const blocks = bulkRawText.split(/\[Soal\s*\d*\]/i).map(b => b.trim()).filter(Boolean);
    const parsedQuestions: Question[] = [];

    blocks.forEach((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      let qTextParsed = '';
      let optA = '', optB = '', optC = '', optD = '', optE = '';
      let key = 'A';
      let explanation = '';
      let score = 25;

      lines.forEach(line => {
        if (/^Pertanyaan\s*:\s*/i.test(line)) {
          qTextParsed = line.replace(/^Pertanyaan\s*:\s*/i, '').trim();
        } else if (/^A[\.\)]\s*/i.test(line)) {
          optA = line.replace(/^A[\.\)]\s*/i, '').trim();
        } else if (/^B[\.\)]\s*/i.test(line)) {
          optB = line.replace(/^B[\.\)]\s*/i, '').trim();
        } else if (/^C[\.\)]\s*/i.test(line)) {
          optC = line.replace(/^C[\.\)]\s*/i, '').trim();
        } else if (/^D[\.\)]\s*/i.test(line)) {
          optD = line.replace(/^D[\.\)]\s*/i, '').trim();
        } else if (/^E[\.\)]\s*/i.test(line)) {
          optE = line.replace(/^E[\.\)]\s*/i, '').trim();
        } else if (/^KUNCI\s*:\s*/i.test(line)) {
          key = line.replace(/^KUNCI\s*:\s*/i, '').trim().toUpperCase();
        } else if (/^PEMBAHASAN\s*:\s*/i.test(line)) {
          explanation = line.replace(/^PEMBAHASAN\s*:\s*/i, '').trim();
        } else if (/^BOBOT\s*:\s*/i.test(line)) {
          score = Number(line.replace(/^BOBOT\s*:\s*/i, '').trim()) || 25;
        } else if (!qTextParsed) {
          // If first line doesn't have prefix
          qTextParsed = line;
        }
      });

      if (qTextParsed && optA && optB) {
        const optionsList = [
          { id: 'A', text: optA },
          { id: 'B', text: optB },
          { id: 'C', text: optC || 'Opsi C' },
          { id: 'D', text: optD || 'Opsi D' }
        ];
        if (optE) {
          optionsList.push({ id: 'E', text: optE });
        }

        parsedQuestions.push({
          id: `q_bulk_${Date.now()}_${idx}`,
          type: 'Pilihan Ganda',
          category: targetTest.category,
          question: qTextParsed,
          options: optionsList,
          correctAnswer: ['A', 'B', 'C', 'D', 'E'].includes(key) ? key : 'A',
          explanation: explanation || 'Sesuai standar operasional prosedur rumah sakit dan pedoman akreditasi STARKES.',
          score: score
        });
      }
    });

    if (parsedQuestions.length === 0) {
      showToast('Gagal Parsing', 'Format teks tidak sesuai. Pastikan ada baris "Pertanyaan:", "A.", "B.", "KUNCI:".', 'error');
      return;
    }

    const updated = [...targetTest.questions, ...parsedQuestions];
    updateTest(targetTest.id, {
      questions: updated,
      totalQuestions: updated.length
    });

    if (managingQuestionsTest && managingQuestionsTest.id === targetTest.id) {
      setManagingQuestionsTest({
        ...managingQuestionsTest,
        questions: updated,
        totalQuestions: updated.length
      });
    }

    showToast('Import Massal Berhasil', `${parsedQuestions.length} butir soal telah berhasil dimasukkan ke "${targetTest.title}".`, 'success');
    setIsBulkImportModalOpen(false);
  };

  // ================= RENDER: ACTIVE EXAM MODE =================
  if (activeTest) {
    const currentQ = activeTest.questions[currentQuestionIndex];
    const totalQ = activeTest.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    const isAnsweredCurrent = selectedAnswers[currentQ?.id] !== undefined;
    const isFlaggedCurrent = !!flaggedQuestions[currentQ?.id];

    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Test Header Navbar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B192C] to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeTest.type}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeTest.category}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {activeTest.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isTestFinished && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl">
                <Clock className={`w-4 h-4 ${timeRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
                <span className={`font-mono text-xs sm:text-sm font-bold ${timeRemaining < 300 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {formatTimer(timeRemaining)}
                </span>
              </div>
            )}

            <button
              onClick={() => setActiveTest(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Keluar dari Ujian"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Finished / Result Screen */}
        {isTestFinished && lastSubmission && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                lastSubmission.passed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {lastSubmission.passed ? '✓ LULUS KOMPETENSI' : '✕ PERLU REMEDIAL / PEMBELAJARAN ULANG'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Skor Akhir: {lastSubmission.score} / 100
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Anda berhasil menjawab benar <span className="font-bold text-slate-800">{lastSubmission.totalCorrect}</span> dari {lastSubmission.totalQuestions} butir soal. Batas kelulusan adalah {activeTest.passingScore}.
              </p>
            </div>

            {/* Answer Breakdown & Rasional Review */}
            <div className="space-y-4 text-left max-w-3xl mx-auto pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Lembar Pembahasan & Rasional Ilmiah:
              </h3>

              <div className="space-y-3">
                {activeTest.questions.map((q, idx) => {
                  const studentAns = selectedAnswers[q.id] || '';
                  const isCorrect = studentAns === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border ${
                        isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-800">
                            {q.question}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Benar (+ ' + (q.score || 25) + ')' : 'Salah (0)'}
                        </span>
                      </div>

                      {q.caseVignette && (
                        <div className="mt-2 p-2.5 bg-white/80 rounded-xl text-xs text-slate-600 border border-slate-200/60 font-sans italic">
                          <span className="font-bold not-italic text-slate-700">Skenario:</span> {q.caseVignette}
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                        <div>
                          Jawaban Anda: <span className="font-bold text-slate-900">{studentAns || '(Kosong)'}</span>
                        </div>
                        <div>
                          Kunci Benar: <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                        </div>
                      </div>

                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                        <span className="font-bold text-slate-900">Pembahasan & Rasional:</span> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => startTest(activeTest)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Ujian</span>
              </button>
              <button
                onClick={() => setActiveTest(null)}
                className="px-6 py-2.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs transition shadow-md"
              >
                Kembali ke Daftar Ujian
              </button>
            </div>
          </div>
        )}

        {/* Active Question Taking View */}
        {!isTestFinished && currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Question Box */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Question Info Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-amber-400 font-black text-xs">
                      Soal #{currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      dari {totalQ} Soal
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {currentQ.type}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlagQuestion(currentQ.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isFlaggedCurrent
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFlaggedCurrent ? 'fill-current text-amber-600' : ''}`} />
                    <span>{isFlaggedCurrent ? 'Ditandai Ragu' : 'Ragu-Ragu'}</span>
                  </button>
                </div>

                {/* Case Vignette if available */}
                {currentQ.caseVignette && (
                  <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
                    <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      Skenario Kasus Klinis (Vignette):
                    </div>
                    <p className="italic text-slate-700">
                      {currentQ.caseVignette}
                    </p>
                  </div>
                )}

                {/* Image diagram if available */}
                {currentQ.imageUrl && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <img
                      src={currentQ.imageUrl}
                      alt="Ilustrasi Soal"
                      referrerPolicy="no-referrer"
                      className="max-h-60 mx-auto rounded-xl object-contain shadow-sm"
                    />
                  </div>
                )}

                {/* Question Statement */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* Choices (Multiple Choice) */}
                {currentQ.type !== 'Benar/Salah' && currentQ.options && (
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedAnswers[currentQ.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectAnswer(currentQ.id, opt.id)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-slate-950 font-bold ring-2 ring-amber-500/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Choices (True / False) */}
                {currentQ.type === 'Benar/Salah' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {['Benar', 'Salah'].map(val => {
                      const isSelected = selectedAnswers[currentQ.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleSelectAnswer(currentQ.id, val)}
                          className={`p-4 rounded-2xl border text-center font-bold text-sm transition ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {currentQuestionIndex < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(i => Math.min(totalQ - 1, i + 1))}
                    className="px-5 py-2.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 transition shadow-md"
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmSubmitModal(true)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Selesai & Kumpulkan Ujian</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Question Palette Matrix */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Navigasi Nomor Soal
                </h4>
                <span className="text-[11px] font-bold text-slate-600">
                  {answeredCount} / {totalQ} Selesai
                </span>
              </div>

              {/* Matrix Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                {activeTest.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = !!flaggedQuestions[q.id];
                  const isCurrent = currentQuestionIndex === idx;

                  let btnBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isCurrent) {
                    btnBg = 'ring-2 ring-amber-500 bg-[#0B192C] text-amber-400 font-black shadow';
                  } else if (isFlagged) {
                    btnBg = 'bg-amber-400 text-slate-950 font-bold shadow';
                  } else if (isAnswered) {
                    btnBg = 'bg-emerald-600 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-11 rounded-xl text-xs transition flex items-center justify-center relative ${btnBg}`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-600 rounded-full border-2 border-white"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status legend */}
              <div className="pt-4 border-t border-slate-100 text-[11px] space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-emerald-600 rounded-md"></div>
                  <span>Sudah Terjawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-amber-400 rounded-md"></div>
                  <span>Ditandai Ragu-ragu ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-slate-100 border border-slate-300 rounded-md"></div>
                  <span>Belum Terjawab ({totalQ - answeredCount})</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmSubmitModal(true)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Kumpulkan Ujian Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Submit Modal */}
        {showConfirmSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Konfirmasi Kumpulkan Ujian</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Anda telah menjawab <span className="font-bold text-slate-800">{answeredCount}</span> dari {totalQ} soal.
                  {totalQ - answeredCount > 0 && (
                    <span className="block text-rose-600 font-bold mt-1">
                      ⚠️ Terdapat {totalQ - answeredCount} soal yang belum dijawab!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmSubmitModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Periksa Kembali
                </button>
                <button
                  onClick={handleFinishTest}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
                >
                  Ya, Kumpulkan Jawaban
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= RENDER: QUESTION MANAGEMENT VIEW FOR A SINGLE TEST =================
  if (managingQuestionsTest) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setManagingQuestionsTest(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                {managingQuestionsTest.type}
              </span>
              <span className="text-xs text-slate-400">
                Kategori: {managingQuestionsTest.category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Kelola Butir Soal: {managingQuestionsTest.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Total {managingQuestionsTest.questions.length} butir soal terdaftar • Durasi: {managingQuestionsTest.durationMinutes} menit • Standar Kelulusan: {managingQuestionsTest.passingScore}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openAddQuestionModal(managingQuestionsTest.id)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Soal Baru</span>
            </button>

            <button
              onClick={() => handleOpenBulkImport(managingQuestionsTest.id)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <FileUp className="w-4 h-4" />
              <span>Import Salin-Tempel</span>
            </button>
          </div>
        </div>

        {/* Questions list */}
        {managingQuestionsTest.questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Belum Ada Butir Soal</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Paket ujian ini masih kosong. Klik tombol &ldquo;Input Soal Baru&rdquo; untuk mengisi kolom soal atau gunakan opsi Import Salin-Tempel.
              </p>
            </div>
            <button
              onClick={() => openAddQuestionModal(managingQuestionsTest.id)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Input Soal Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {managingQuestionsTest.questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-amber-400/80 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {q.type}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Bobot: {q.score || 25} Poin
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCrossDuplicateToCounterpart(q, managingQuestionsTest.type, managingQuestionsTest.category)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                      title={managingQuestionsTest.type === 'Pre-Test' ? 'Salin ke Post-Test' : 'Salin ke Pre-Test'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditQuestionModal(managingQuestionsTest.id, q, idx)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit Kolom Soal"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(managingQuestionsTest.id, idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {q.caseVignette && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-slate-800">
                    <span className="font-bold text-amber-900">Skenario Klinis:</span> {q.caseVignette}
                  </div>
                )}

                {q.imageUrl && (
                  <div className="py-2">
                    <img
                      src={q.imageUrl}
                      alt="Ilustrasi"
                      referrerPolicy="no-referrer"
                      className="max-h-48 rounded-xl object-contain border border-slate-200"
                    />
                  </div>
                )}

                <p className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question}
                </p>

                {/* Multiple choice options */}
                {q.type !== 'Benar/Salah' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map(opt => {
                      const isKey = q.correctAnswer === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            isKey
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-slate-50/70 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              isKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* True/False Key */}
                {q.type === 'Benar/Salah' && (
                  <div className="text-xs text-slate-700">
                    Kunci Jawaban:{' '}
                    <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Rasional & Pembahasan:</span> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ================= RENDER: MAIN LIST VIEW & BANK SOAL =================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Pre-Test & Post-Test CBT Terpadu
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                STARKES 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Evaluasi kompetensi awal (Pre-Test), bank butir soal terpadu, dan capaian stase akhir (Post-Test) RS TK II Kartika Husada
            </p>
          </div>
        </div>

        {/* Action buttons for educators */}
        {isTeacherOrAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openAddQuestionModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <ListPlus className="w-4 h-4" />
              <span>Input Butir Soal Baru</span>
            </button>

            <button
              onClick={() => handleOpenBulkImport()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <FileUp className="w-4 h-4" />
              <span>Import Salin-Tempel</span>
            </button>

            <button
              onClick={() => openCreateTestModal()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Paket Ujian</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tab Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('pre-test')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'pre-test'
                ? 'bg-[#0B192C] text-amber-400 shadow-md ring-2 ring-amber-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Paket Pre-Test (Pra-Stase)</span>
            <span className="px-2 py-0.2 bg-amber-500/20 text-amber-400 rounded-full text-[10px]">
              {tests.filter(t => t.type === 'Pre-Test').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('post-test')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'post-test'
                ? 'bg-[#0B192C] text-amber-400 shadow-md ring-2 ring-amber-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Paket Post-Test (Pasca-Stase)</span>
            <span className="px-2 py-0.2 bg-amber-500/20 text-amber-400 rounded-full text-[10px]">
              {tests.filter(t => t.type === 'Post-Test').length}
            </span>
          </button>

          {/* Dedicated Bank Soal Tab */}
          <button
            onClick={() => setActiveTab('bank-soal')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'bank-soal'
                ? 'bg-[#0B192C] text-amber-400 shadow-md ring-2 ring-amber-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Input & Bank Soal</span>
            <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">
              {allBankQuestions.length} Butir
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gradebook')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'gradebook'
                ? 'bg-[#0B192C] text-amber-400 shadow-md ring-2 ring-amber-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Rekapitulasi Nilai</span>
            <span className="px-2 py-0.2 bg-slate-200 text-slate-800 rounded-full text-[10px]">
              {filteredAttempts.length}
            </span>
          </button>
        </div>

        {/* Search bar for tests list */}
        {(activeTab === 'pre-test' || activeTab === 'post-test') && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama ujian / stase..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">Semua Kategori</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ================= VIEW: BANK SOAL TERPADU (PRE-TEST & POST-TEST) ================= */}
      {activeTab === 'bank-soal' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Bank Soal Top Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Cari kata kunci soal / skenario klinis..."
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={bankTypeFilter}
                onChange={(e) => setBankTypeFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">Semua Tipe Ujian (Pre & Post)</option>
                <option value="Pre-Test">Hanya Pre-Test</option>
                <option value="Post-Test">Hanya Post-Test</option>
              </select>

              <select
                value={bankCategoryFilter}
                onChange={(e) => setBankCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">Semua Kategori Stase</option>
                {allCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {isTeacherOrAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAddQuestionModal()}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Butir Soal</span>
                </button>
                <button
                  onClick={() => handleOpenBulkImport()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Import Teks</span>
                </button>
              </div>
            )}
          </div>

          {/* Questions Grid */}
          {allBankQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Tidak Ditemukan Butir Soal</h3>
              <p className="text-xs text-slate-400">
                Silakan ubah filter pencarian atau klik &ldquo;Tambah Butir Soal&rdquo; untuk menginput soal baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allBankQuestions.map((item, idx) => (
                <div
                  key={item.question.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-amber-400/80 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            item.testType === 'Pre-Test'
                              ? 'bg-purple-100 text-purple-900 border-purple-200'
                              : 'bg-blue-100 text-blue-900 border-blue-200'
                          }`}
                        >
                          {item.testType}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.testCategory}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Bobot: {item.question.score || 25} Poin
                        </span>
                      </div>

                      {/* Action buttons for educators */}
                      {isTeacherOrAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCrossDuplicateToCounterpart(item.question, item.testType, item.testCategory)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                            title={item.testType === 'Pre-Test' ? 'Salin butir soal ke Post-Test' : 'Salin butir soal ke Pre-Test'}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditQuestionModal(item.testId, item.question, item.questionIndex)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Edit Kolom Soal"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(item.testId, item.questionIndex)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium">
                      Paket: <span className="text-slate-700 font-bold">{item.testTitle}</span>
                    </div>

                    {item.question.caseVignette && (
                      <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-slate-800 italic">
                        <span className="font-bold not-italic text-amber-900">Skenario Klinis:</span> {item.question.caseVignette}
                      </div>
                    )}

                    {item.question.imageUrl && (
                      <img
                        src={item.question.imageUrl}
                        alt="Diagram"
                        referrerPolicy="no-referrer"
                        className="max-h-36 rounded-xl object-contain border border-slate-200"
                      />
                    )}

                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.question.question}
                    </p>

                    {/* Options */}
                    {item.question.type !== 'Benar/Salah' && item.question.options && (
                      <div className="space-y-1.5 pt-1">
                        {item.question.options.map(opt => {
                          const isKey = item.question.correctAnswer === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                                isKey
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-slate-50/60 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                  isKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <span className="leading-tight">{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {item.question.type === 'Benar/Salah' && (
                      <div className="text-xs text-slate-700">
                        Kunci Jawaban:{' '}
                        <span className="font-bold text-emerald-700">{item.question.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  {/* Explanation Footer */}
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Rasional:</span> {item.question.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= GRADEBOOK VIEW ================= */}
      {activeTab === 'gradebook' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          {/* Gradebook Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                Rekap Hasil Ujian Mahasiswa & Peserta Diklat
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar nilai ujian terintegrasi dengan riwayat pengerjaan dan status kelulusan kompetensi
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={gradebookFilterType}
                onChange={(e) => setGradebookFilterType(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">Semua Tipe Ujian</option>
                <option value="Pre-Test">Hanya Pre-Test</option>
                <option value="Post-Test">Hanya Post-Test</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={gradebookSearch}
                  onChange={(e) => setGradebookSearch(e.target.value)}
                  placeholder="Cari nama mahasiswa / institusi..."
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap</span>
              </button>
            </div>
          </div>

          {/* Table of Attempts */}
          {filteredAttempts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada data pengerjaan ujian yang sesuai dengan filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-3">Peserta Mahasiswa</th>
                    <th className="py-3 px-3">Paket Ujian</th>
                    <th className="py-3 px-3">Tipe</th>
                    <th className="py-3 px-3">Waktu Selesai</th>
                    <th className="py-3 px-3 text-center">Jawaban Benar</th>
                    <th className="py-3 px-3 text-center">Skor Akhir</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{att.studentName}</div>
                        <div className="text-[10px] text-slate-400">{att.institutionName}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 max-w-xs truncate">
                        {att.testTitle}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            att.testType === 'Pre-Test'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {att.testType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {att.completedAt}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {att.totalCorrect} / {att.totalQuestions}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-black text-sm text-amber-700">
                          {att.score}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            att.passed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {att.passed ? '✓ LULUS' : '✕ REMEDIAL'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setViewingAttempt(att)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TEST CARDS GRID (PRE-TEST & POST-TEST) ================= */}
      {(activeTab === 'pre-test' || activeTab === 'post-test') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map(test => {
            const myAttempts = testAttempts.filter(
              att => att.testId === test.id && (att.studentId === currentUser.id || att.studentName.toLowerCase().includes(currentUser.name.toLowerCase()))
            );
            const latestAttempt = myAttempts[0];

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400/80 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        test.type === 'Pre-Test'
                          ? 'bg-purple-100 text-purple-900 border-purple-200'
                          : 'bg-blue-100 text-blue-900 border-blue-200'
                      }`}
                    >
                      {test.type.toUpperCase()} • STASE KLINIK
                    </span>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        Batas Lulus: {test.passingScore}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {test.description || 'Paket tes uji kompetensi komprehensif berstandar rumah sakit pendidikan.'}
                  </p>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ClipboardList className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium">{test.questions.length} Butir Soal</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-medium">Durasi: {test.durationMinutes} Menit</span>
                    </div>
                  </div>

                  {/* Student past score badge */}
                  {latestAttempt && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        latestAttempt.passed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/60 border-rose-200 text-rose-900'
                      }`}
                    >
                      <span className="text-[11px] font-medium">Nilai Terakhir Anda:</span>
                      <span className="font-mono font-black text-sm">
                        {latestAttempt.score}/100 ({latestAttempt.passed ? 'LULUS' : 'REMEDIAL'})
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startTest(test)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{latestAttempt ? 'Kerjakan Ulang' : 'Mulai Ujian CBT'}</span>
                    </button>
                  </div>

                  {/* Educator controls */}
                  {isTeacherOrAdmin && (
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        onClick={() => setManagingQuestionsTest(test)}
                        className="text-slate-600 hover:text-amber-600 font-semibold flex items-center gap-1 py-1 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Input / Edit Soal ({test.questions.length})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openAddQuestionModal(test.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition"
                          title="Tambah Soal ke Paket Ini"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditTestModal(test)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-amber-600 transition"
                          title="Edit Pengaturan Paket"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus paket ujian "${test.title}"?`)) {
                              deleteTest(test.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Hapus Ujian"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= COMPREHENSIVE QUESTION INPUT & EDITOR MODAL ================= */}
      {isQuestionEditorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-6 my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <ListPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingQuestion !== null ? `Edit Butir Soal #${editingQuestion.index + 1}` : 'Form Input Butir Soal Pre-Test & Post-Test'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi kolom pertanyaan, skenario kasus klinis, pilihan jawaban, bobot, dan pembahasan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsQuestionEditorModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              {/* Row 1: Target Test Package & Question Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Paket Ujian <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={targetTestIdForQuestion}
                    onChange={(e) => {
                      setTargetTestIdForQuestion(e.target.value);
                      const t = tests.find(x => x.id === e.target.value);
                      if (t) setQCategory(t.category);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    {tests.map(t => (
                      <option key={t.id} value={t.id}>
                        [{t.type}] {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Soal</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pilihan Ganda">Pilihan Ganda (A - D / E)</option>
                    <option value="Studi Kasus / Vignette">Studi Kasus / Vignette Klinis</option>
                    <option value="Benar/Salah">Benar / Salah (True/False)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bobot Skor (Poin)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={qScore}
                    onChange={(e) => setQScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Kolom Skenario Kasus Klinis (Vignette) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Kolom Skenario Kasus Klinis / Vignette <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setQCaseVignette('Seorang pasien laki-laki berusia 54 tahun dirawat di ICU dengan diagnosis Syok Sepsis ec Pneumonia Komunitas. Hasil pemeriksaan TTV didapatkan TD: 80/50 mmHg, Nadi: 124 x/menit ireguler, RR: 28 x/menit, SpO2: 91% on NRM 10 Lpm. Setelah resusitasi cairan kristaloid 30 ml/kgBB, MAP tetap < 65 mmHg.')}
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    + Masukkan Contoh Skenario
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={qCaseVignette}
                  onChange={(e) => setQCaseVignette(e.target.value)}
                  placeholder="Contoh: Seorang pasien perempuan usia 28 tahun G1P0A0 hamil 38 minggu datang ke ruang bersalin dengan keluhan mulas teratur..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Kolom Teks Pertanyaan Utama */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kolom Pertanyaan Utama / Stem Soal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Contoh: Apakah tindakan farmakoterapi lini pertama yang tepat untuk meningkatkan tekanan perfusi organ pada pasien tersebut?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Kolom Gambar Lampiran (Opsional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kolom URL Gambar / Diagram EKG / Rontgen <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qImageUrl}
                    onChange={(e) => setQImageUrl(e.target.value)}
                    placeholder="https://... (URL gambar ilustrasi medis)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {qImageUrl && (
                    <button
                      type="button"
                      onClick={() => setQImageUrl('')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Kolom Pilihan Jawaban A, B, C, D, (E) jika Pilihan Ganda / Vignette */}
              {qType !== 'Benar/Salah' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">
                      Kolom Pilihan Opsi Jawaban & Kunci Benar
                    </label>
                    <div className="flex items-center gap-2">
                      {qOptions.length === 4 && (
                        <button
                          type="button"
                          onClick={handleAddOptionE}
                          className="text-[11px] text-amber-600 hover:text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                        >
                          + Tambah Opsi E
                        </button>
                      )}
                      {qOptions.length === 5 && (
                        <button
                          type="button"
                          onClick={handleRemoveOptionE}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                        >
                          - Hapus Opsi E
                        </button>
                      )}
                    </div>
                  </div>

                  {qOptions.map((opt, optIndex) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0" title="Klik untuk jadikan kunci jawaban benar">
                        <input
                          type="radio"
                          name="correctAnswerRadio"
                          checked={qCorrectAnswer === opt.id}
                          onChange={() => setQCorrectAnswer(opt.id)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs ${
                          qCorrectAnswer === opt.id ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300'
                        }`}>
                          {opt.id}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...qOptions];
                          updated[optIndex].text = e.target.value;
                          setQOptions(updated);
                        }}
                        placeholder={`Masukkan teks pilihan jawaban ${opt.id}...`}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-400">
                    Pilih tombol radio bundar di sebelah kiri opsi untuk menetapkan kunci jawaban yang benar.
                  </p>
                </div>
              )}

              {/* Kolom True/False selection */}
              {qType === 'Benar/Salah' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block font-bold text-slate-700 mb-2">Kunci Jawaban yang Benar</label>
                  <div className="flex gap-6">
                    {['Benar', 'Salah'].map(val => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tfAnswer"
                          value={val}
                          checked={qCorrectAnswer === val}
                          onChange={() => setQCorrectAnswer(val)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-bold text-slate-800">{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Kolom Pembahasan & Rasional Ilmiah */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kolom Pembahasan & Rasional Ilmiah (STARKES / Pedoman Klinis)
                </label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Jelaskan alasan ilmiah, rujukan SOP atau dasar teori mengapa kunci jawaban tersebut benar..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Auto Duplicate to Post-Test Checkbox (if creating new) */}
              {!editingQuestion && (
                <label className="flex items-center gap-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncToPostTestPair}
                    onChange={(e) => setSyncToPostTestPair(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-800 font-medium">
                    Sertakan juga butir soal ini ke paket pasangannya (Pre-Test ↔ Post-Test stase terkait)
                  </span>
                </label>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
                >
                  {editingQuestion ? 'Simpan Perubahan Soal' : 'Simpan Butir Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BULK IMPORT MODAL ================= */}
      {isBulkImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Import Butir Soal Cepat (Format Salin-Tempel)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tempel teks butir soal dengan format baku untuk memasukkan banyak soal sekaligus
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBulkImportModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Paket Ujian <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bulkTargetTestId}
                  onChange={(e) => setBulkTargetTestId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>
                      [{t.type}] {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Teks Soal Format Baku</label>
                  <span className="text-[11px] text-slate-400">
                    Format: [Soal 1], Pertanyaan:, A., B., C., D., KUNCI:, PEMBAHASAN:
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={bulkRawText}
                  onChange={(e) => setBulkRawText(e.target.value)}
                  className="w-full bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkImport}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Proses & Masukkan Semua Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT TEST PACKAGE MODAL ================= */}
      {isCreateTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTest ? 'Edit Pengaturan Paket Ujian' : 'Buat Paket Ujian Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Konfigurasi ujian Pre-Test atau Post-Test CBT
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateTestModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Paket Ujian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={testFormTitle}
                  onChange={(e) => setTestFormTitle(e.target.value)}
                  placeholder="Contoh: Pre-Test: Standar Keselamatan Pasien & PPI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Ujian</label>
                  <select
                    value={testFormType}
                    onChange={(e) => setTestFormType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pre-Test">Pre-Test (Pra-Stase)</option>
                    <option value="Post-Test">Post-Test (Pasca-Stase)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori / Stase</label>
                  <select
                    value={testFormCategory}
                    onChange={(e) => setTestFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Keselamatan Pasien & PPI">Keselamatan Pasien & PPI</option>
                    <option value="Gawat Darurat & ICU">Gawat Darurat & ICU</option>
                    <option value="Maternal & Neonatal">Maternal & Neonatal (Kebidanan)</option>
                    <option value="Keperawatan Medikal Bedah">Keperawatan Medikal Bedah</option>
                    <option value="Farmasi Klinik & Resep">Farmasi Klinik & Resep</option>
                    <option value="Etika & Hukum Kesehatan">Etika & Hukum Kesehatan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi Ujian (Menit)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={testFormDuration}
                    onChange={(e) => setTestFormDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Kelulusan (Passing Score)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={testFormPassingScore}
                    onChange={(e) => setTestFormPassingScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi & Petunjuk Pengerjaan</label>
                <textarea
                  rows={3}
                  value={testFormDesc}
                  onChange={(e) => setTestFormDesc(e.target.value)}
                  placeholder="Instruksi dan petunjuk singkat bagi peserta didik..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
                >
                  {editingTest ? 'Simpan Perubahan' : 'Buat Paket & Input Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW ATTEMPT DETAIL MODAL ================= */}
      {viewingAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detail Lembar Jawaban Ujian
                </h3>
                <p className="text-xs text-slate-500">
                  {viewingAttempt.testTitle} ({viewingAttempt.testType})
                </p>
              </div>

              <button
                onClick={() => setViewingAttempt(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score banner */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Peserta Didik:</div>
                <div className="font-bold text-white text-sm">{viewingAttempt.studentName}</div>
                <div className="text-[11px] text-amber-300">{viewingAttempt.institutionName}</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Skor Akhir:</div>
                <div className="font-mono font-black text-2xl text-amber-400">
                  {viewingAttempt.score} / 100
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingAttempt.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {viewingAttempt.passed ? 'LULUS KOMPETENSI' : 'BELUM LULUS'}
                </span>
              </div>
            </div>

            {/* Breakdown of answers */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              <h4 className="font-bold text-xs text-slate-900 uppercase">Rekapitulasi Butir Jawaban:</h4>
              {viewingAttempt.answers.map((ans, idx) => (
                <div
                  key={ans.questionId}
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    ans.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-800">Soal #{idx + 1}</span>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Jawaban Terpilih: <span className="font-bold">{ans.selectedAnswer || 'Tidak dijawab'}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ans.isCorrect ? '✓ Benar' : '✕ Salah'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingAttempt(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
