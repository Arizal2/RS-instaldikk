import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Clock,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Award,
  Trash2,
  Filter
} from 'lucide-react';

export const NotificationCenterModule: React.FC = () => {
  const { notifications, auditLogs, markNotificationAsRead, currentRole } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'document':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'evaluation':
        return <Award className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              PUSAT INFORMASI
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Pusat Notifikasi & Log Aktivitas</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Riwayat pemberitahuan penugasan dinas, verifikasi nilai stase, dan audit sistem e-Instaldik RSKH.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notifications Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-[#0B192C] flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Notifikasi Saya</span>
            </h3>
            <span className="text-xs text-slate-500">{notifications.length} Pemberitahuan</span>
          </div>

          <div className="space-y-2.5">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 text-xs ${
                  notif.isRead
                    ? 'bg-white border-slate-200 hover:bg-slate-50'
                    : 'bg-amber-50/60 border-amber-200 font-medium'
                }`}
              >
                <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs Column (Security & Compliance) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-[#0B192C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Log Audit Sistem</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              ISO 27001 / STARKES
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{log.userName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
                <div className="text-[11px] text-blue-700 font-medium">{log.action}</div>
                <div className="text-[10px] text-slate-500 font-mono">IP: {log.ipAddress}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
