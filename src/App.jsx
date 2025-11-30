import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Snowfall from './components/Snowfall';
import CalendarDoor from './components/CalendarDoor';
import Toast from './components/Toast';
import { calendarData } from './data/calendarData';
import { getSimulatedDate, isDoorOpenable } from './utils/dateHelpers';

function App() {
  const [currentDate, setCurrentDate] = useState(getSimulatedDate());
  const [openedDoors, setOpenedDoors] = useState([]);
  const [shakingDoor, setShakingDoor] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Shuffle doors only on initial mount
  const shuffledData = useMemo(() => {
    const data = [...calendarData];
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    return data;
  }, []);

  const roofItems = shuffledData.slice(0, 4);
  const bodyItems = shuffledData.slice(4);

  useEffect(() => {
    const saved = localStorage.getItem('openedDoors');
    if (saved) setOpenedDoors(JSON.parse(saved));
  }, []);

  const handleDoorClick = (day) => {
    if (isDoorOpenable(day, currentDate)) {
      if (!openedDoors.includes(day)) {
        const newOpened = [...openedDoors, day];
        setOpenedDoors(newOpened);
        localStorage.setItem('openedDoors', JSON.stringify(newOpened));
      }
    } else {
      // Trigger shake animation
      setShakingDoor(day);
      setToastMessage("Ei saa kurkkia vielä! 🎅");
      
      // Reset shaking state quickly so it can be triggered again
      setTimeout(() => setShakingDoor(null), 300);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-[#0b1e1e] to-[#1a403d] text-christmas-cream font-sans pb-20 overflow-x-hidden">
      <Snowfall />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        <header className="text-center mb-8 mt-4">
          <h1 className="text-3xl md:text-5xl font-serif text-christmas-gold mb-2 tracking-wide drop-shadow-lg flex items-center justify-center gap-4 flex-wrap">
            <Sparkles className="hidden md:block text-christmas-red" />
            Joulusiivous joulukalenteri
            <Sparkles className="hidden md:block text-christmas-red" />
          </h1>
          <p className="text-lg opacity-80 font-serif italic">
            Talo puhtaaksi jouluksi 2025
          </p>
        </header>

        {/* HOUSE CONTAINER */}
        <div className="w-full max-w-3xl relative flex flex-col items-center mt-12 animate-in fade-in zoom-in duration-700">
            
          {/* CHIMNEY: Adjusted position to attach to roof slope */}
          <div className="absolute -top-4 right-[22%] w-16 h-28 bg-christmas-red border-4 border-christmas-dark rounded-t-sm z-0 flex flex-col items-center justify-start pt-1">
             <div className="w-full h-2 bg-black/20 mb-1"></div>
             <div className="w-full h-2 bg-black/20"></div>
             <motion.div 
               className="absolute -top-10 text-white/50 text-2xl"
               animate={{ y: [-10, -30], opacity: [0.8, 0], x: [0, 10] }}
               transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
             >💨</motion.div>
          </div>

          {/* ROOF SECTION */}
          <div className="relative z-10 w-full flex justify-center drop-shadow-2xl">
            
            {/* SVG Background for Roof - Wider and taller */}
            <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 100 45" preserveAspectRatio="none">
               <path d="M50 0 L100 45 L0 45 Z" fill="#8a1c1c" stroke="#0f2e2e" strokeWidth="0.5" />
            </svg>

            {/* Snow on Roof Top */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-10 bg-white/90 rounded-full blur-xl z-20"></div>

            {/* Roof Doors Container - Pushed down further to sit safely inside triangle */}
            <div className="relative z-10 pt-24 pb-8 px-4 grid grid-cols-2 gap-6 w-full max-w-[320px]">
               {roofItems.map(item => (
                 <CalendarDoor 
                   key={item.day} 
                   item={item} 
                   isOpen={openedDoors.includes(item.day)} 
                   isShaking={shakingDoor === item.day} 
                   onClick={handleDoorClick}
                   className="shadow-xl"
                 />
               ))}
            </div>
          </div>

          {/* WALLS SECTION */}
          <div className="relative z-20 w-[92%] bg-[#e8e4dc] border-x-8 border-b-8 border-christmas-dark rounded-b-xl shadow-2xl p-6 md:p-10 -mt-1">
             {/* Decorative beam */}
             <div className="absolute top-0 left-0 right-0 h-4 bg-christmas-gold/20 mb-6"></div>

             <div className="grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
                {bodyItems.map(item => (
                   <CalendarDoor 
                    key={item.day} 
                    item={item} 
                    isOpen={openedDoors.includes(item.day)} 
                    isShaking={shakingDoor === item.day} 
                    onClick={handleDoorClick} 
                  />
                ))}
             </div>
             {/* Decorative Door Step */}
             <div className="mt-10 flex justify-center">
                <div className="w-48 h-4 bg-christmas-dark/10 rounded-full"></div>
             </div>
          </div>

        </div>

        <footer className="text-center mt-16 opacity-50 text-sm">
          <p>Tehty rakkaudella &bull; Joulukuu 2025</p>
        </footer>
      </div>
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}

export default App;