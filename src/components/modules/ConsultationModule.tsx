import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  Send,
  Paperclip,
  User,
  Stethoscope,
  BookOpen,
  GraduationCap,
  Sparkles,
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Search,
  ChevronRight
} from 'lucide-react';

export const ConsultationModule: React.FC = () => {
  const {
    currentUser,
    currentRole,
    chatMessages,
    sendMessage,
    clinicalInstructors,
    lecturers,
    students,
    openPdfViewer,
    showToast
  } = useApp();

  const [activeRecipientId, setActiveRecipientId] = useState<string>('ci_1');
  const [messageInput, setMessageInput] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Contacts list based on role
  const getContacts = () => {
    if (currentRole === 'mahasiswa') {
      return [
        { id: 'ci_1', name: 'Ns. Siti Rahmawati, M.Kep', roleDesc: 'Clinical Instructor (CI) ICU', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150', icon: Stethoscope },
        { id: 'ci_2', name: 'dr. Hendra Pratama, Sp.B', roleDesc: 'Clinical Instructor (CI) Bedah', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150', icon: Stethoscope },
        { id: 'lec_1', name: 'Dr. Ns. Yuliana Triastuti, M.Kep', roleDesc: 'Dosen Pembimbing UNTAN', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', icon: BookOpen },
        { id: 'admin_1', name: 'Instaldik RSKH (Sekretariat)', roleDesc: 'Admin Pelayanan Praktik', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150', icon: Sparkles }
      ];
    }

    if (currentRole === 'ci') {
      return students.map(std => ({
        id: std.id,
        name: std.name,
        roleDesc: `Mahasiswa • ${std.roomName} (${std.nim})`,
        avatar: std.avatar,
        icon: GraduationCap
      }));
    }

    if (currentRole === 'dosen') {
      return students.map(std => ({
        id: std.id,
        name: std.name,
        roleDesc: `Mahasiswa Bimbingan • ${std.studyProgram}`,
        avatar: std.avatar,
        icon: GraduationCap
      }));
    }

    // Admin view
    return [
      ...clinicalInstructors.map(c => ({ id: c.id, name: c.name, roleDesc: `CI ${c.department}`, avatar: c.avatar, icon: Stethoscope })),
      ...students.map(s => ({ id: s.id, name: s.name, roleDesc: `Mahasiswa ${s.roomName}`, avatar: s.avatar, icon: GraduationCap }))
    ];
  };

  const contacts = getContacts().filter(c => c.name.toLowerCase().includes(searchContact.toLowerCase()));
  const activeContact = contacts.find(c => c.id === activeRecipientId) || contacts[0];

  // Filter messages between current user and active recipient
  const currentChats = chatMessages.filter(
    m =>
      (m.senderId === currentUser.id && m.recipientId === activeContact?.id) ||
      (m.recipientId === currentUser.id && m.senderId === activeContact?.id) ||
      (m.recipientId === 'ci_1' && activeContact?.id === 'ci_1') ||
      (currentRole === 'admin')
  );

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChats.length, activeRecipientId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeContact) return;

    sendMessage(activeContact.id, messageInput.trim());

    setMessageInput('');
    showToast('Pesan Terkirim', `Pesan bimbingan dikirim ke ${activeContact.name}`, 'info');
  };

  const handleQuickTemplate = (text: string) => {
    setMessageInput(text);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              BIMBINGAN TERPADU
            </span>
            <h1 className="text-xl font-extrabold text-[#0B192C]">Konsultasi & Bimbingan Klinis</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ruang komunikasi langsung antara Mahasiswa Praktik, Clinical Instructor (CI), Dosen Pembimbing Kampus, dan Sekretariat Instaldik.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[75vh]">
        {/* Left Sidebar: Contact List */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchContact}
                onChange={e => setSearchContact(e.target.value)}
                placeholder="Cari kontak bimbingan..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {contacts.map(contact => {
              const isSelected = activeContact?.id === contact.id;
              const Icon = contact.icon;
              return (
                <div
                  key={contact.id}
                  onClick={() => setActiveRecipientId(contact.id)}
                  className={`p-3 transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                        <span>{contact.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <Icon className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{contact.roleDesc}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Chat Messages */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-100/60">
          {/* Chat Room Header */}
          {activeContact && (
            <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{activeContact.name}</h3>
                  <p className="text-[11px] text-slate-500">{activeContact.roleDesc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ● Online di Portal
                </span>
              </div>
            </div>
          )}

          {/* Quick Suggestions / Templates */}
          <div className="bg-white/80 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-semibold shrink-0">Template Cepat:</span>
            <button
              onClick={() => handleQuickTemplate('Selamat pagi Ns, mohon izin bimbingan kasus asuhan keperawatan pasien ICU untuk shift pagi.')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 whitespace-nowrap transition border border-slate-200"
            >
              Izin Bimbingan Askep
            </button>
            <button
              onClick={() => handleQuickTemplate('Mohon izin Ns, laporan logbook dan SOAP revisi nomor 3 sudah saya unggah di menu dokumen.')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 whitespace-nowrap transition border border-slate-200"
            >
              Konfirmasi Revisi Logbook
            </button>
            <button
              onClick={() => handleQuickTemplate('Izin bertanya mengenai prosedur dan SOP pemberian high-alert medication di ruangan.')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 whitespace-nowrap transition border border-slate-200"
            >
              Tanya SOP Tindakan
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {currentChats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300" />
                <p>Belum ada riwayat pesan. Ketik pesan bimbingan pertama Anda di bawah.</p>
              </div>
            ) : (
              currentChats.map(msg => {
                const isMe = msg.senderId === currentUser.id || msg.senderRole === currentRole;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 mb-1 px-1">
                      {msg.senderName} ({msg.senderRole.toUpperCase()}) • {msg.timestamp}
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl shadow-sm space-y-2 ${
                        isMe
                          ? 'bg-[#0B192C] text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {msg.attachment && (
                        <div
                          onClick={() => openPdfViewer(msg.attachment?.name || 'Lampiran', msg.attachment?.url || '', 'pdf', 'Lampiran Kasus', msg.senderName)}
                          className={`p-2 rounded-xl flex items-center gap-2 cursor-pointer transition text-xs ${
                            isMe ? 'bg-slate-800 text-amber-300 hover:bg-slate-700' : 'bg-slate-100 text-blue-700 hover:bg-slate-200'
                          }`}
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="font-semibold underline truncate">{msg.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const fileName = 'Laporan_Kasus_ICU_Revisi.pdf';
                sendMessage(activeContact?.id || 'ci_1', 'Berikut terlampir dokumen revisi asuhan keperawatan klinis saya:', {
                  name: fileName,
                  url: 'https://example.com/mock.pdf',
                  size: '1.8 MB',
                  type: 'application/pdf'
                });
                showToast('Lampiran Terkirim', `Berkas ${fileName} berhasil dilampirkan.`, 'success');
              }}
              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-xl transition"
              title="Lampirkan Dokumen Kasus (PDF/DOCX)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder={`Tulis pesan konsultasi untuk ${activeContact?.name || 'pembimbing'}...`}
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-4 py-2.5 bg-[#0B192C] hover:bg-slate-800 disabled:opacity-40 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
