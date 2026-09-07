import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  Award,
  IdCard,
  QrCode,
  Save
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

export const UserProfileModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    updateUserProfile,
    activityLogs,
    students,
    clinicalInstructors,
    lecturers,
    openDigitalCard,
    showToast,
    logActivity
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security' | 'activity'>('profile');

  // Match corresponding sub-data if available
  const studentData = useMemo(() => {
    return students.find(s => s.email === currentUser.email || s.nim === currentUser.identifierNumber || s.name === currentUser.name);
  }, [students, currentUser]);

  const ciData = useMemo(() => {
    return clinicalInstructors.find(c => c.email === currentUser.email || c.nip === currentUser.identifierNumber || c.name === currentUser.name);
  }, [clinicalInstructors, currentUser]);

  const lecturerData = useMemo(() => {
    return lecturers.find(l => l.email === currentUser.email || l.nidn === currentUser.identifierNumber || l.name === currentUser.name);
  }, [lecturers, currentUser]);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || studentData?.phone || ciData?.phone || '',
    avatar: currentUser.avatar || studentData?.avatar || ciData?.avatar || '',
    nik: currentUser.nik || studentData?.nik || ciData?.nik || '',
    gender: currentUser.gender || studentData?.gender || ciData?.gender || 'Laki-laki',
    birthPlace: currentUser.birthPlace || studentData?.birthPlace || 'Pontianak',
    birthDate: currentUser.birthDate || studentData?.birthDate || '2001-01-01',
    address: currentUser.address || studentData?.address || 'Jl. Perdana No. 10, Pontianak',
    specialization: currentUser.specialization || ciData?.specialization || ''
  });

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sync state when currentUser changes
  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || studentData?.phone || ciData?.phone || '',
      avatar: currentUser.avatar || studentData?.avatar || ciData?.avatar || '',
      nik: currentUser.nik || studentData?.nik || ciData?.nik || '',
      gender: currentUser.gender || studentData?.gender || ciData?.gender || 'Laki-laki',
      birthPlace: currentUser.birthPlace || studentData?.birthPlace || 'Pontianak',
      birthDate: currentUser.birthDate || studentData?.birthDate || '2001-01-01',
      address: currentUser.address || studentData?.address || 'Jl. Perdana No. 10, Pontianak',
      specialization: currentUser.specialization || ciData?.specialization || ''
    });
  }, [currentUser, studentData, ciData]);

  // User's own activity logs
  const userLogs = useMemo(() => {
    return activityLogs.filter(log => log.userName === currentUser.name || log.userRole === currentUser.role);
  }, [activityLogs, currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, formData);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      showToast('Password Kosong', 'Masukkan password baru.', 'warning');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Password Tidak Cocok', 'Konfirmasi password baru tidak sesuai.', 'error');
      return;
    }

    logActivity('UBAH_PASSWORD', currentUser.name, 'Pengguna memperbarui password akun.');
    showToast('Password Berhasil Diubah', 'Kredensial keamanan akun Anda telah diperbarui.', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border border-slate-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentUser.email} • {currentUser.identifierNumber ? `ID/NIM: ${currentUser.identifierNumber}` : 'e-Instaldik RSKH'}
            </p>
          </div>
        </div>

        {/* Digital Card Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (studentData) openDigitalCard({ student: studentData });
              else if (ciData) openDigitalCard({ ci: ciData });
              else showToast('Info', 'Kartu Digital tersedia untuk Mahasiswa & CI.', 'info');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <IdCard className="w-4 h-4" />
            Buka Kartu Digital Saya
          </button>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6 border-b border-slate-200 px-6 pt-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Identitas Pribadi
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'academic'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Akademik & Stase RSKH
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Keamanan Akun
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            Riwayat Aktivitas
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
              {userLogs.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Personal Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Nomor Induk Kependudukan (NIK):</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="16 Digit NIK e-KTP"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Email Aktif:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Nomor Handphone / WhatsApp:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Tempat Lahir:</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Tanggal Lahir:</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Jenis Kelamin:</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <ImageUploadField
                  label="Foto Profil / Avatar (JPG/JPEG)"
                  value={formData.avatar}
                  onChange={(imgData) => setFormData({ ...formData, avatar: imgData })}
                  aspectRatio="avatar"
                  helperText="Format: JPG, JPEG, atau PNG (Maks 5MB) untuk foto profil dan e-KTM / ID Card"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">Alamat Domisili:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Academic & Assignment Information */}
        {activeTab === 'academic' && (
          <div className="p-6 sm:p-8 space-y-6 text-xs">
            {currentRole === 'mahasiswa' && studentData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Data Pendidikan & Kampus
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-slate-400 text-[10px]">Nomor Induk Mahasiswa (NIM):</div>
                      <div className="font-mono font-bold text-slate-800">{studentData.nim}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Institusi Asal:</div>
                      <div className="font-semibold text-amber-800">{studentData.institutionName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Fakultas / Program Studi:</div>
                      <div className="font-medium text-slate-800">{studentData.studyProgram}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Semester & Tahun Akademik:</div>
                      <div className="font-medium text-slate-800">Semester {studentData.semester} • {studentData.academicYear || '2025/2026'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Data Stase Praktik RSKH
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-slate-400 text-[10px]">No. Registrasi Praktik:</div>
                      <div className="font-mono font-bold text-slate-800">{studentData.registrationNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Ruangan Stase:</div>
                      <div className="font-bold text-slate-900">{studentData.roomName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Clinical Instructor (CI):</div>
                      <div className="font-medium text-slate-800">{studentData.ciName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Dosen Pembimbing Kampus:</div>
                      <div className="font-medium text-slate-800">{studentData.lecturerName}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Periode Stase:</div>
                      <div className="font-medium text-emerald-700 font-mono">{studentData.periodStart} s/d {studentData.periodEnd}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentRole === 'ci' && ciData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Informasi CI RSTK II Kartika Husada</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-slate-400 text-[10px]">NIP / NRP:</div>
                      <div className="font-mono font-bold text-slate-800">{ciData.nip}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Departemen / Instalasi:</div>
                      <div className="font-semibold text-slate-800">{ciData.department}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Bidang Spesialisasi:</div>
                      <div className="font-medium text-amber-800">{ciData.specialization}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-600">
                Data penugasan terdaftar pada instalasi pendidikan RS TK II Kartika Husada.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security & Password Form */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="p-6 sm:p-8 max-w-lg space-y-5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Password Saat Ini:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Password Baru:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter kombinasi"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Konfirmasi Password Baru:</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Ketik ulang password baru"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <KeyRound className="w-4 h-4" />
              Perbarui Password
            </button>
          </form>
        )}

        {/* Tab 4: User Activity Audit Log */}
        {activeTab === 'activity' && (
          <div className="p-6 sm:p-8">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Aktivitas</th>
                    <th className="px-4 py-3">Entitas / Modul</th>
                    <th className="px-4 py-3">Detail</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                        Belum ada riwayat aktivitas yang tercatat.
                      </td>
                    </tr>
                  ) : (
                    userLogs.map((log, index) => (
                      <tr key={log.id ? `${log.id}-${index}` : `log-${index}`} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-amber-700 font-medium">
                          {log.entity}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'failed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {log.status === 'failed' ? 'GAGAL' : 'SUKSES'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
