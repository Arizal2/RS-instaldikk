import React, { useState, useEffect } from 'react';
import { Institution } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Building2, X, Save } from 'lucide-react';

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Institution, 'id'> | Partial<Institution>, id?: string) => void;
  initialData?: Institution | null;
}

export const InstitutionFormModal: React.FC<InstitutionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Omit<Institution, 'id'>>({
    name: '',
    code: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    accreditation: 'Unggul',
    mouNumber: '',
    mouExpiryDate: '2028-12-31',
    activeStudents: 0,
    totalAlumni: 0,
    logo: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        address: initialData.address || '',
        contactPerson: initialData.contactPerson || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        accreditation: initialData.accreditation || 'Unggul',
        mouNumber: initialData.mouNumber || '',
        mouExpiryDate: initialData.mouExpiryDate || '2028-12-31',
        activeStudents: initialData.activeStudents || 0,
        totalAlumni: initialData.totalAlumni || 0,
        logo: initialData.logo || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        address: '',
        contactPerson: '',
        phone: '',
        email: '',
        accreditation: 'Unggul',
        mouNumber: 'MOU/RSKH/' + new Date().getFullYear() + '/001',
        mouExpiryDate: '2028-12-31',
        activeStudents: 0,
        totalAlumni: 0,
        logo: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 text-slate-800 my-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Data Institusi / Kampus' : 'Tambah Institusi / Kampus Baru'}
              </h3>
              <p className="text-[11px] text-slate-400">Kerjasama Pendidikan RS TK II Kartika Husada</p>
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
          {/* Logo Upload in JPG/JPEG */}
          <ImageUploadField
            label="Logo Institusi / Kampus (JPG/JPEG/PNG)"
            value={formData.logo}
            onChange={(imgData) => setFormData({ ...formData, logo: imgData })}
            aspectRatio="logo"
            helperText="Format: JPG, JPEG, atau PNG untuk logo resmi universitas/institusi"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Institusi / Universitas *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Universitas Tanjungpura"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Institusi *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Contoh: UNTAN"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Akreditasi Kampus</label>
              <select
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="Unggul">Unggul (A)</option>
                <option value="Baik Sekali">Baik Sekali (B)</option>
                <option value="Baik">Baik (C)</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Kampus</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Prof. Dr. H. Hadari Nawawi, Pontianak"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kontak Person / PIC</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Dr. Ns. Yuliana / Dekan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. Telp / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0561-739630"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="fk@untan.ac.id"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Masa Berlaku MoU s/d</label>
              <input
                type="date"
                value={formData.mouExpiryDate}
                onChange={(e) => setFormData({ ...formData, mouExpiryDate: e.target.value })}
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
              Simpan Data Institusi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
