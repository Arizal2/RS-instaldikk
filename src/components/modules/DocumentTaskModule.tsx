import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, ReviewStatus, DocumentType } from '../../types';
import {
  FileCheck2,
  UploadCloud,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FileText,
  Image,
  Award,
  Check,
  X,
  Plus
} from 'lucide-react';

export const DocumentTaskModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    documents,
    students,
    rooms,
    uploadDocument,
    reviewDocument,
    openPdfViewer,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reviewingDoc, setReviewingDoc] = useState<DocumentItem | null>(null);

  // Upload Form
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Laporan Kasus');
  const [docDescription, setDocDescription] = useState('');
  const [fileName, setFileName] = useState('Laporan_Asuhan_Keperawatan_Lengkap.pdf');

  // Review Form
  const [reviewScore, setReviewScore] = useState<number>(85);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewStatusChoice, setReviewStatusChoice] = useState<ReviewStatus>('Diterima');

  const filteredDocuments = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'all' || doc.reviewStatus === selectedStatus;
    const matchType = selectedType === 'all' || doc.type === selectedType;
    return matchSearch && matchStatus && matchType;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast('Form Belum Lengkap', 'Judul tugas wajib diisi.', 'warning');
      return;
    }

    const currentStudent = students.find(s => s.email === currentUser.email) || students[0];

    uploadDocument({
      title: docTitle,
      type: docType,
      format: 'pdf',
      fileName: fileName,
      fileSize: '2.4 MB',
      fileUrl: 'https://example.com/mock.pdf',
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      institutionName: currentStudent.institutionName,
      roomId: currentStudent.roomId,
      roomName: currentStudent.roomName,
      ciId: currentStudent.ciId,
      ciName: currentStudent.ciName
    });

    showToast('Tugas Berhasil Diunggah', `Dokumen "${docTitle}" berhasil dikirimkan untuk diperiksa oleh CI.`, 'success');
    setIsUploadModalOpen(false);
    setDocTitle('');
    setDocDescription('');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingDoc) return;

    reviewDocument(
      reviewingDoc.id,
      reviewStatusChoice,
      reviewFeedback || (reviewStatusChoice === 'Diterima' ? 'Laporan komprehensif, memenuhi standar IPKP.' : 'Mohon perbaiki analisa data SOAP.'),
      reviewScore
    );

    showToast('Evaluasi Tersimpan', `Status tugas diperbarui menjadi ${reviewStatusChoice} dengan nilai ${reviewScore}.`, 'success');
    setReviewingDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              DOKUMEN & LOGBOOK
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Pengumpulan Tugas & Verifikasi Dokumen</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen berkas laporan kasus, lembar SOAP harian, refleksi kasus, dan verifikasi penilaian oleh Clinical Instructor.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Unggah Berkas Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul tugas atau nama mahasiswa..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Semua Status Review</option>
            <option value="Menunggu Pemeriksaan">Menunggu Pemeriksaan</option>
            <option value="Diterima">Diterima & Dinilai</option>
            <option value="Perlu Revisi">Perlu Revisi</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Semua Jenis Dokumen</option>
            <option value="Laporan Kasus">Laporan Kasus</option>
            <option value="Logbook">Logbook</option>
            <option value="Tugas Harian">Tugas Harian</option>
            <option value="Dokumentasi Foto">Dokumentasi Foto</option>
            <option value="Jurnal Refleksi">Jurnal Refleksi</option>
            <option value="SOP Evaluasi">SOP Evaluasi</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          Total: {filteredDocuments.length} Dokumen
        </span>
      </div>

      {/* Document Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocuments.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {doc.type}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  doc.reviewStatus === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                  doc.reviewStatus === 'Perlu Revisi' ? 'bg-rose-100 text-rose-800' :
                  doc.reviewStatus === 'Ditolak' ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.reviewStatus}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                {doc.title}
              </h3>

              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <div>Mahasiswa: <span className="font-semibold text-slate-800">{doc.studentName}</span></div>
                <div>Ruangan: <span className="text-blue-700 font-medium">{doc.roomName}</span></div>
                <div>Diunggah: <span className="text-slate-600">{doc.uploadedAt}</span></div>
                <div>Ukuran: <span className="font-mono text-slate-600">{doc.fileSize} ({doc.format.toUpperCase()})</span></div>
              </div>

              {doc.grade !== undefined && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-semibold">Nilai Evaluasi:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">{doc.grade} / 100</span>
                </div>
              )}

              {doc.feedback && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                  "CI ({doc.reviewedBy || 'Pembimbing'}): {doc.feedback}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => openPdfViewer(doc.title, doc.fileUrl, doc.format, doc.type, doc.studentName)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Baca Berkas</span>
              </button>

              {(currentRole === 'ci' || currentRole === 'admin' || currentRole === 'dosen') && (
                <button
                  onClick={() => {
                    setReviewingDoc(doc);
                    setReviewScore(doc.grade || 85);
                    setReviewFeedback(doc.feedback || '');
                    setReviewStatusChoice(doc.reviewStatus === 'Menunggu Pemeriksaan' ? 'Diterima' : doc.reviewStatus);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs transition"
                >
                  Periksa / Nilai
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal for CI / Admin */}
      {reviewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase">{reviewingDoc.type}</span>
                <h3 className="font-bold text-sm text-white">{reviewingDoc.title}</h3>
              </div>
              <button onClick={() => setReviewingDoc(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveReview} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500">Mahasiswa Pengunggah:</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{reviewingDoc.studentName}</div>
                <button
                  type="button"
                  onClick={() => openPdfViewer(reviewingDoc.title, reviewingDoc.fileUrl, reviewingDoc.format, reviewingDoc.type, reviewingDoc.studentName)}
                  className="text-xs text-blue-700 font-semibold mt-1 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Buka Pratinjau Dokumen Digital
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keputusan Evaluasi Review *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatusChoice('Diterima')}
                    className={`p-2 rounded-xl border font-bold text-center transition ${
                      reviewStatusChoice === 'Diterima' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    ✓ Diterima
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatusChoice('Perlu Revisi')}
                    className={`p-2 rounded-xl border font-bold text-center transition ${
                      reviewStatusChoice === 'Perlu Revisi' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    ! Perlu Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatusChoice('Ditolak')}
                    className={`p-2 rounded-xl border font-bold text-center transition ${
                      reviewStatusChoice === 'Ditolak' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    ✕ Ditolak
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nilai Angka (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewScore}
                  onChange={e => setReviewScore(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Bimbingan / Feedback CI</label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  placeholder="Berikan masukan terkait analisis data, intervensi, atau rasional tindakan..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingDoc(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0B192C] text-amber-400 font-bold"
                >
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 text-xs">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Unggah Dokumen / Tugas Baru</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul Tugas / Berkas *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  placeholder="Contoh: Asuhan Keperawatan Pasien Syok Sepsis ICU"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Dokumen</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Laporan Kasus">Laporan Kasus (Case Report)</option>
                  <option value="Logbook">Logbook Kegiatan Harian Stase</option>
                  <option value="Tugas Harian">Tugas Harian Stase</option>
                  <option value="Dokumentasi Foto">Foto Dokumentasi Tindakan</option>
                  <option value="Jurnal Refleksi">Jurnal Refleksi</option>
                  <option value="SOP Evaluasi">SOP Evaluasi</option>
                </select>
              </div>

              {/* Drag and Drop Zone Simulation */}
              <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 text-center bg-slate-50 transition cursor-pointer">
                <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800">Klik atau seret file PDF / DOCX di sini</p>
                <p className="text-[10px] text-slate-400 mt-1">Maksimal ukuran file 25 MB</p>
                <div className="mt-2 text-[11px] text-blue-700 font-mono bg-blue-50 py-1 px-2 rounded inline-block">
                  ✓ File Terpilih: {fileName}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={e => setDocDescription(e.target.value)}
                  placeholder="Catatan untuk Clinical Instructor..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0B192C] text-amber-400 font-bold"
                >
                  Kirim Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
