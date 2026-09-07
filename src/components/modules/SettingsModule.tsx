import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Shield,
  User,
  KeyRound,
  Bell,
  Palette,
  CheckCircle2,
  Save,
  Globe,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentUser, currentRole, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'hospital' | 'security'>('hospital');

  // User Profile Form
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPhone, setUserPhone] = useState('+62 812-5567-8901');

  // Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profil Disimpan', 'Informasi akun profil berhasil diperbarui.', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Gagal Mengubah Password', 'Konfirmasi password baru tidak cocok.', 'warning');
      return;
    }
    showToast('Password Diperbarui', 'Kata sandi keamanan akun Anda berhasil diganti.', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              KONFIGURASI
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Pengaturan Sistem & Profil Instaldik</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Informasi kelembagaan RS TK II Kartika Husada, akun pengguna, keamanan sandi, dan preferensi portal.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('hospital')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'hospital'
              ? 'bg-[#0B192C] text-amber-400 font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Profil RS TK II Kartika Husada</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#0B192C] text-amber-400 font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Pengguna Saya</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-[#0B192C] text-amber-400 font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Keamanan & Sandi</span>
        </button>
      </div>

      {/* Hospital Profile Section */}
      {activeTab === 'hospital' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0B192C] flex items-center justify-center text-amber-400 shadow-md">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800">
                    AKREDITASI PARIPURNA (LAFKI / STARKES)
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0B192C] mt-1">
                    Rumah Sakit TK II Kartika Husada (RSKH)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instalasi Pendidikan dan Pelatihan Kesehatan (Instaldik) Terakreditasi
                  </p>
                </div>
              </div>
            </div>

            {/* Visi Misi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h3 className="font-bold text-[#0B192C] text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Visi Pendidikan RSKH</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  "Menjadi Rumah Sakit Pendidikan Utama yang unggul, profesional, beretika luhur, dan berdaya saing tinggi dalam mencetak tenaga kesehatan klinis yang kompeten di Kalimantan Barat."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h3 className="font-bold text-[#0B192C] text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Misi Mutu Bimbingan</span>
                </h3>
                <ul className="text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Menyelenggarakan bimbingan klinis terpadu berbasis Patient Safety.</li>
                  <li>Meningkatkan kompetensi Clinical Instructor yang tersertifikasi.</li>
                  <li>Menyediakan sarana wahana praktik, CBT, dan perpustakaan klinis modern.</li>
                </ul>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Alamat Instaldik</div>
                  <div className="text-slate-500 text-[11px]">Kubu Raya, Pontianak, Kalbar</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Hotline Bimbingan</div>
                  <div className="text-slate-500 text-[11px] font-mono">(0561) 771234 / ext. 108</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Email Instaldik</div>
                  <div className="text-slate-500 text-[11px] font-mono">instaldik@rskartikahusada.mil.id</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-[#0B192C]">Data Diri Akun Pengguna</h3>
            <p className="text-slate-500 mt-0.5">Informasi profil yang terdaftar dalam sistem e-Instaldik.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="flex items-center gap-4 pb-2">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                <div className="text-slate-500 uppercase font-mono text-[10px]">Role: {currentRole}</div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
              <input
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp / Kontak</label>
              <input
                type="text"
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0B192C] text-amber-400 font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security & Password Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-xl space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-[#0B192C]">Perbarui Kata Sandi</h3>
            <p className="text-slate-500 mt-0.5">Gunakan kombinasi minimal 8 karakter huruf dan angka.</p>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kata Sandi Lama</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0B192C] text-amber-400 font-bold flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ubah Kata Sandi</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
