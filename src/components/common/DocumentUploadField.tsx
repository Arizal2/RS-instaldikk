import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle, RefreshCw, FileCheck } from 'lucide-react';

interface DocumentUploadFieldProps {
  label?: string;
  value: string; // Base64 data URL or URL
  fileName?: string;
  fileSize?: string;
  fileFormat?: string;
  onFileLoaded: (fileData: { dataUrl: string; fileName: string; fileSize: string; format: string }) => void;
  onRemove: () => void;
  accept?: string;
  helperText?: string;
  className?: string;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label = 'Upload Berkas Buku / Dokumen PDF',
  value,
  fileName,
  fileSize,
  fileFormat,
  onFileLoaded,
  onRemove,
  accept = '.pdf,application/pdf,.epub,.doc,.docx',
  helperText = 'Mendukung format PDF, EPUB, DOCX (Maksimal 25MB)',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Max 25 MB
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`Ukuran file terlalu besar (${formatBytes(file.size)}). Maksimal 25MB.`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onFileLoaded({
          dataUrl,
          fileName: file.name,
          fileSize: formatBytes(file.size),
          format: extension
        });
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file berkas.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className={`space-y-1.5 text-xs ${className}`}>
      {label && <label className="block font-semibold text-slate-700">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 truncate text-xs">
                  {fileName || 'Dokumen Buku / PDF Terlampir'}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono text-[10px] uppercase font-bold shrink-0">
                  {fileFormat || 'PDF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ukuran: <span className="font-semibold text-slate-700">{fileSize || '1.2 MB'}</span> • Siap dibaca & diunduh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Ganti Berkas
            </button>
            <button
              type="button"
              onClick={() => {
                onRemove();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition"
              title="Hapus Berkas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition text-center ${
            isDragging
              ? 'border-amber-500 bg-amber-50 text-amber-900'
              : 'border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/20 text-slate-600'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            Klik atau Tarik Berkas Buku / PDF ke Sini
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            {helperText}
          </span>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
};
