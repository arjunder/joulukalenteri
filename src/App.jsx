import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Snowfall from './components/Snowfall';
import CalendarDoor from './components/CalendarDoor';
import Toast from './components/Toast';
import DayModal from './components/DayModal';
import { calendarData } from './data/calendarData';
import { getSimulatedDate, isDoorOpenable } from './utils/dateHelpers';
import { launchFireworks } from './utils/fireworks';

function App() {
  const [currentDate, setCurrentDate] = useState(getSimulatedDate());
  const [openedDoors, setOpenedDoors] = useState([]);
  const [shakingDoor, setShakingDoor] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const shuffledData = useMemo(() => {
    const data = [...calendarData];
    // Comment out the loop for testing if you want ordered numbers
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
      const dayData = calendarData.find(d => d.day === day);
      
      if (!openedDoors.includes(day)) {
        const newOpened = [...openedDoors, day];
        setOpenedDoors(newOpened);
        localStorage.setItem('openedDoors', JSON.stringify(newOpened));
        
        // Trigger fireworks for Christmas Eve!
        if (day === 24) {
          launchFireworks();
        }
      }
      
      // Open modal with details
      setSelectedDay(dayData);
    } else {
      setShakingDoor(day);
      setToastMessage("Ei saa kurkkia vielä! 🎅");
      setTimeout(() => setShakingDoor(null), 300);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-[#0f2e2e] to-[#1a403d] text-christmas-cream font-sans pb-20 overflow-x-hidden">
      <Snowfall />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      
      {/* Detail Modal */}
      <DayModal 
        isOpen={!!selectedDay} 
        onClose={() => setSelectedDay(null)} 
        data={selectedDay} 
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
        
        <header className="text-center mb-6 mt-4 md:mt-8 w-full max-w-lg">
          <h1 className="text-3xl md:text-6xl font-serif text-christmas-gold mb-3 tracking-wide drop-shadow-lgDW flex items-center justify-center gap-3">
            <Sparkles className="text-christmas-red w-6 h-6 md:w-10 md:h-10" />
            Joulusiivous
            <Sparkles className="text-christmas-red w-6 h-6 md:w-10 md:h-10" />
          </h1>
          <p className="text-sm md:text-xl opacity-80 font-serif italic mb-4">
            Talo puhtaaksi jouluksi 2025
          </p>

          {/* PROGRESS BAR */}
          <div className="w-full px-4">
            <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-widest text-christmas-gold/80 mb-1">
              <span>Luukkuja avattu</span>
              <span>{openedDoors.length} / 24</span>
            </div>
            <div className="h-2 bg-christmas-dark/50 rounded-full overflow-hidden border border-christmas-gold/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(openedDoors.length / 24) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        {/* --- HOUSE --- */}
        <div className="w-full relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
          
          {/* ROOF */}
          <div className="relative w-full max-w-4xl flex justify-center">
            
            {/* CHIMNEY */}
            <div className="absolute top-12 md:top-24 right-[22%] w-10 md:w-16 h-20 md:h-32 bg-christmas-red border-4 border-christmas-dark z-0 flex flex-col items-center shadow-2xl">
               <div className="w-full h-4 bg-christmas-red border-b-2 border-christmas-dark/20 -mt-1 scale-110 rounded-t-sm"></div>
                
                {/* REALISTIC SMOKE EFFECT */}
                <div className="absolute -top-4 w-full flex justify-center pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-5 h-5 bg-gray-200/60 rounded-full blur-lg"
                      initial={{ opacity: 0, scale: 0.8, y: 0, x: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0], // More visible fade in/out
                        scale: [0.8, 3],      // Grow bigger
                        y: -70,               // Go higher
                        x: [0, Math.sin(i) * 20] // More horizontal drift
                      }}
                      transition={{
                        duration: 3.5,        // Slower movement
                        repeat: Infinity,
                        delay: i * 0.7,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
            </div>

            {/* ROOF STRUCTURE */}
            <div className="relative z-10 w-full">
              <svg className="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] relative z-0" viewBox="0 0 100 45" preserveAspectRatio="none">
                 <path d="M50 0 L100 45 L0 45 Z" fill="#8a1c1c" stroke="#0f2e2e" strokeWidth="1" />
              </svg>

              {/* ROOF DOORS 
                  Fix: Width is now 30% (mobile) and 26% (desktop).
                  This makes the doors smaller to fit nicely inside the triangle.
              */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2 md:pb-6 z-10">
                 <div className="grid grid-cols-2 gap-2 md:gap-4 w-[30%] md:w-[26%]">
                   {roofItems.map(item => (
                     <CalendarDoor 
                       key={item.day} 
                       item={item} 
                       isOpen={openedDoors.includes(item.day)} 
                       isShaking={shakingDoor === item.day} 
                       onClick={handleDoorClick}
                       className="shadow-lg border border-christmas-dark/10 bg-christmas-light/95"
                     />
                   ))}
                 </div>
              </div>
            </div>
          </div>

          {/* WALLS */}
          <div className="relative z-20 w-[96%] max-w-[calc(100%-1rem)] md:max-w-[calc(56rem-2rem)] bg-[#e8e4dc] border-x-4 md:border-x-8 border-b-8 border-christmas-dark rounded-b-xl shadow-2xl p-3 md:p-8 -mt-1">
             <div className="absolute top-0 left-0 right-0 h-2 md:h-4 bg-christmas-gold/20 mb-4"></div>

             <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 mt-2 md:mt-4">
                {bodyItems.map(item => (
                   <CalendarDoor 
                    key={item.day} 
                    item={item} 
                    isOpen={openedDoors.includes(item.day)} 
                    isShaking={shakingDoor === item.day} 
                    onClick={handleDoorClick}
                    className="shadow-md" 
                  />
                ))}
             </div>

             <div className="mt-6 md:mt-10 flex justify-center opacity-80">
                <div className="w-1/2 h-2 md:h-4 bg-christmas-dark/20 rounded-full"></div>
             </div>
          </div>

        </div>

        <footer className="text-center mt-12 opacity-40 text-xs md:text-sm text-christmas-cream flex flex-col gap-2 items-center">
          <button 
            onClick={() => {
              if(window.confirm('Haluatko varmasti sulkea kaikki luukut ja aloittaa alusta?')) {
                localStorage.removeItem('openedDoors');
                setOpenedDoors([]);
              }
            }}
            className="text-[10px] underline hover:text-christmas-gold transition-colors"
          >
            Nollaa kalenteri
          </button>
        </footer>
      </div>
      
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .perspective-1000 { perspective: 1000px; }
        /* Hide scrollbar but allow scrolling */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;
