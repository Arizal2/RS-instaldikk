import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { HospitalLogo } from '../common/HospitalLogo';
import {
  Printer,
  X,
  Hospital,
  ShieldCheck,
  Filter,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const BatchCardPrintModal: React.FC = () => {
  const {
    batchPrintModal,
    closeBatchPrint,
    students,
    institutions,
    studyPrograms,
    rooms,
    logActivity
  } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>('ALL');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>(batchPrintModal.selectedStudentIds || []);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedInstId !== 'ALL' && s.institutionId !== selectedInstId) return false;
      if (selectedRoomId !== 'ALL' && s.roomId !== selectedRoomId) return false;
      return true;
    });
  }, [students, selectedInstId, selectedRoomId]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const studentsToPrint = students.filter(s => selectedIds.includes(s.id));

  const handlePrint = () => {
    logActivity('PRINT_MASSAL_KARTU', `${studentsToPrint.length} Mahasiswa`, `Cetak massal kartu tanda pengenal praktik klinik`);
    window.print();
  };

  if (!batchPrintModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn print:p-0 print:bg-white">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-5xl w-full shadow-2xl text-slate-100 max-h-[92vh] flex flex-col print:border-none print:shadow-none print:max-w-none print:w-full print:bg-white print:text-black">
        {/* Modal Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cetak Massal Kartu Digital Mahasiswa Praktik
              </h3>
              <p className="text-xs text-slate-400">
                Format lembar cetak standar A4 (Ready for ID Badge Card Holder 85x54mm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={studentsToPrint.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              Cetak {studentsToPrint.length} Kartu
            </button>
            <button
              onClick={closeBatchPrint}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls (Hidden on Print) */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Semua Institusi Kampus</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>

            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Semua Ruangan Stase</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleSelectAll}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
          >
            {selectedIds.length === filteredStudents.length ? (
              <CheckSquare className="w-4 h-4 text-amber-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            Pilih Semua ({filteredStudents.length} Mahasiswa)
          </button>
        </div>

        {/* Printable Grid of Cards */}
        <div className="flex-1 overflow-y-auto pr-1 print:overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-4">
            {filteredStudents.map(student => {
              const isSelected = selectedIds.includes(student.id);

              return (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`relative rounded-2xl p-4 transition cursor-pointer border select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0a192f] via-[#102a4e] to-[#0a192f] text-white border-amber-500/80 shadow-lg'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 opacity-60'
                  } print:bg-slate-900 print:text-white print:border-slate-800 print:opacity-100`}
                >
                  {/* Selection Checkbox on preview */}
                  <div className="absolute top-3 right-3 print:hidden">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2 mb-2.5">
                    <HospitalLogo variant="emblem" size="xs" />
                    <div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider leading-none">
                        RS TK II KARTIKA HUSADA
                      </div>
                      <div className="text-[8px] text-slate-300">Instaldik • Kesdam XII/Tpr</div>
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="flex gap-3.5 items-center">
                    <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20 shrink-0 bg-slate-800">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{student.name}</h4>
                      <div className="text-[11px] font-mono text-amber-300 font-semibold">NIM: {student.nim}</div>
                      <div className="text-[10px] text-slate-300 truncate font-medium">{student.studyProgram}</div>
                      <div className="text-[9px] text-slate-400 truncate">{student.institutionName}</div>
                    </div>
                  </div>

                  {/* Stase & QR Barcode */}
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase">Ruangan Stase:</div>
                      <div className="text-[10px] font-semibold text-slate-100 truncate max-w-[140px]">
                        {student.roomName}
                      </div>
                      <div className="text-[8px] font-mono text-amber-400 mt-0.5">{student.cardNumber}</div>
                    </div>

                    <div className="bg-white p-1 rounded-md shadow flex items-center justify-center">
                      <QRCodeSVG
                        value={student.qrCodeToken}
                        size={42}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
