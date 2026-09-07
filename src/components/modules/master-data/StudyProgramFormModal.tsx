import React, { useState, useEffect } from 'react';
import { StudyProgram, Institution } from '../../../types';
import { GraduationCap, X, Save } from 'lucide-react';

interface StudyProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<StudyProgram, 'id'> | Partial<StudyProgram>, id?: string) => void;
  initialData?: StudyProgram | null;
  institutions: Institution[];
}

export const StudyProgramFormModal: React.FC<StudyProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  institutions
}) => {
  const [formData, setFormData] = useState<Omit<StudyProgram, 'id'>>({
    name: '',
    degree: 'Profesi Ners',
    institutionId: institutions[0]?.id || '',
    institutionName: institutions[0]?.name || '',
    code: '',
    accreditation: 'Unggul',
    durationSemester: 2,
    activeStudents: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        degree: initialData.degree || 'Profesi Ners',
        institutionId: initialData.institutionId || institutions[0]?.id || '',
        institutionName: initialData.institutionName || institutions[0]?.name || '',
        code: initialData.code || '',
        accreditation: initialData.accreditation || 'Unggul',
        durationSemester: initialData.durationSemester || 2,
        activeStudents: initialData.activeStudents || 0
      });
    } else {
      setFormData({
        name: '',
        degree: 'Profesi Ners',
        institutionId: institutions[0]?.id || '',
        institutionName: institutions[0]?.name || '',
        code: '',
        accreditation: 'Unggul',
        durationSemester: 2,
        activeStudents: 0
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
                {initialData ? 'Edit Program Studi (Prodi)' : 'Tambah Program Studi Baru'}
              </h3>
              <p className="text-[11px] text-slate-400">Master Data Jurusan & Jenjang Pendidikan</p>
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
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institusi / Kampus Induk *</label>
            <select
              required
              value={formData.institutionId}
              onChange={(e) => handleInstitutionChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Program Studi *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Pendidikan Profesi Ners, S1 Keperawatan, D3 Kebidanan"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenjang Pendidikan</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
              >
                <option value="Profesi Ners">Profesi Ners</option>
                <option value="Profesi Dokter">Profesi Dokter (Co-Ass)</option>
                <option value="S1 Keperawatan">S1 Keperawatan</option>
                <option value="D3 Kebidanan">D3 Kebidanan</option>
                <option value="D4 Kebidanan">D4 Kebidanan</option>
                <option value="D3 Keperawatan">D3 Keperawatan</option>
                <option value="D3 Farmasi">D3 Farmasi</option>
                <option value="D3 Radiologi">D3 Radiologi</option>
                <option value="D3 Analis Kesehatan">D3 Analis Kesehatan / TLM</option>
                <option value="S2 Keperawatan">S2 Keperawatan / Kesehatan</option>
                <option value="Spesialis">Pendidikan Dokter Spesialis</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Prodi</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Contoh: NERS-01"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Akreditasi Prodi</label>
              <select
                value={formData.accreditation || 'Unggul'}
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Durasi Stase (Semester / Bulan)</label>
              <input
                type="number"
                value={formData.durationSemester || 2}
                onChange={(e) => setFormData({ ...formData, durationSemester: parseInt(e.target.value) || 1 })}
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
              Simpan Data Program Studi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
