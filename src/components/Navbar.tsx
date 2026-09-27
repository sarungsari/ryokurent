import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Phone, 
  Menu, 
  X, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Sparkles,
  MapPin,
  Clock,
  Settings,
  Flame
} from 'lucide-react';
import { OFFICIAL_WA_DISPLAY, OFFICIAL_WA_NUMBER, OFFICIAL_GARAGE_MAPS_URL } from '../utils/whatsapp';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAiPlanner: () => void;
  onOpenOperator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenLookup, onOpenAiPlanner, onOpenOperator }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Armada Hits', href: '#armada' },
    { label: 'Paket Jelajah', href: '#paket' },
    { label: 'Syarat Sewa', href: '#syarat' },
    { label: 'Rute AI ✨', href: '#ai-planner', isAi: true },
    { label: 'Ulasan Seru', href: '#testimoni' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Announcement Bar - Cheerful Youthful Blue */}
      <div className="bg-[#0b1736] text-sky-200 text-xs py-2 px-3 sm:px-4 border-b border-sky-800/40 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Gratis Antar Stasiun Malang Kotabaru & Garasi Tlogomas
            </span>
            <span className="hidden md:inline-block text-sky-600">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-sky-300 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              2 Helm Bersih + 2 Jas Hujan Siap Pakai
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs">
            <a
              href={OFFICIAL_GARAGE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-sky-300 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Titik Garasi (Google Maps)</span>
            </a>
            <span className="hidden lg:inline-block text-sky-700">|</span>
            {onOpenOperator && (
              <>
                <button
                  onClick={onOpenOperator}
                  className="text-sky-200 hover:text-white font-medium flex items-center gap-1 transition-colors bg-sky-950/80 hover:bg-sky-900/90 px-2.5 py-0.5 rounded-lg border border-sky-700/60 shadow-sm"
                  title="Buka Panel Operator Web (Edit & Tambah Unit, Upload Foto)"
                >
                  <Settings className="w-3 h-3 text-amber-300" />
                  <span>Panel Operator</span>
                </button>
                <span className="text-sky-700">|</span>
              </>
            )}
            <button
              onClick={onOpenLookup}
              className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-amber-300" />
              <span>Cek Booking</span>
            </button>
            <span className="hidden sm:inline-block text-sky-700">|</span>
            <a
              href={`https://wa.me/${OFFICIAL_WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 font-semibold text-cyan-300"
            >
              <Phone className="w-3 h-3" />
              <span>{OFFICIAL_WA_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080f24]/95 backdrop-blur-md shadow-xl shadow-sky-950/40 border-b border-sky-800/30 py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-[#080f24] to-transparent py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/40 group-hover:scale-105 group-hover:rotate-3 transition-transform border border-sky-200/50">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-['Outfit']">
                  RYOKOU
                </span>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
                  RENT ⚡
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-sky-300/80 tracking-wider font-semibold">
                Sewa Motor Seru Malang & Batu
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0b1736]/70 backdrop-blur-md p-1.5 rounded-full border border-sky-600/30 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  link.isAi
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 flex items-center gap-1'
                    : 'text-slate-200 hover:text-white hover:bg-sky-900/60'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenAiPlanner}
              className="text-xs font-bold px-3 py-2 rounded-xl text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Konsultasi Rute AI dengan Gemini High Thinking"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Rute AI</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2.5 shadow-lg shadow-sky-500/35 border border-sky-300/40 flex items-center gap-2 transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sewa Sekarang</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-sky-950/80 border border-sky-700/50 text-sky-200 hover:text-white active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a142c] border-b border-sky-800/50 px-4 py-4 mt-2 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    link.isAi
                      ? 'text-amber-300 bg-amber-500/15 border border-amber-400/40 flex items-center gap-2'
                      : 'text-slate-200 hover:bg-sky-900/50'
                  }`}
                >
                  {link.isAi && <Sparkles className="w-4 h-4 text-amber-400" />}
                  {link.label}
                </a>
              ))}

              <div className="pt-3 border-t border-sky-900/50 flex flex-col gap-2">
                {onOpenOperator && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOperator();
                    }}
                    className="w-full py-3 px-3 rounded-xl text-xs font-bold text-amber-300 bg-sky-950/90 border border-amber-400/40 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Settings className="w-4 h-4 text-amber-300" />
                    Panel Operator (Kelola Armada & Foto)
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLookup();
                  }}
                  className="w-full py-3 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-sky-950/70 border border-sky-800/60 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4 text-sky-400" />
                  Cek Status Booking
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-lg shadow-sky-500/40 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  Sewa Motor Sekarang (Online)
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
