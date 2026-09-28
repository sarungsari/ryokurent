import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { FAQ_LIST } from '../data/mockData';
import { buildGeneralHelpLink } from '../utils/whatsapp';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#09110e] relative overflow-hidden border-t border-emerald-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Pertanyaan yang paling sering ditanyakan seputar rental motor, ketentuan, dan fasilitas kami.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#0e1714] border border-emerald-900/40 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                    {item.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-emerald-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-700/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">Ada Pertanyaan Lain yang Belum Terjawab?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin RyokouRent Malang & Batu siap membantu via WhatsApp 24 jam.
            </p>
          </div>
          <a
            href={buildGeneralHelpLink('Tanya Admin Seputar Rental')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-2 transition-all shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Admin</span>
          </a>
        </div>
      </div>
    </section>
  );
};
