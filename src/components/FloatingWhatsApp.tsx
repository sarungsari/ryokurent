import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Send, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { 
  OFFICIAL_WA_DISPLAY, 
  OFFICIAL_WA_NUMBER, 
  OFFICIAL_COMPANY_NAME,
  buildQuickInquiryLink,
  buildGeneralHelpLink
} from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickQuestions = [
    { label: '🛵 Cek Ketersediaan Motor Hari Ini', query: 'Halo Admin RyokouRent! Apakah ada motor yang ready untuk disewa hari ini di Malang / Batu?' },
    { label: '🚉 Antar ke Stasiun Malang Kotabaru', query: 'Halo Admin, bisa antar unit ke Stasiun Malang sekarang/nanti sore?' },
    { label: '📄 Syarat Sewa Mahasiswa & Wisatawan', query: 'Halo Admin, mau tanya persyaratan sewa motor untuk pelajar/mahasiswa/wisatawan apa saja ya?' },
    { label: '⛰️ Rekomendasi Motor Tanjakan Batu & Bromo', query: 'Halo Admin, rekomendasi motor paling cocok dan kuat untuk rute tanjakan Kota Batu atau Bromo apa ya?' },
  ];

  const handleSendCustom = (text: string) => {
    const url = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-[#0c162e] border border-sky-400/40 rounded-3xl shadow-2xl shadow-sky-950/80 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-sky-200">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c162e]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black font-['Outfit']">{OFFICIAL_COMPANY_NAME}</h4>
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">FAST</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-sky-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online • Respon Kilat &lt; 5 Menit ⚡</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Tutup chat WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3 bg-[#081024] max-h-80 overflow-y-auto">
            {/* Admin Message Bubble */}
            <div className="bg-[#101e3d] border border-sky-500/30 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-200 shadow-md leading-relaxed">
              <p className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                <span>Halo Sobat Ryokou! 👋</span>
                <span className="text-amber-300">✨</span>
              </p>
              <p>
                Siap seru-seruan liburan di Malang & Batu? Mau tanya stok motor ready, promo sewa, atau gratis antar ke Stasiun/Terminal/Hotel? Yuk tanya kami langsung!
              </p>
              <span className="text-[10px] text-sky-400/70 block text-right mt-1.5">Online Sekarang</span>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-sky-300/80 font-bold uppercase tracking-wider block">
                Pertanyaan Cepat (1-Klik):
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendCustom(q.query)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#0f1d3b] hover:bg-sky-950/80 border border-sky-800/40 hover:border-sky-400/60 text-xs text-slate-200 hover:text-sky-300 transition-all flex items-center justify-between group active:scale-98"
                >
                  <span className="truncate pr-2 font-medium">{q.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-[#0c162e] border-t border-sky-900/40 flex items-center justify-between">
            <span className="text-[11px] text-slate-300">
              WA Resmi: <strong className="text-sky-300">{OFFICIAL_WA_DISPLAY}</strong>
            </span>
            <button
              onClick={() => handleSendCustom('Halo Admin RyokouRent, saya ingin konsultasi sewa motor di Malang & Kota Batu.')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 flex items-center gap-1.5 shadow-md shadow-green-950/50 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-extrabold shadow-xl shadow-sky-950/60 border border-sky-300/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Buka bantuan WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#070d1e] flex items-center justify-center text-[9px] font-black text-black animate-pulse">
          1
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-sky-100" />
        <span className="text-xs hidden sm:inline font-['Outfit'] font-bold tracking-wide">
          Chat WA Ceria ⚡
        </span>
      </button>
    </div>
  );
};
