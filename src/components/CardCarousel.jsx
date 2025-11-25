import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CardCarousel = ({ members }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef(null);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: "absolute"
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute"
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection, resetAutoAdvance = false) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === members.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? members.length - 1 : prevIndex - 1;
      }
    });
    
    // Reset timer when manually navigating
    if (resetAutoAdvance) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        paginate(1, false);
      }, 8000);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      paginate(1, false);
    }, 8000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [members.length]);

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm border border-slate-200/80 shadow-xl min-h-[350px] sm:min-h-[400px] md:min-h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1, true);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1, true);
              }
            }}
            className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 h-full">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-sky-400 shadow-2xl ring-2 sm:ring-4 ring-sky-100 flex-shrink-0">
                <img
                  src={members[currentIndex].image}
                  alt={members[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left w-full">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 md:mb-3">
                  {members[currentIndex].name}
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-sky-600 font-semibold mb-3 md:mb-5">
                  {members[currentIndex].designation}
                </p>
                <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {members[currentIndex].details}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1, true)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-200/50 backdrop-blur-sm group"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-700 group-hover:text-sky-600 transition-colors" />
        </button>
        <button
          onClick={() => paginate(1, true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-200/50 backdrop-blur-sm group"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-700 group-hover:text-sky-600 transition-colors" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              // Reset timer when clicking dots
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              timerRef.current = setInterval(() => {
                paginate(1, false);
              }, 8000);
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 w-8 shadow-lg'
                : 'bg-slate-300 hover:bg-slate-400 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;

