import React, { useState, useEffect } from 'react';
import { Student, Institution, StudyProgram, PracticeRoom, ClinicalInstructor, Lecturer } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Users, X, Save, IdCard } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Student, 'id'> | Partial<Student>, id?: string) => void;
  initialData?: Student | null;
  institutions: Institution[];
  studyPrograms: StudyProgram[];
  rooms: PracticeRoom[];
  clinicalInstructors: ClinicalInstructor[];
  lecturers: Lecturer[];
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  institutions,
  studyPrograms,
  rooms,
  clinicalInstructors,
  lecturers
}) => {
  const [formData, setFormData] = useState<any>({
    nim: '',
    nik: '',
    name: '',
    nickname: '',
    gender: 'Laki-laki',
    birthPlace: 'Pontianak',
    birthDate: '2001-01-01',
    address: '',
    institutionId: institutions[0]?.id || '',
    institutionName: institutions[0]?.name || '',
    faculty: 'Fakultas Kedokteran',
    studyProgram: 'Profesi Ners',
    educationLevel: 'Profesi Ners',
    semester: 7,
    academicYear: '2025/2026 Ganjil',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    registrationNumber: '',
    periodStart: '2026-09-01',
    periodEnd: '2026-11-30',
    roomId: rooms[0]?.id || '',
    roomName: rooms[0]?.name || '',
    practiceGroup: 'Kelompok A',
    ciId: clinicalInstructors[0]?.id || '',
    ciName: clinicalInstructors[0]?.name || '',
    lecturerId: lecturers[0]?.id || '',
    lecturerName: lecturers[0]?.name || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        institutionId: initialData.institutionId || institutions[0]?.id || '',
        roomId: initialData.roomId || rooms[0]?.id || '',
        ciId: initialData.ciId || clinicalInstructors[0]?.id || '',
        lecturerId: initialData.lecturerId || lecturers[0]?.id || ''
      });
    } else {
      const defaultInst = institutions[0];
      const defaultRoom = rooms[0];
      const defaultCi = clinicalInstructors[0];
      const defaultLec = lecturers[0];

      setFormData({
        nim: '',
        nik: '',
        name: '',
        nickname: '',
        gender: 'Laki-laki',
        birthPlace: 'Pontianak',
        birthDate: '2001-01-01',
        address: '',
        institutionId: defaultInst?.id || '',
        institutionName: defaultInst?.name || 'Universitas Tanjungpura',
        faculty: 'Fakultas Kedokteran',
        studyProgram: 'Profesi Ners',
        educationLevel: 'Profesi Ners',
        semester: 7,
        academicYear: '2025/2026 Ganjil',
        phone: '',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        registrationNumber: `REG-RSKH-${Date.now().toString().slice(-6)}`,
        periodStart: '2026-09-01',
        periodEnd: '2026-11-30',
        roomId: defaultRoom?.id || '',
        roomName: defaultRoom?.name || 'Intensive Care Unit (ICU)',
        practiceGroup: 'Kelompok A',
        ciId: defaultCi?.id || '',
        ciName: defaultCi?.name || 'Ns. Siti Rahmawati, M.Kep',
        lecturerId: defaultLec?.id || '',
        lecturerName: defaultLec?.name || 'Dr. Ns. Yuliana Triastuti, M.Kep'
      });
    }
  }, [initialData, isOpen, institutions, rooms, clinicalInstructors, lecturers]);

  if (!isOpen) return null;

  // Filter prodi based on selected institution if matching, or show all
  const availableStudyPrograms = studyPrograms.filter(
    sp => !formData.institutionId || sp.institutionId === formData.institutionId
  );

  const handleInstitutionChange = (instId: string) => {
    const foundInst = institutions.find(i => i.id === instId);
    const relatedProdis = studyPrograms.filter(sp => sp.institutionId === instId);
    const firstProdi = relatedProdis[0]?.name || formData.studyProgram;
    const firstLevel = relatedProdis[0]?.degree || formData.educationLevel;

    setFormData((prev: any) => ({
      ...prev,
      institutionId: instId,
      institutionName: foundInst ? foundInst.name : prev.institutionName,
      studyProgram: firstProdi,
      educationLevel: firstLevel
    }));
  };

  const handleRoomChange = (rId: string) => {
    const found = rooms.find(r => r.id === rId);
    setFormData((prev: any) => ({
      ...prev,
      roomId: rId,
      roomName: found ? found.name : prev.roomName
    }));
  };

  const handleCIChange = (cId: string) => {
    const found = clinicalInstructors.find(c => c.id === cId);
    setFormData((prev: any) => ({
      ...prev,
      ciId: cId,
      ciName: found ? found.name : prev.ciName
    }));
  };

  const handleLecturerChange = (lId: string) => {
    const found = lecturers.find(l => l.id === lId);
    setFormData((prev: any) => ({
      ...prev,
      lecturerId: lId,
      lecturerName: found ? found.name : prev.lecturerName
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nim.trim() || !formData.name.trim()) return;
    onSave(formData, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-slate-800 my-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'Edit Data Mahasiswa Praktik' : 'Pendaftaran Mahasiswa Praktik Baru'}
              </h3>
              <p className="text-[11px] text-slate-400">Instalasi Pendidikan RS TK II Kartika Husada</p>
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
            label="Foto Resmi Mahasiswa (JPG/JPEG/PNG)"
            value={formData.avatar}
            onChange={(imgData) => setFormData({ ...formData, avatar: imgData })}
            aspectRatio="avatar"
            helperText="Format: JPG atau JPEG berlatar belakang rapi untuk cetak Kartu Mahasiswa Praktik (e-KTM)"
          />

          {/* 1. Data Diri */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs">1. Identitas Pribadi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Induk Mahasiswa (NIM) *</label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  placeholder="Contoh: I1031201099"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit KTP):</label>
                <input
                  type="text"
                  value={formData.nik || ''}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="617101..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Lengkap Sesuai Ijazah"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Panggilan:</label>
                <input
                  type="text"
                  value={formData.nickname || ''}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Contoh: Sarah"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin:</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Email Mahasiswa:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@untan.ac.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Institusi & Prodi */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs">2. Institusi Asal & Program Studi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institusi Kampus Asal *</label>
                <select
                  value={formData.institutionId}
                  onChange={(e) => handleInstitutionChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                >
                  {institutions.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Studi (Prodi) *</label>
                {availableStudyPrograms.length > 0 ? (
                  <select
                    value={formData.studyProgram}
                    onChange={(e) => {
                      const selected = availableStudyPrograms.find(sp => sp.name === e.target.value);
                      setFormData({
                        ...formData,
                        studyProgram: e.target.value,
                        educationLevel: selected?.degree || formData.educationLevel
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {availableStudyPrograms.map(sp => (
                      <option key={sp.id} value={sp.name}>{sp.name} - {sp.degree}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.studyProgram}
                    onChange={(e) => setFormData({ ...formData, studyProgram: e.target.value })}
                    placeholder="Contoh: Profesi Ners"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenjang Pendidikan:</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
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
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester:</label>
                <input
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Penugasan Stase */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs">3. Penempatan Stase & Pembimbing RSKH</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruangan Stase:</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => handleRoomChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Instructor (CI):</label>
                <select
                  value={formData.ciId}
                  onChange={(e) => handleCIChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                >
                  {clinicalInstructors.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dosen Pembimbing Kampus:</label>
                <select
                  value={formData.lecturerId}
                  onChange={(e) => handleLecturerChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 bg-white"
                >
                  {lecturers.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelompok Praktik:</label>
                <input
                  type="text"
                  value={formData.practiceGroup}
                  onChange={(e) => setFormData({ ...formData, practiceGroup: e.target.value })}
                  placeholder="Kelompok A / Shift Pagi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai:</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Selesai:</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
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
              {initialData ? 'Simpan Perubahan' : 'Simpan & Daftarkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
