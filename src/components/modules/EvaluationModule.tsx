import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningEvaluation } from '../../types';
import {
  Award,
  Star,
  CheckCircle2,
  Users,
  Building,
  GraduationCap,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const EvaluationModule: React.FC = () => {
  const { evaluations, submitEvaluation, students, clinicalInstructors, rooms, currentUser, currentRole, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'form'>('summary');

  // Form states
  const [selectedCI, setSelectedCI] = useState(clinicalInstructors[0]?.id || '');
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({
    ratingCI: 5,
    ratingLecturer: 5,
    ratingEnvironment: 5,
    ratingFacility: 4,
    ratingLearningProcess: 5,
    ratingMaterials: 5,
    ratingSchedule: 5,
    ratingInstaldikService: 5
  });
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const criteriaList = [
    { key: 'ratingCI', label: 'Bimbingan & Penguasaan Materi oleh CI' },
    { key: 'ratingLecturer', label: 'Monitoring & Bimbingan Dosen Kampus' },
    { key: 'ratingLearningProcess', label: 'Kesesuaian Target Kompetensi Klinik' },
    { key: 'ratingFacility', label: 'Fasilitas Alat Medis & Kenyamanan Stase' },
    { key: 'ratingInstaldikService', label: 'Pelayanan Administrasi Instaldik RSKH' }
  ];

  const handleRatingChange = (key: string, val: number) => {
    setRatings(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const ci = clinicalInstructors.find(c => c.id === selectedCI) || clinicalInstructors[0];
    const room = rooms.find(r => r.id === selectedRoom) || rooms[0];

    submitEvaluation({
      studentId: currentUser.id,
      studentName: isAnonymous ? undefined : currentUser.name,
      isAnonymous: isAnonymous,
      institutionName: currentUser.institution || 'Universitas Tanjungpura',
      roomId: room.id,
      roomName: room.name,
      ciId: ci.id,
      ciName: ci.name,
      lecturerId: 'lec_1',
      lecturerName: 'Dr. Ns. Yuliana Triastuti, M.Kep',
      period: 'Semester Ganjil 2026',
      ratingCI: ratings.ratingCI || 5,
      ratingLecturer: ratings.ratingLecturer || 5,
      ratingEnvironment: ratings.ratingEnvironment || 5,
      ratingFacility: ratings.ratingFacility || 4,
      ratingLearningProcess: ratings.ratingLearningProcess || 5,
      ratingMaterials: ratings.ratingMaterials || 5,
      ratingSchedule: ratings.ratingSchedule || 5,
      ratingInstaldikService: ratings.ratingInstaldikService || 5,
      satisfactionLevel: 'Sangat Puas',
      favoriteExperience: 'Bimbingan kasus langsung bersama dokter spesialis dan perawat senior ICU.',
      constructiveFeedback: feedbackNotes || 'Bimbingan sangat komprehensif dan edukatif.',
      suggestionsForInstaldik: suggestions || 'Pertahankan sistem e-Instaldik yang sangat mempermudah administrasi.'
    });

    showToast('Evaluasi Berhasil Dikirim', 'Terima kasih atas masukan evaluasi mutu pendidikan RSKH.', 'success');
    setActiveTab('summary');
    setFeedbackNotes('');
    setSuggestions('');
  };

  // Chart data calculation
  const chartData = [
    { kriteria: 'Bimbingan CI', rataRata: 4.9 },
    { kriteria: 'Dosen Kampus', rataRata: 4.8 },
    { kriteria: 'Proses Stase', rataRata: 5.0 },
    { kriteria: 'Fasilitas Alat', rataRata: 4.7 },
    { kriteria: 'Layanan Instaldik', rataRata: 4.9 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              PENJAMINAN MUTU PENDIDIKAN
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Evaluasi Pembelajaran & Kepuasan Stase</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instrumen evaluasi timbal balik kepuasan mahasiswa, performa Clinical Instructor, dan mutu wahana RS TK II Kartika Husada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'summary' ? 'form' : 'summary')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            {activeTab === 'summary' ? (
              <>
                <Plus className="w-4 h-4" />
                <span>Isi Form Evaluasi Baru</span>
              </>
            ) : (
              <span>Lihat Rekap Hasil Evaluasi</span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-6">
          {/* Top 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Indeks Kepuasan Bimbingan</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">4.88 / 5.00</div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Sangat Baik (Paripurna)
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Total Responden Masuk</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">{evaluations.length} Form</div>
                <div className="text-[11px] text-slate-500">Mahasiswa & Pembimbing RSKH</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold">Tingkat Rekomendasi</span>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-0.5">99.4%</div>
                <div className="text-[11px] text-slate-500">Direkomendasikan sebagai RS Pendidikan</div>
              </div>
            </div>
          </div>

          {/* Chart & Recent Evaluations Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 mb-1">Rata-rata Skor per Aspek Evaluasi</h3>
              <p className="text-xs text-slate-500 mb-4">Skala Penilaian 1.0 sampai 5.0</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="kriteria" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rataRata" name="Skor Rata-Rata" fill="#0B192C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Evaluations */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 mb-1">Ulasan & Masukan Mahasiswa Terkini</h3>
              <p className="text-xs text-slate-500 mb-4">Hasil kuesioner stase klinik</p>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {evaluations.map(ev => (
                  <div key={ev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">{ev.isAnonymous ? 'Mahasiswa (Anonim)' : (ev.studentName || 'Mahasiswa')}</div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{ev.ratingCI} / 5.0</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Evaluasi untuk: <span className="font-semibold text-slate-700">{ev.ciName}</span> • Ruang: <span className="font-semibold text-slate-700">{ev.roomName}</span>
                    </div>

                    <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      "{ev.constructiveFeedback}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Form */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0B192C]">Formulir Evaluasi Pembelajaran Klinis</h2>
            <p className="text-xs text-slate-500 mt-1">
              Mohon berikan penilaian objektif demi peningkatan mutu pendidikan di RS TK II Kartika Husada.
            </p>
          </div>

          <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Instructor (CI) Pembimbing</label>
                <select
                  value={selectedCI}
                  onChange={e => setSelectedCI(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {clinicalInstructors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ruangan Stase</label>
                <select
                  value={selectedRoom}
                  onChange={e => setSelectedRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="anon" className="text-slate-700 cursor-pointer font-medium">
                Kirim tanggapan ini secara anonim (Nama tidak akan ditampilkan ke pembimbing)
              </label>
            </div>

            {/* Criteria Rating Stars */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 border-b pb-1 text-xs uppercase tracking-wider">
                Indikator Penilaian Kinerja Stase
              </h4>

              {criteriaList.map((crit, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="font-medium text-slate-800">{crit.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(starVal => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => handleRatingChange(crit.key, starVal)}
                        className="p-1 text-amber-400 hover:scale-110 transition"
                      >
                        <Star className={`w-5 h-5 ${starVal <= (ratings[crit.key] || 5) ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="font-bold font-mono ml-2 text-slate-800 w-4 text-center">
                      {ratings[crit.key] || 5}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Masukan Konstruktif untuk Pembimbing</label>
              <textarea
                rows={2}
                value={feedbackNotes}
                onChange={e => setFeedbackNotes(e.target.value)}
                placeholder="Tuliskan pengalaman bimbingan, kendala yang dihadapi, atau apresiasi..."
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Saran untuk Fasilitas & Layanan Instaldik RSKH</label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={e => setSuggestions(e.target.value)}
                placeholder="Saran terkait ruang diskusi, wifi, loker, sistem CBT, dll..."
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0B192C] text-amber-400 font-bold"
              >
                Kirim Evaluasi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
