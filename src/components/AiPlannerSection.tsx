import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Compass, 
  Send, 
  Check, 
  AlertTriangle, 
  Coffee, 
  ShieldCheck, 
  Fuel, 
  Calendar, 
  MessageCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { AIRecommendationResponse, MotorItem } from '../types/rental';
import { useFleet } from '../context/FleetContext';
import { formatRupiah, buildAIPlanWhatsAppLink } from '../utils/whatsapp';

interface AiPlannerSectionProps {
  onBookMotor: (motor: MotorItem) => void;
}

export const AiPlannerSection: React.FC<AiPlannerSectionProps> = ({ onBookMotor }) => {
  const { fleet } = useFleet();
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState<number>(2);
  const [ridingStyle, setRidingStyle] = useState<'santai' | 'touring' | 'petualang' | 'hemat'>('petualang');
  const [experienceLevel, setExperienceLevel] = useState<'pemula' | 'menengah' | 'mahir'>('menengah');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResponse | null>(null);
  const [thinkingStep, setThinkingStep] = useState<string>('');

  const quickPrompts = [
    {
      title: 'Sunrise Bromo & Lautan Pasir',
      dest: 'Berburu sunrise di Penanjakan Bromo via Tumpang, lanjut lautan pasir berbisik dan Bukit Teletubbies berdua.',
      passengers: 2,
      style: 'petualang' as const,
    },
    {
      title: 'Wisata Dingin Batu & Cangar',
      dest: 'Touring seharian ke Paralayang Batu, Kebun Apel Selecta, dan berendam air panas alami Cangar.',
      passengers: 2,
      style: 'touring' as const,
    },
    {
      title: 'Heritage Malang & Cafe Hopping',
      dest: 'Keliling santai cagar budaya Kayutangan Heritage, Ijen Boulevard, dan nongkrong sore di cafe hits Soekarno-Hatta solo traveler.',
      passengers: 1,
      style: 'santai' as const,
    },
    {
      title: 'Off-Road Ekstrem Coban Talun & Brakseng',
      dest: 'Jelajah jalur bebatuan dan tanjakan terjal perkebunan Brakseng Cangar serta Coban Talun seorang diri.',
      passengers: 1,
      style: 'petualang' as const,
    },
  ];

  const handleQuickPrompt = (prompt: typeof quickPrompts[0]) => {
    setDestination(prompt.dest);
    setPassengers(prompt.passengers);
    setRidingStyle(prompt.style);
    handleExecutePlanner(prompt.dest, prompt.passengers, prompt.style);
  };

  const handleExecutePlanner = async (
    customDest?: string,
    customPassengers?: number,
    customStyle?: any
  ) => {
    const destToUse = customDest || destination;
    if (!destToUse.trim()) return;

    setIsLoading(true);
    setThinkingStep('Memulai penalaran mendalam (Gemini 3.1 Pro High Thinking)...');

    const thinkingMessages = [
      'Memetakan kontur jalan, elevasi perbukitan Batu, dan risiko tanjakan Payung/Klemuk...',
      'Menganalisis rasio bobot tenaga (power-to-weight) dan pengereman di turunan pegunungan...',
      'Menyusun strategi transmisi, engine brake, dan manajemen bahan bakar...',
      'Memformulasikan rekomendasi armada dan daftar pitstop kuliner khas Malang-Batu...',
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < thinkingMessages.length) {
        setThinkingStep(thinkingMessages[msgIndex]);
        msgIndex++;
      }
    }, 900);

    try {
      const response = await fetch('/api/ai/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destToUse,
          passengers: customPassengers !== undefined ? customPassengers : passengers,
          ridingStyle: customStyle || ridingStyle,
          experienceLevel,
          notes,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      }
    } catch (err) {
      console.error('Error querying AI planner:', err);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setThinkingStep('');
    }
  };

  const matchedMotor = result
    ? fleet.find((m) => m.id === result.recommendedMotorId) || fleet[0]
    : null;

  return (
    <section id="ai-planner" className="py-16 sm:py-24 bg-[#09110e] relative overflow-hidden border-t border-emerald-950">
      {/* Background glow and subtle circuit motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>AI Explorer • Penalaran Mendalam (High Thinking)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
            Konsultan Rute & Pilihan Motor Cerdas
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
            Tak yakin motor mana yang sanggup menaklukkan tanjakan curam Payung Batu, turunan ekstrem Klemuk, atau rute pasir Gunung Bromo? Biarkan asisten rute berbasis Gemini 3.1 Pro menganalisis elevasi jalan, keamanan cuaca dingin, dan konsumsi bensin untuk Anda.
          </p>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-4xl mx-auto">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Rekomendasi Cepat:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(p)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-600/40 text-slate-300 hover:text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{p.title}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>

        {/* Main Interactive Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Left Form: Query Setup */}
          <div className="lg:col-span-5 bg-[#0f1b16] border border-emerald-900/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Detail Rencana Perjalanan</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Destinasi / Impian Wisata Anda: *
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Mau ke Paralayang Batu sunrise, lalu ke Coban Rondo, dan sore ke Alun-Alun Batu makan ketan berdua..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#0a120f] border border-emerald-900/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Jumlah Penumpang:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPassengers(1)}
                    className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                      passengers === 1
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-[#0a120f] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    1 Orang
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassengers(2)}
                    className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                      passengers === 2
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-[#0a120f] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    2 Orang
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Gaya Berkendara:
                </label>
                <select
                  value={ridingStyle}
                  onChange={(e: any) => setRidingStyle(e.target.value)}
                  className="w-full bg-[#0a120f] border border-emerald-900/60 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="petualang">Petualang / Trail</option>
                  <option value="touring">Touring Jarak Jauh</option>
                  <option value="santai">Santai / City Tour</option>
                  <option value="hemat">Hemat Budget</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Tingkat Pengalaman Berkendara:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['pemula', 'menengah', 'mahir'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-1.5 capitalize text-xs rounded-xl border font-medium ${
                      experienceLevel === lvl
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-[#0a120f] border-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleExecutePlanner()}
              disabled={isLoading || !destination.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 shadow-xl shadow-amber-950 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-400/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menganalisis Rute...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Jalankan Penalaran Rute AI</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Right Area: Results / Reasoning Display */}
          <div className="lg:col-span-7 bg-[#0f1b16] border border-emerald-900/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
            {isLoading ? (
              <div className="py-20 text-center space-y-4 my-auto">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin"></div>
                  <BrainCircuit className="w-8 h-8 text-amber-400 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mode Penalaran Tinggi Aktif (Gemini 3.1 Pro)</h4>
                  <p className="text-xs text-amber-300 font-mono mt-1 animate-pulse">
                    {thinkingStep}
                  </p>
                </div>
              </div>
            ) : result && matchedMotor ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Result Motor Card Header */}
                <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedMotor.image}
                      alt={matchedMotor.name}
                      className="w-16 h-16 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        REKOMENDASI TERBAIK ({result.confidenceScore}% COCOK)
                      </span>
                      <h4 className="text-base font-extrabold text-white font-['Outfit']">
                        {matchedMotor.name}
                      </h4>
                      <span className="text-xs font-bold text-emerald-300">
                        {formatRupiah(matchedMotor.dailyPrice)}/hari
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookMotor(matchedMotor)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Pesan Unit Ini</span>
                  </button>
                </div>

                {/* Reason & Thinking Analysis */}
                <div className="p-3 bg-[#0a120f] rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  <div>
                    <strong className="text-emerald-400 block mb-0.5">Alasan Rekomendasi:</strong>
                    {result.reason}
                  </div>
                  {result.thinkingAnalysis && (
                    <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 italic font-sans">
                      <span className="text-amber-400 font-semibold not-italic">Catatan Analisis Elevasi:</span> "{result.thinkingAnalysis}"
                    </div>
                  )}
                </div>

                {/* Grid: Highlights & Warnings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Highlights */}
                  <div className="p-3 bg-[#0a120f] rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 mb-2 block flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Highlight Rute Wisata:
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {result.routeHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Terrain & Safety Alerts */}
                  <div className="p-3 bg-[#0a120f] rounded-xl border border-amber-900/30">
                    <span className="font-bold text-amber-400 mb-2 block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Perhatian Medan & Tanjakan:
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {result.terrainAlerts.map((ta, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{ta}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pitstop & Estimated Fuel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pitstop Kuliner Populer</span>
                      <span className="text-xs text-white font-medium">{result.pitstops[0] || 'Kopi Klothok Pakem'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimasi Bensin Rute</span>
                      <span className="text-xs text-white font-medium">{result.estimatedFuelCost}</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Action */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    Ingin konsultasi rute lebih lanjut dengan admin?
                  </span>
                  <a
                    href={buildAIPlanWhatsAppLink(matchedMotor.name, destination, result.reason)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/40 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kirim ke WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Belum Ada Analisis Rute</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Tuliskan destinasi atau klik tombol rekomendasi cepat di atas untuk melihat motor paling cocok dan tips keselamatan rute.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
