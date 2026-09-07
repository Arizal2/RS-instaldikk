import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LibraryItem, LibraryCategory, LibraryDocType } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  FileText,
  Video,
  Bookmark,
  CheckCircle,
  Tag,
  ShieldCheck,
  Edit2,
  Trash2,
  FileCheck,
  Layers,
  Sparkles,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import { DocumentUploadField } from '../common/DocumentUploadField';
import { ImageUploadField } from '../common/ImageUploadField';

export const ELibraryModule: React.FC = () => {
  const { libraryItems, addLibraryItem, updateLibraryItem, deleteLibraryItem, openPdfViewer, currentRole, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocType, setSelectedDocType] = useState<string>('all');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);

  // Form states
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState<LibraryCategory>('Keperawatan');
  const [itemDocType, setItemDocType] = useState<LibraryDocType>('Buku');
  const [itemAuthor, setItemAuthor] = useState('');
  const [itemPublisher, setItemPublisher] = useState('');
  const [itemYear, setItemYear] = useState('2026');
  const [itemDesc, setItemDesc] = useState('');
  const [itemKeywords, setItemKeywords] = useState('Buku, Modul, RSKH, Klinis');
  
  // File upload state
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('3.5 MB');
  const [uploadedFileFormat, setUploadedFileFormat] = useState('pdf');
  
  // Cover image in JPG/JPEG
  const [itemCoverImage, setItemCoverImage] = useState('');

  const categories: (LibraryCategory | 'all')[] = [
    'all',
    'Keperawatan',
    'Kedokteran',
    'Kebidanan',
    'Farmasi',
    'Manajemen Rumah Sakit',
    'Keselamatan Pasien',
    'PPI',
    'PMKP',
    'Kegawatdaruratan',
    'ICU',
    'Lainnya'
  ];

  const docTypes: (LibraryDocType | 'all')[] = [
    'all',
    'Buku',
    'Modul',
    'SOP',
    'Panduan Praktik',
    'Jurnal',
    'Materi Pembelajaran',
    'Dokumen Pendidikan'
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.publisher && item.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchDocType = selectedDocType === 'all' || item.docType === selectedDocType;
    
    return matchSearch && matchCategory && matchDocType;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setItemTitle('');
    setItemCategory('Keperawatan');
    setItemDocType('Buku');
    setItemAuthor('');
    setItemPublisher('Instalasi Pendidikan RS TK II Kartika Husada');
    setItemYear(new Date().getFullYear().toString());
    setItemDesc('');
    setItemKeywords('Buku, Panduan, RSKH, Klinis');
    setUploadedFileDataUrl('');
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFileFormat('pdf');
    setItemCoverImage('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: LibraryItem) => {
    setEditingItem(item);
    setItemTitle(item.title);
    setItemCategory(item.category);
    setItemDocType(item.docType);
    setItemAuthor(item.author);
    setItemPublisher(item.publisher || '');
    setItemYear(item.year.toString());
    setItemDesc(item.description);
    setItemKeywords(item.keywords.join(', '));
    setUploadedFileDataUrl(item.pdfUrl);
    setUploadedFileName(item.title);
    setUploadedFileSize(item.fileSize);
    setUploadedFileFormat(item.fileFormat);
    setItemCoverImage(item.coverImage);
    setIsFormModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) {
      showToast('Form Belum Lengkap', 'Judul buku / materi wajib diisi.', 'warning');
      return;
    }

    const finalPdfUrl = uploadedFileDataUrl || (editingItem ? editingItem.pdfUrl : 'https://example.com/mock.pdf');
    const finalFileSize = uploadedFileSize || (editingItem ? editingItem.fileSize : '2.4 MB');
    const finalFormat = uploadedFileFormat || (editingItem ? editingItem.fileFormat : 'pdf');
    const defaultCover = 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&auto=format&fit=crop&q=80';
    const finalCover = itemCoverImage || defaultCover;

    const keywordsArray = itemKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (editingItem) {
      updateLibraryItem(editingItem.id, {
        title: itemTitle,
        category: itemCategory,
        docType: itemDocType,
        author: itemAuthor || 'Instalasi Pendidikan RSKH',
        publisher: itemPublisher,
        year: Number(itemYear) || 2026,
        description: itemDesc || 'Materi referensi dan panduan praktik klinis RSKH.',
        pdfUrl: finalPdfUrl,
        fileSize: finalFileSize,
        fileFormat: finalFormat,
        keywords: keywordsArray,
        coverImage: finalCover
      });
      showToast('Koleksi Diperbarui', `Buku/Materi "${itemTitle}" berhasil diperbarui.`, 'success');
    } else {
      addLibraryItem({
        title: itemTitle,
        category: itemCategory,
        docType: itemDocType,
        author: itemAuthor || 'Instalasi Pendidikan RSKH',
        publisher: itemPublisher || 'Instalasi Pendidikan RS TK II Kartika Husada',
        year: Number(itemYear) || 2026,
        description: itemDesc || 'Materi referensi dan panduan praktik klinis RSKH.',
        pdfUrl: finalPdfUrl,
        fileSize: finalFileSize,
        fileFormat: finalFormat,
        keywords: keywordsArray,
        isPublic: true,
        coverImage: finalCover
      });
      showToast('Buku/Materi Ditambahkan', `Buku "${itemTitle}" berhasil diunggah ke e-Library.`, 'success');
    }

    setIsFormModalOpen(false);
  };

  const handleDownloadFile = (item: LibraryItem) => {
    if (item.pdfUrl && item.pdfUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = item.pdfUrl;
      link.download = `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${item.fileFormat || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Unduhan Berhasil', `File "${item.title}" sedang diunduh.`, 'success');
    } else {
      openPdfViewer(item.title, item.pdfUrl, item.fileFormat, item.docType, item.author);
      showToast('Membuka Dokumen', `Menyiapkan berkas "${item.title}"...`, 'info');
    }
  };

  const canManage = currentRole === 'admin' || currentRole === 'ci' || currentRole === 'dosen';

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0B192C] to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              PERPUSTAKAAN & REPOSITORI DIGITAL
            </span>
            <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
              {libraryItems.length} Buku & Modul Tersedia
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">e-Library & Materi Edukasi Klinis</h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Repositori buku digital, standar operasional prosedur (SOP), modul praktik IPKP, dan jurnal kedokteran resmi Rumah Sakit TK II Kartika Husada.
          </p>
        </div>

        {canManage && (
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Buku / Modul PDF</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku, modul, penulis, atau kata kunci (contoh: RJP, Farmasi, ICU, Triase)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          {/* Doc Type Selector */}
          <div>
            <select
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white transition"
            >
              <option value="all">Semua Jenis Dokumen</option>
              {docTypes.filter(d => d !== 'all').map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition text-xs font-semibold ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">Tidak ada buku atau materi yang cocok</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter kategori dan jenis dokumen di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400/80 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Cover & Header */}
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={item.coverImage || 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-900/80 text-amber-300 backdrop-blur-sm border border-amber-400/30">
                        {item.docType}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                        {item.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/90 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white font-semibold text-[10px]">
                        {item.category}
                      </span>
                      {item.publisher && (
                        <span className="truncate text-slate-200 text-[10px]">
                          • {item.publisher}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate font-medium">{item.author}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                        #{kw}
                      </span>
                    ))}
                    {item.keywords.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                        +{item.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs">
                <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="font-bold text-slate-600 uppercase">{item.fileFormat}</span>
                  <span>•</span>
                  <span>{item.fileSize || '2.4 MB'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {canManage && (
                    <>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition"
                        title="Edit Buku / Materi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus koleksi digital "${item.title}"?`)) {
                            deleteLibraryItem(item.id);
                            showToast('Koleksi Dihapus', `Buku "${item.title}" telah dihapus.`, 'info');
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Hapus Koleksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDownloadFile(item)}
                    className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-200 rounded-xl transition"
                    title="Unduh File"
                  >
                    <Download className="w-4 h-4 text-slate-700" />
                  </button>

                  <button
                    onClick={() => openPdfViewer(item.title, item.pdfUrl, item.fileFormat, item.docType, item.author)}
                    className="px-3.5 py-2 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Baca</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Library Item Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 text-xs my-8 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-[#0B192C] to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingItem ? 'Edit Koleksi Buku / Modul' : 'Upload Buku / Modul PDF Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Instalasi Pendidikan RS TK II Kartika Husada
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* 1. File Upload (PDF / Book) */}
              <DocumentUploadField
                label="1. Unggah Berkas Buku / Dokumen PDF *"
                value={uploadedFileDataUrl}
                fileName={uploadedFileName}
                fileSize={uploadedFileSize}
                fileFormat={uploadedFileFormat}
                onFileLoaded={(fileInfo) => {
                  setUploadedFileDataUrl(fileInfo.dataUrl);
                  setUploadedFileName(fileInfo.fileName);
                  setUploadedFileSize(fileInfo.fileSize);
                  setUploadedFileFormat(fileInfo.format);
                  // auto fill title if empty
                  if (!itemTitle) {
                    const cleanName = fileInfo.fileName.replace(/\.[^/.]+$/, "");
                    setItemTitle(cleanName);
                  }
                }}
                onRemove={() => {
                  setUploadedFileDataUrl('');
                  setUploadedFileName('');
                  setUploadedFileSize('');
                  setUploadedFileFormat('pdf');
                }}
                helperText="Upload file PDF buku ajar, modul, atau panduan praktik (Maksimal 25MB)"
              />

              {/* 2. Cover Photo Upload (JPG/JPEG) */}
              <ImageUploadField
                label="2. Upload Cover Buku / Sampul (JPG/JPEG)"
                value={itemCoverImage}
                onChange={(imgData) => setItemCoverImage(imgData)}
                aspectRatio="cover"
                helperText="Format: JPG, JPEG, atau PNG untuk tampilan sampul buku di e-Library"
              />

              {/* 3. Book Metadata */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  3. Informasi & Metadata Buku
                </h4>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Judul Buku / Modul *</label>
                  <input
                    type="text"
                    required
                    value={itemTitle}
                    onChange={e => setItemTitle(e.target.value)}
                    placeholder="Contoh: Buku Panduan Asuhan Keperawatan Kritis & Kegawatdaruratan RSKH"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori Klinis</label>
                    <select
                      value={itemCategory}
                      onChange={e => setItemCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    >
                      {categories.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Dokumen</label>
                    <select
                      value={itemDocType}
                      onChange={e => setItemDocType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    >
                      {docTypes.filter(d => d !== 'all').map(dt => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Penulis / Tim Penyusun</label>
                    <input
                      type="text"
                      value={itemAuthor}
                      onChange={e => setItemAuthor(e.target.value)}
                      placeholder="Contoh: dr. Andi Wijaya, Sp.PD / Tim CI RSKH"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Penerbit / Unit</label>
                    <input
                      type="text"
                      value={itemPublisher}
                      onChange={e => setItemPublisher(e.target.value)}
                      placeholder="Instalasi Pendidikan RS TK II Kartika Husada"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tahun Terbit</label>
                    <input
                      type="number"
                      value={itemYear}
                      onChange={e => setItemYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kata Kunci (Pisahkan koma)</label>
                    <input
                      type="text"
                      value={itemKeywords}
                      onChange={e => setItemKeywords(e.target.value)}
                      placeholder="ICU, Ventilator, BHD, Resusitasi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ringkasan / Sinopsis Buku</label>
                  <textarea
                    rows={3}
                    value={itemDesc}
                    onChange={e => setItemDesc(e.target.value)}
                    placeholder="Ringkasan pokok bahasan, kompetensi yang dicapai, atau petunjuk penggunaan modul..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition shadow-md"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Upload & Terbitkan ke e-Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
