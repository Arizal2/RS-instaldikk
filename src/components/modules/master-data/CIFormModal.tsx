import React, { useState, useEffect } from 'react';
import { ClinicalInstructor, PracticeRoom } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Stethoscope, X, Save } from 'lucide-react';

interface CIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ClinicalInstructor, 'id'> | Partial<ClinicalInstructor>, id?: string) => void;
  initialData?: ClinicalInstructor | null;
  rooms: PracticeRoom[];
}

export const CIFormModal: React.FC<CIFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  rooms
}) => {
  const [formData, setFormData] = useState<Omit<ClinicalInstructor, 'id'>>({
    name: '',
    nip: '',
    specialization: 'Keperawatan Medikal Bedah',
    department: 'Instalasi Rawat Inap & ICU',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1594824813590-78536f90ff8a?w=150&auto=format&fit=crop&q=80',
    roomId: rooms[0]?.id || '',
    roomName: rooms[0]?.name || '',
    activeStudents: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nip: initialData.nip || '',
        specialization: initialData.specialization || 'Keperawatan Medikal Bedah',
        department: initialData.department || 'Instalasi Rawat Inap & ICU',
        phone: initialData.phone || '',
        email: initialData.email || '',
        avatar: initialData.avatar || 'https://images.unsplash.com/photo-1594824813590-78536f90ff8a?w=150&auto=format&fit=crop&q=80',
        roomId: initialData.roomId || rooms[0]?.id || '',
        roomName: initialData.roomName || rooms[0]?.name || '',
        activeStudents: initialData.activeStudents || 0
      });
    } else {
      setFormData({
        name: '',
        nip: '',
        specialization: 'Keperawatan Medikal Bedah',
        department: 'Instalasi Rawat Inap & ICU',
        phone: '',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1594824813590-78536f90ff8a?w=150&auto=format&fit=crop&q=80',
        roomId: rooms[0]?.id || '',
        roomName: rooms[0]?.name || '',
        activeStudents: 0
      });
    }
  }, [initialData, isOpen, rooms]);

  if (!isOpen) return null;

  const handleRoomChange = (rId: string) => {
    const found = rooms.find(r => r.id === rId);
    setFormData(prev => ({
      ...prev,
      roomId: rId,
      roomName: found ? found.name : ''
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
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Data Clinical Instructor (CI)' : 'Tambah Clinical Instructor Baru'}
              </h3>
              <p className="text-[11px] text-slate-400">Pembimbing Klinik RS TK II Kartika Husada</p>
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
            label="Foto Profil CI (JPG/JPEG/PNG)"
            value={formData.avatar}
            onChange={(imgData) => setFormData({ ...formData, avatar: imgData })}
            aspectRatio="avatar"
            helperText="Format: JPG, JPEG, atau PNG (Maks 5MB) untuk foto profil dan e-KTM / ID Card"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Ns. Siti Rahmawati, S.Kep., M.Kep"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP / NRP / NIK *</label>
              <input
                type="text"
                required
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                placeholder="Contoh: 19850412 200812 2 003"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ruangan / Stase Utama</label>
              <select
                value={formData.roomId}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Spesialisasi / Keahlian</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Contoh: Kritis / ICU / Kardiovaskular"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Departemen / Instalasi</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Instalasi Pendidikan / Rawat Inap"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812-3456-7890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ci.siti@rskartikahusada.com"
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
              Simpan Data CI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
