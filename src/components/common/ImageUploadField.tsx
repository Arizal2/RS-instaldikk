import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, X, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  accept?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'avatar' | 'cover' | 'logo';
  maxSizeMB?: number;
  className?: string;
  id?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Foto / Gambar (JPG/JPEG)',
  value,
  onChange,
  accept = 'image/jpeg,image/jpg,image/png',
  helperText = 'Format: JPG, JPEG, atau PNG (Maks. 5MB)',
  aspectRatio = 'square',
  maxSizeMB = 5,
  className = '',
  id
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Validate type (JPG, JPEG, PNG)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
      setErrorMsg('Format file harus berupa foto JPG, JPEG, atau PNG.');
      return;
    }

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimal ${maxSizeMB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file foto.');
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

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setUseUrlMode(false);
    }
  };

  const sizeClasses = {
    avatar: 'w-20 h-20 rounded-2xl',
    square: 'w-24 h-24 rounded-2xl',
    cover: 'w-full h-36 rounded-2xl',
    logo: 'w-28 h-20 rounded-2xl'
  }[aspectRatio];

  return (
    <div className={`space-y-1.5 text-xs ${className}`}>
      <div className="flex items-center justify-between">
        {label && <label className="block font-semibold text-slate-700">{label}</label>}
        <button
          type="button"
          onClick={() => setUseUrlMode(!useUrlMode)}
          className="text-[10px] text-amber-600 hover:text-amber-700 font-medium hover:underline"
        >
          {useUrlMode ? 'Unggah dari Komputer/HP' : 'Input URL Gambar'}
        </button>
      </div>

      {useUrlMode ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/foto.jpg"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
          >
            Terapkan
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={id || 'image-upload-input'}
          />

          {/* Preview or Dropzone */}
          {value ? (
            <div className="relative group shrink-0">
              <img
                src={value}
                alt="Preview"
                className={`${sizeClasses} object-cover border-2 border-amber-400/80 shadow-md bg-slate-100`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-white/90 text-slate-900 rounded-lg hover:bg-white transition"
                  title="Ganti Foto (JPG/JPEG)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 bg-rose-500/90 text-white rounded-lg hover:bg-rose-600 transition"
                  title="Hapus Foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                isDragging
                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                  : 'border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30 text-slate-600'
              } ${aspectRatio === 'cover' ? 'w-full h-28' : 'w-full sm:w-64 h-24'}`}
            >
              <Camera className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">
                Pilih / Tarik Foto (JPG/JPEG)
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Klik untuk upload dari perangkat
              </span>
            </div>
          )}

          {value && (
            <div className="flex-1 min-w-0 space-y-1 self-center">
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Foto Siap Digunakan (JPG/JPEG)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Foto akan otomatis tersinkronisasi ke profil, e-KTM / ID Card Digital, dan dokumen terkait.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                >
                  <Camera className="w-3 h-3 text-amber-600" />
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-semibold transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>
      )}

      {!errorMsg && !value && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
