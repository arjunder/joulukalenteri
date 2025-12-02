import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Share2 } from 'lucide-react';
import { cn } from '../utils/cn';

const DayModal = ({ isOpen, onClose, data }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-[#fdfbf7] rounded-2xl shadow-2xl overflow-hidden border-4 border-christmas-gold/30 max-h-[90vh] flex flex-col"
          >
            {/* Header decoration */}
            <div className="h-24 bg-gradient-to-br from-christmas-red to-[#5c0b0b] relative flex items-center justify-center overflow-hidden shrink-0">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>
               <div className="text-6xl animate-pulse drop-shadow-lg filter contrast-125">{data.icon}</div>
               
               {/* Close button */}
               <button 
                 onClick={onClose}
                 className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-all"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 text-center overflow-y-auto overscroll-contain">
              <div className="inline-flex items-center gap-2 mb-2 text-christmas-gold font-serif italic text-lg">
                <Sparkles size={16} />
                <span>Luukku {data.day}</span>
                <Sparkles size={16} />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-christmas-dark mb-6 font-serif uppercase tracking-wide break-words hyphens-auto [overflow-wrap:anywhere]">
                {data.task.replace(/\.$/, '')}
              </h2>
              
              <div className="bg-christmas-light/5 p-6 rounded-xl border border-christmas-dark/10">
                <p className="text-lg text-christmas-dark/80 leading-relaxed font-medium whitespace-pre-line">
                  {data.desc}
                </p>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const text = `Tämän päivän joulusiivoustehtävä: ${data.task} 🧹 #siivousjoulukalenteri`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-8 py-3 bg-[#25D366] text-white font-bold rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-105 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Jaa
                </button>

                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-christmas-red text-white font-bold rounded-full shadow-lg hover:bg-[#6e1616] hover:scale-105 transition-all transform active:scale-95 border-2 border-transparent hover:border-christmas-gold"
                >
                  Sulje
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DayModal;
