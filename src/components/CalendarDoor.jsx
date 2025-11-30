import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { cn } from '../utils/cn';

const CalendarDoor = ({ item, isOpen, isShaking, onClick, className }) => {
  // Remove dot from title if present
  const cleanTitle = item.task.replace(/\.$/, '');

  return (
    <div 
      className={cn("aspect-square perspective-1000 group cursor-pointer relative", className)} 
      onClick={() => onClick(item.day)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ 
          rotateY: isOpen ? -180 : 0,
          x: isShaking ? [0, -8, 8, -8, 8, 0] : 0
        }}
        transition={{ 
          rotateY: { duration: 0.8, type: "spring", stiffness: 200, damping: 20 },
          x: { duration: 0.3 }
        }}
      >
        {/* DOOR CLOSED (FRONT) */}
        <div className={cn(
            "absolute inset-0 backface-hidden rounded-lg shadow-md flex flex-col items-center justify-center p-2 transition-all border-b-4",
            "bg-christmas-light border-christmas-red/40 hover:brightness-110",
            isOpen ? "border-transparent" : "border-christmas-dark/30"
        )}>
           {/* Perforated effect on edges */}
           <div className="absolute inset-1 border border-dashed border-christmas-cream/20 rounded-md pointer-events-none"></div>

          <span className="text-2xl md:text-4xl font-serif text-christmas-gold drop-shadow-md font-bold z-10">{item.day}</span>
          {!isOpen && <div className="mt-1 text-christmas-cream/40"><Lock size={12} /></div>}
        </div>

        {/* DOOR OPEN (BACK/CONTENT) */}
        <div className="absolute inset-0 backface-hidden bg-[#fdfbf7] text-christmas-dark rounded-lg shadow-inner rotate-y-180 flex flex-col items-center justify-between text-center p-1 md:p-2 overflow-hidden border-2 border-christmas-gold/20">
          
          {/* Icon - Centered and clear on mobile */}
          <div className="text-xl md:text-2xl mt-1 flex items-center justify-center overflow-visible">{item.icon}</div>
          
          {/* Title - Shown ONLY on desktop (md:block), hidden on mobile due to lack of space */}
          <h3 className="hidden md:block font-bold md:text-[10px] uppercase text-christmas-red leading-[1.1] line-clamp-4 w-full [overflow-wrap:anywhere] hyphens-auto px-0.5">
            {cleanTitle}
          </h3>

          {/* Checkmark - Always visible */}
          <div className="text-christmas-gold pb-1 md:pb-0"><Check size={16} className="w-4 h-4 md:w-4 md:h-4" /></div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarDoor;