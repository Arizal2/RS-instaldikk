import React, { useState, useEffect } from 'react';
import { Lecturer, Institution } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { GraduationCap, X, Save } from 'lucide-react';

interface LecturerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Lecturer, 'id'> | Partial<Lecturer>, id?: string) => void;
  initialData?: Lecturer | null;
  institutions: Institution[];
}

export const LecturerFormModal: React.FC<LecturerFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  institutions
}) => {
  const [formData, setFormData] = useState<Omit<Lecturer, 'id'>>({
    name: '',
    nidn: '',
    institutionId: institutions[0]?.id || '',
    institutionName: institutions[0]?.name || '',
    department: 'Keperawatan',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    supervisedStudents: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nidn: initialData.nidn || '',
        institutionId: initialData.institutionId || institutions[0]?.id || '',
        institutionName: initialData.institutionName || institutions[0]?.name || '',
        department: initialData.department || 'Keperawatan',
        phone: initialData.phone || '',
        email: initialData.email || '',
        avatar: initialData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        supervisedStudents: initialData.supervisedStudents || 0
      });
    } else {
      setFormData({
        name: '',
        nidn: '',
        institutionId: institutions[0]?.id || '',
        institutionName: institutions[0]?.name || '',
        department: 'Keperawatan',
        phone: '',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        supervisedStudents: 0
      });
    }
  }, [initialData, isOpen, institutions]);

  if (!isOpen) return null;

  const handleInstitutionChange = (instId: string) => {
    const found = institutions.find(i => i.id === instId);
    setFormData(prev => ({
      ...prev,
      institutionId: instId,
      institutionName: found ? found.name : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-slate-800 my-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Data Dosen Pembimbing' : 'Tambah Dosen Pembimbing Baru'}
              </h3>
              <p className="text-[11px] text-slate-400">Pembimbing Akademik Institusi Pendidikan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo in JPG/JPEG */}
          <ImageUploadField
            label="Foto Profil Dosen (JPG/JPEG/PNG)"
            value={formData.avatar}
            onChange={(imgData) => setFormData({ ...formData, avatar: imgData })}
            aspectRatio="avatar"
            helperText="Format: JPG, JPEG, atau PNG untuk foto profil dosen pembimbing"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Dr. Ns. Yuliana Triastuti, M.Kep"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIDN / NIP *</label>
              <input
                type="text"
                required
                value={formData.nidn}
                onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                placeholder="Contoh: 1104088001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institusi / Universitas Asal</label>
              <select
                value={formData.institutionId}
                onChange={(e) => handleInstitutionChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Studi / Fakultas</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Fakultas Kedokteran - Keperawatan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0813-8899-7766"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Email Dosen</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="yuliana.triastuti@untan.ac.id"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              Simpan Data Dosen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
