import React from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalIdCard } from './DigitalIdCard';
import { X } from 'lucide-react';

export const DigitalIdCardModal: React.FC = () => {
  const { digitalCardModal, closeDigitalCard } = useApp();

  if (!digitalCardModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col items-center">
        <button
          onClick={closeDigitalCard}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 text-center">
          <h3 className="text-base font-bold text-white">Kartu Tanda Pengenal Digital</h3>
          <p className="text-xs text-slate-400">RS TK II Kartika Husada • Instaldik</p>
        </div>

        <DigitalIdCard
          student={digitalCardModal.student}
          ci={digitalCardModal.ci}
          visitor={digitalCardModal.visitor}
        />
      </div>
    </div>
  );
};
