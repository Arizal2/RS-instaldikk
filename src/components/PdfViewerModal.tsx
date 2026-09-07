import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  BookOpen, 
  FileText,
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PdfViewerModal: React.FC = () => {
  const { pdfViewer, closePdfViewer, showToast } = useApp();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const totalPages = 8; // simulated pagination

  if (!pdfViewer.isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (pdfViewer.url && pdfViewer.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = pdfViewer.url;
      link.download = `${pdfViewer.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${pdfViewer.format || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Mengunduh Dokumen', `Berkas "${pdfViewer.title}" berhasil diunduh.`, 'success');
    } else {
      showToast('Mengunduh Dokumen', `File "${pdfViewer.title}" sedang diunduh...`, 'info');
    }
  };

  const isDataPdf = pdfViewer.url && (pdfViewer.url.startsWith('data:application/pdf') || pdfViewer.url.startsWith('blob:') || pdfViewer.url.endsWith('.pdf'));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl h-[92vh] border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0B192C] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                {pdfViewer.docType === 'Video Pembelajaran' ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-slate-100 truncate flex items-center gap-2">
                  {pdfViewer.title}
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Terverifikasi RSKH
                  </span>
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {pdfViewer.author ? `Oleh: ${pdfViewer.author}` : 'Instalasi Pendidikan Rumah Sakit TK II Kartika Husada'} • Format: {pdfViewer.format.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-print-doc"
                onClick={handlePrint}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1 text-xs"
                title="Cetak Dokumen"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak</span>
              </button>

              <button
                id="btn-download-doc"
                onClick={handleDownload}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                title="Unduh Berkas"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Unduh</span>
              </button>

              <div className="w-px h-5 bg-slate-700 mx-1 hidden sm:block"></div>

              <button
                id="btn-close-pdf-modal"
                onClick={closePdfViewer}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-rose-900/50 hover:border-rose-700 transition-all"
                aria-label="Tutup pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Toolbar (Zoom & Page control) */}
          <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 text-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-slate-600">
                Halaman <span className="text-slate-900 font-bold">{currentPage}</span> dari {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 transition"
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-slate-800 w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 transition"
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-[11px] px-1.5 transition ml-1"
                title="Atur Ulang Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Content Canvas View */}
          <div className="flex-1 bg-slate-200/80 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              className="bg-white shadow-xl rounded-lg p-8 sm:p-12 w-full max-w-2xl border border-slate-300 text-slate-800 space-y-6 min-h-[750px]"
            >
              {/* Header Letterhead RSKH */}
              <div className="border-b-2 border-[#0B192C] pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0B192C] text-amber-400 font-bold text-lg rounded-xl flex items-center justify-center border-2 border-amber-400/40 shadow-sm">
                    RSKH
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">Markas Besar TNI Angkatan Darat • Kesdam XII/Tpr</h4>
                    <h2 className="font-extrabold text-sm sm:text-base text-[#0B192C]">RUMAH SAKIT TK II KARTIKA HUSADA</h2>
                    <p className="text-[11px] text-slate-500 font-medium">Instalasi Pendidikan & Pelatihan Praktik Klinik (INSTALDIK)</p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <div>DOK-RESMI-RSKH</div>
                  <div>REV: 2026/09</div>
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {pdfViewer.docType || 'DOKUMEN KLINIK RESMI'}
                </span>
                <h1 className="text-base sm:text-lg font-bold text-[#0B192C] mt-2 leading-snug">
                  {pdfViewer.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Klasifikasi: Publik Terverifikasi RSKH • Status: Berlaku Aktif
                </p>
              </div>

              {/* Dynamic Page Simulation Content */}
              {currentPage === 1 && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <h3 className="font-bold text-slate-900 border-b pb-1 text-sm">1. PENDAHULUAN DAN TUJUAN</h3>
                  <p>
                    Instalasi Pendidikan (Instaldik) Rumah Sakit TK II Kartika Husada berkomitmen memfasilitasi integrasi pendidikan klinis berstandar tinggi bagi seluruh peserta didik profesi dokter, keperawatan, kebidanan, dan farmasi. Dokumen ini menjadi pedoman operasional wajib dalam menjamin mutu asuhan pasien dan keselamatan kerja peserta didik.
                  </p>

                  <h3 className="font-bold text-slate-900 border-b pb-1 text-sm mt-4">2. LANDASAN HUKUM & STANDAR AKREDITASI</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                    <li>Undang-Undang Republik Indonesia Nomor 17 Tahun 2023 tentang Kesehatan.</li>
                    <li>Keputusan Kepala Staf Angkatan Darat tentang Organisasi dan Tugas RS TK II Kartika Husada.</li>
                    <li>Standar Akreditasi Rumah Sakit Kementerian Kesehatan RI (STARKES) Bab Pendidikan Klinis Rumah Sakit (IPKP).</li>
                    <li>Sasaran Keselamatan Pasien (SKP) Internasional Rumah Sakit.</li>
                  </ul>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r text-xs text-blue-900">
                    <span className="font-bold">Ketentuan Khusus:</span> Setiap mahasiswa wajib mematuhi jam dinas, kelengkapan alat pelindung diri (APD), dan etika militer-medis selama bertugas di lingkungan RS TK II Kartika Husada.
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <h3 className="font-bold text-slate-900 border-b pb-1 text-sm">3. PROSEDUR DAN ALUR KERJA KLINIK</h3>
                  <p>
                    Semua tindakan invasif dan pemberian obat dosis tinggi (high-alert medication) harus melalui supervisi bertingkat oleh Clinical Instructor (CI) ruangan yang bersertifikat.
                  </p>
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden my-3">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-700 border-b">
                        <tr>
                          <th className="p-2">Level Supervisi</th>
                          <th className="p-2">Tindakan Klinis</th>
                          <th className="p-2">Wewenang Mahasiswa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2 font-medium text-blue-800">Supervisi Ketat (Direct)</td>
                          <td className="p-2">Intubasi, Resusitasi Jantung, Bedah Mayor</td>
                          <td className="p-2">Observasi & Asistensi Terarah</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium text-emerald-800">Supervisi Moderat</td>
                          <td className="p-2">Pasang Infus, Kateter Urin, NGT, Hecting</td>
                          <td className="p-2">Mandiri Didampingi CI</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium text-amber-800">Supervisi Berkala</td>
                          <td className="p-2">Pemeriksaan TTV, Edukasi Pasien, Anamnesis</td>
                          <td className="p-2">Mandiri Mandat Penuh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentPage > 2 && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <h3 className="font-bold text-slate-900 border-b pb-1 text-sm">4. EVALUASI DAN DOKUMENTASI KLINIS (HALAMAN {currentPage})</h3>
                  <p>
                    Kelengkapan logbook harian, asuhan klinis, laporan reflektif, serta pengisian lembar SOAP terintegrasi pada sistem e-Instaldik RSKH wajib diselesaikan tepat waktu sebelum rotasi stase berakhir.
                  </p>
                  <p className="text-slate-500 italic">
                    [Konten digital terenkripsi RSKH. Seluruh data rekam medis pasien dilindungi oleh kerahasiaan medis dan undang-undang privasi data tenaga kesehatan].
                  </p>
                </div>
              )}

              {/* Footer Signature */}
              <div className="border-t border-slate-200 pt-6 mt-8 flex justify-between items-end text-xs">
                <div>
                  <p className="text-slate-500 text-[10px]">Dicetak secara digital melalui:</p>
                  <p className="font-semibold text-slate-800">e-Instaldik RSKH v2.4</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-[10px]">Pontianak, September 2026</p>
                  <p className="font-bold text-slate-900 mt-1">Kepala Instalasi Pendidikan RSKH</p>
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                      ✓ DIGITAL SIGNATURE VERIFIED
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 underline">Mayor Ckm dr. Andi Wijaya, Sp.PD</p>
                  <p className="text-slate-500 text-[10px]">NRP 1104001923</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
