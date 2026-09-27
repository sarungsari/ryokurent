import React from 'react';
import { Bike, CalendarCheck, MapPin, MessageCircle, Settings, Search } from 'lucide-react';
import { OFFICIAL_GARAGE_MAPS_URL, OFFICIAL_WA_NUMBER } from '../utils/whatsapp';

interface MobileBottomBarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenOperator: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBooking,
  onOpenLookup,
  onOpenOperator,
}) => {
  const scrollToArmada = () => {
    const el = document.getElementById('armada');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Halo RyokouRent! Saya mau tanya ketersediaan sewa motor di Malang & Batu.');
    window.open(`https://wa.me/${OFFICIAL_WA_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a1329]/95 backdrop-blur-xl border-t border-sky-500/25 px-2 py-2 safe-bottom-padding shadow-[0_-8px_30px_rgba(2,132,199,0.2)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Armada */}
        <button
          onClick={scrollToArmada}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-300 hover:text-sky-400 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-sky-950/70 border border-sky-800/50 flex items-center justify-center mb-0.5">
            <Bike className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Armada</span>
        </button>

        {/* Cek Booking */}
        <button
          onClick={onOpenLookup}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-300 hover:text-sky-400 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-sky-950/70 border border-sky-800/50 flex items-center justify-center mb-0.5">
            <Search className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Cek Sewa</span>
        </button>

        {/* Center Primary Action: SEWA SEKARANG (Prominent Cheerful Button) */}
        <button
          onClick={onOpenBooking}
          className="relative -top-3.5 flex flex-col items-center justify-center px-2 active:scale-90 transition-transform group"
          aria-label="Pesan Motor Sekarang"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/40 border-2 border-sky-200 group-hover:shadow-sky-400/60 transition-all">
            <CalendarCheck className="w-6 h-6 text-white group-hover:scale-110" />
          </div>
          <span className="text-[11px] font-black text-sky-300 mt-0.5 font-['Outfit'] tracking-tight drop-shadow">
            SEWA!
          </span>
        </button>

        {/* Garasi Maps */}
        <a
          href={OFFICIAL_GARAGE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-300 hover:text-sky-400 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-sky-950/70 border border-sky-800/50 flex items-center justify-center mb-0.5">
            <MapPin className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Garasi</span>
        </a>

        {/* WhatsApp Fast Chat */}
        <button
          onClick={openWhatsApp}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-300 hover:text-green-400 active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-green-950/70 border border-green-800/50 flex items-center justify-center mb-0.5">
            <MessageCircle className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Chat WA</span>
        </button>

        {/* Operator Dashboard Button */}
        <button
          onClick={onOpenOperator}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-amber-300 active:scale-95 transition-all"
          title="Panel Operator"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900/70 border border-slate-700/50 flex items-center justify-center mb-0.5">
            <Settings className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-[9px] font-medium tracking-tight">Operator</span>
        </button>
      </div>
    </div>
  );
};
