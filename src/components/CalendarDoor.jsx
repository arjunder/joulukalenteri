import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { cn } from '../utils/cn';

const CalendarDoor = ({ item, isOpen, isShaking, onClick, className }) => {
  return (
    <div 
      className={cn("aspect-square perspective-1000 group cursor-pointer relative", className)} 
      onClick={() => onClick(item.day)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ 
          rotateY: isOpen ? -180 : 0,
          x: isShaking ? [0, -8, 8, -8, 8, 0] : 0 // Voimakkaampi tärinä
        }}
        transition={{ 
          rotateY: { duration: 0.8, type: "spring", stiffness: 200, damping: 20 },
          x: { duration: 0.3 } // Nopeampi tärinä
        }}
      >
        {/* Front of the Door (Closed) */}
        <div className={cn(
            "absolute inset-0 backface-hidden rounded-lg shadow-md flex flex-col items-center justify-center p-2 transition-all border-b-4",
            "bg-christmas-light border-christmas-red/40 hover:brightness-110",
            isOpen ? "border-transparent" : "border-christmas-dark/30"
        )}>
           {/* Perforated lines simulation */}
           <div className="absolute inset-2 border-2 border-dashed border-christmas-cream/20 rounded-md pointer-events-none"></div>

          <span className="text-2xl md:text-4xl font-serif text-christmas-gold drop-shadow-md font-bold z-10">{item.day}</span>
          {!isOpen && <div className="mt-1 text-christmas-cream/40"><Lock size={12} /></div>}
        </div>

        {/* Back of the Door (Open/Inside) */}
        <div className="absolute inset-0 backface-hidden bg-christmas-cream text-christmas-dark rounded-lg shadow-inner rotate-y-180 flex flex-col items-center text-center p-2 overflow-hidden border-2 border-christmas-gold/20">
          <div className="text-2xl mb-1">{item.icon}</div>
          <p className="text-[10px] md:text-xs leading-tight font-medium line-clamp-4">{item.task}</p>
          <div className="mt-auto text-christmas-gold"><Check size={14} /></div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarDoor;
