import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  Calendar,
  Building2,
  Users,
  Award,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { students, institutions, rooms, documents, evaluations, showToast } = useApp();

  const [selectedInst, setSelectedInst] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2026');
  const [reportType, setReportType] = useState<'rekap_nilai' | 'kehadiran' | 'sebaran'>('rekap_nilai');

  const filteredStudents = students.filter(s => {
    return selectedInst === 'all' || s.institutionName.includes(selectedInst);
  });

  const institutionStats = [
    { name: 'UNTAN Pontianak', students: 18, avgScore: 88.5, color: '#0B192C' },
    { name: 'Poltekkes Kemenkes', students: 14, avgScore: 87.2, color: '#1E3E62' },
    { name: 'STIKES Yarsi', students: 10, avgScore: 86.8, color: '#D4AF37' }
  ];

  const handleExportExcel = () => {
    showToast('Ekspor Berhasil', 'Data Rekap Laporan e-Instaldik RSKH berhasil diunduh format .XLSX', 'success');
  };

  const handleExportPdf = () => {
    showToast('Cetak Laporan', 'Dokumen Berita Acara Rekapitulasi Nilai Stase siap dicetak / PDF', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              LAPORAN & ANALITIK
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Laporan Eksekutif & Rekapitulasi Nilai</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data agregat capaian kompetensi klinik, tingkat kelulusan, dan rekapitulasi penilaian mahasiswa RS TK II Kartika Husada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value as any)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-[#0B192C]"
          >
            <option value="rekap_nilai">Rekapitulasi Nilai Akhir Stase</option>
            <option value="kehadiran">Rekapitulasi Presensi & Kehadiran</option>
            <option value="sebaran">Sebaran Mahasiswa per Institusi</option>
          </select>

          <select
            value={selectedInst}
            onChange={e => setSelectedInst(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">Semua Institusi Kampus</option>
            {institutions.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
          </select>

          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="2026">Tahun Akademik 2025/2026</option>
            <option value="2025">Tahun Akademik 2024/2025</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          Menampilkan: {filteredStudents.length} Mahasiswa
        </span>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-[#0B192C] mb-1">Rata-rata Nilai Akhir per Institusi Mitra</h3>
          <p className="text-xs text-slate-500 mb-4">Gabungan nilai Pre-Test, Askep, SOAP, dan Ujian Akhir Stase</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={institutionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avgScore" name="Rata-rata Nilai" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0B192C] mb-1">Distribusi Peserta Didik</h3>
            <p className="text-xs text-slate-500 mb-4">Sebaran kuota aktif di RSKH</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={institutionStats}
                    dataKey="students"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={40}
                    paddingAngle={4}
                  >
                    {institutionStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3 text-xs">
            {institutionStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{item.students} Mhs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
            Tabel Rekapitulasi Nilai dan Kelulusan Praktik Klinik
          </h3>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Terverifikasi Instaldik RSKH
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">NIM / Nama Mahasiswa</th>
                <th className="p-3">Institusi Asal</th>
                <th className="p-3">Stase / Ruangan</th>
                <th className="p-3 text-center">Pre-Test</th>
                <th className="p-3 text-center">Tugas & Askep</th>
                <th className="p-3 text-center">Post-Test</th>
                <th className="p-3 text-center">Nilai Akhir</th>
                <th className="p-3 text-center">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std, idx) => {
                const preTest = 85 + (idx % 10);
                const taskScore = 88 + (idx % 8);
                const postTest = 90 + (idx % 6);
                const finalScore = Number(((preTest * 0.2) + (taskScore * 0.4) + (postTest * 0.4)).toFixed(1));
                const isPass = finalScore >= 75;

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{std.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NIM: {std.nim}</div>
                    </td>
                    <td className="p-3 text-slate-600">{std.institutionName}</td>
                    <td className="p-3 font-semibold text-[#0B192C]">{std.roomName}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{preTest}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{taskScore}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">{postTest}</td>
                    <td className="p-3 text-center font-mono font-extrabold text-amber-600 text-sm">
                      {finalScore}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPass ? 'LULUS (A)' : 'REMEDIAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
