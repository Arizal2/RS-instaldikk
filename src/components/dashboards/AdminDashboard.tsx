import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Stethoscope,
  Building2,
  CalendarCheck,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  Award,
  ArrowUpRight,
  DoorOpen,
  ClipboardList,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    clinicalInstructors,
    lecturers,
    institutions,
    rooms,
    schedules,
    documents,
    evaluations,
    activityLogs,
    setCurrentView
  } = useApp();

  // Metrics
  const activeStudentsCount = students.filter(s => s.status === 'Aktif').length;
  const currentOngoingSchedules = schedules.filter(s => s.status === 'Sedang Berlangsung').length;
  const upcomingSchedules = schedules.filter(s => s.status === 'Akan Datang').length;
  const unreviewedDocs = documents.filter(d => d.reviewStatus === 'Menunggu Pemeriksaan').length;

  // Chart data: Distribution by Institution
  const institutionStats = institutions.map(inst => {
    const count = students.filter(s => s.institutionId === inst.id || s.institutionName === inst.name).length;
    return {
      name: inst.code,
      fullName: inst.name,
      jumlah: count || (inst.id === 'inst_1' ? 5 : inst.id === 'inst_2' ? 3 : 2)
    };
  });

  // Chart data: Room Occupancy
  const roomStats = rooms.map(r => ({
    name: r.code,
    ruangan: r.name,
    mahasiswa: r.currentStudentsCount,
    kapasitas: r.capacity
  }));

  // Monthly trend simulation
  const monthlyTrendData = [
    { bulan: 'Apr', peserta: 65, tugas: 140, evaluasi: 48 },
    { bulan: 'Mei', peserta: 78, tugas: 185, evaluasi: 62 },
    { bulan: 'Jun', peserta: 92, tugas: 210, evaluasi: 75 },
    { bulan: 'Jul', peserta: 84, tugas: 195, evaluasi: 70 },
    { bulan: 'Agu', peserta: 105, tugas: 260, evaluasi: 95 },
    { bulan: 'Sep', peserta: 114, tugas: 290, evaluasi: 104 }
  ];

  const COLORS = ['#0f172a', '#f59e0b', '#2563eb', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner - Sleek Dark #0f172a */}
      <div className="relative bg-[#0f172a] rounded-2xl p-6 sm:p-7 text-white shadow-lg overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Komando Administrasi Pendidikan RSKH</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Dashboard Instalasi Pendidikan (Instaldik)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitoring terpadu rotasi kepaniteraan klinik, supervisi Clinical Instructor, logbook mahasiswa, dan akreditasi STARKES RS TK II Kartika Husada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView('schedules')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Kelola Jadwal</span>
            </button>
            <button
              onClick={() => setCurrentView('reports')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Unduh Rekap Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sleek Stats Metric Cards with Progress Line Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Mahasiswa Aktif */}
        <div 
          onClick={() => setCurrentView('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Mahasiswa Aktif
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 font-mono">{activeStudentsCount}</span>
              <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                +12% bln ini
              </span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[78%] transition-all"></div>
          </div>
        </div>

        {/* Clinical Instructors (CI) */}
        <div 
          onClick={() => setCurrentView('ci')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Clinical Instructor (CI)
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 font-mono">{clinicalInstructors.length}</span>
              <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                10 Ruangan
              </span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0f172a] w-[90%] transition-all"></div>
          </div>
        </div>

        {/* Sedang Praktik Dinas */}
        <div 
          onClick={() => setCurrentView('schedules')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Praktik Sedang Berjalan
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-emerald-700 font-mono">{currentOngoingSchedules} Stase</span>
              <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                Shift Aktif
              </span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[65%] transition-all"></div>
          </div>
        </div>

        {/* Tugas Menunggu Review */}
        <div 
          onClick={() => setCurrentView('documents')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
              Tugas & Dokumen Masuk
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 font-mono">{documents.length}</span>
              <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">
                {unreviewedDocs} pending
              </span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[45%] transition-all"></div>
          </div>
        </div>
      </div>

      {/* Secondary 4 Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setCurrentView('institutions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Institusi Mitra</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{institutions.length} Kampus</div>
          </div>
          <Building2 className="w-6 h-6 text-purple-600 p-1 bg-purple-50 rounded-lg" />
        </div>

        <div 
          onClick={() => setCurrentView('lecturers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Dosen Pembimbing</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{lecturers.length} Dosen</div>
          </div>
          <Users className="w-6 h-6 text-blue-600 p-1 bg-blue-50 rounded-lg" />
        </div>

        <div 
          onClick={() => setCurrentView('rooms')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Ruangan Praktik</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{rooms.length} Ruang</div>
          </div>
          <DoorOpen className="w-6 h-6 text-emerald-600 p-1 bg-emerald-50 rounded-lg" />
        </div>

        <div 
          onClick={() => setCurrentView('evaluations')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Evaluasi Masuk</span>
            <div className="text-xl font-bold text-slate-900 font-mono">{evaluations.length} Form</div>
          </div>
          <Award className="w-6 h-6 text-amber-600 p-1 bg-amber-50 rounded-lg" />
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Activity Trend */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tren Kegiatan & Rotasi Praktik Bulanan</h3>
              <p className="text-xs text-slate-500">Aktivitas mahasiswa, pengumpulan tugas, dan evaluasi</p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
              Tahun 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorPeserta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B192C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0B192C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTugas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="peserta" name="Mahasiswa Aktif" stroke="#0B192C" fillOpacity={1} fill="url(#colorPeserta)" />
                <Area type="monotone" dataKey="tugas" name="Tugas Masuk" stroke="#D4AF37" fillOpacity={1} fill="url(#colorTugas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institution Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Distribusi Asal Institusi</h3>
            <p className="text-xs text-slate-500">Persentase mahasiswa berdasarkan kampus</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={institutionStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="jumlah"
                >
                  {institutionStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
            {institutionStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-600 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.jumlah} Mhs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Occupancy Bar Chart + Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room Occupancy */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Kapasitas & Okupansi Ruangan Praktik</h3>
              <p className="text-xs text-slate-500">Jumlah mahasiswa aktif vs kuota maksimal ruangan</p>
            </div>
            <button
              onClick={() => setCurrentView('ruangan')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
            >
              Lihat Detail Ruangan →
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="mahasiswa" name="Terisi" fill="#0B192C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kapasitas" name="Kapasitas Maksimal" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Logs Feed */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Aktivitas Terkini (Audit Log)</h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Live System</span>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
              {activityLogs.slice(0, 5).map((log, index) => (
                <div key={log.id ? `${log.id}-${index}` : `log-${index}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800">{log.userName}</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 font-medium text-xs truncate">
                    {log.entity}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentView('pengaturan')}
              className="text-xs text-slate-500 hover:text-[#0B192C] font-semibold"
            >
              Buka Seluruh Riwayat Log Audit Sistem →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
