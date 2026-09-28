import React from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart,
  Instagram,
  Facebook,
  ExternalLink,
  Settings
} from 'lucide-react';
import { 
  OFFICIAL_WA_DISPLAY, 
  OFFICIAL_WA_NUMBER, 
  OFFICIAL_GARAGE_LOCATION, 
  OFFICIAL_COMPANY_NAME,
  OFFICIAL_GARAGE_NAME,
  OFFICIAL_GARAGE_MAPS_URL
} from '../utils/whatsapp';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenOperator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenLookup, onOpenOperator }) => {
  return (
    <footer className="bg-[#070d0a] text-slate-400 text-xs border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit'] block">
                  RYOKOU <span className="text-amber-400">RENT</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Rental Sepeda Motor Malang & Batu</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Penyedia layanan rental sepeda motor terpercaya dengan armada keluaran terbaru 2024. Melayani petualangan sejuk Kota Wisata Batu, cagar budaya Malang, hingga ekspedisi lautan pasir Bromo.
            </p>

            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-semibold text-[11px]">Buka 24 Jam Antar-Jemput Stasiun</span>
            </div>
          </div>

          {/* Col 2: Garasi & Area Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              Garasi & Area Layanan
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400 block">{OFFICIAL_GARAGE_NAME}</strong>
                    <span className="text-[11px] text-slate-300 leading-snug block mt-0.5">
                      Jl. Mt Haryono XXI, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144
                    </span>
                  </div>
                </div>
                <a
                  href={OFFICIAL_GARAGE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Layanan Antar Stasiun & Hotel:</strong> Stasiun Malang Kotabaru, Kota Lama, Kayutangan, & Villa Batu.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Operasional Antar:</strong> Setiap hari pk 05:30 - 23:00 WIB (Reservasi Online 24 Jam).
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              Menu Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#armada" className="hover:text-emerald-300 transition-colors">Katalog Armada 2024</a>
              </li>
              <li>
                <a href="#paket" className="hover:text-emerald-300 transition-colors">Paket Wisata & Touring</a>
              </li>
              <li>
                <a href="#syarat" className="hover:text-emerald-300 transition-colors">Syarat & Ketentuan Sewa</a>
              </li>
              <li>
                <a href="#ai-planner" className="hover:text-amber-300 transition-colors text-amber-400/90 font-medium">
                  Rute AI High Thinking
                </a>
              </li>
              <li>
                <button onClick={onOpenLookup} className="text-left hover:text-emerald-300 transition-colors">
                  Cek Status Booking
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="text-left text-emerald-400 font-bold hover:underline">
                  Formulir Reservasi Online
                </button>
              </li>
              {onOpenOperator && (
                <li className="pt-1 border-t border-slate-800">
                  <button
                    onClick={onOpenOperator}
                    className="text-left text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-emerald-400" />
                    Panel Operator (Kelola Armada)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Kontak WhatsApp Resmi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              Kontak Pelanggan
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${OFFICIAL_WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-200 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {OFFICIAL_WA_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Email: halo@ryokourent.com</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${OFFICIAL_WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Hubungi Admin 24 Jam</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {OFFICIAL_COMPANY_NAME}. Rental Sepeda Motor Malang & Kota Wisata Batu.</p>
          <div className="flex items-center gap-3">
            <span>Malang & Batu, Jawa Timur</span>
            <span>•</span>
            <span className="text-emerald-500">Aman & Terpercaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
