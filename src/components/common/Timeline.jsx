import {
  useScroll,
  useTransform,
  motion,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heightSpring = useSpring(heightTransform, springConfig);

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        Math.floor(latest * data.length),
        data.length - 1
      );
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, data.length]);

  return (
    <div
      className="w-full relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans"
      ref={containerRef}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-200/20 to-blue-200/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-blue-700 shadow-sm mb-3 md:mb-4">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Our Journey
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 px-2 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
              Milestones That
            </span>
            <br />
            <span className="text-slate-900">Shape Our Story</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            A timeline of growth, achievement, and transformation in our mission to provide world-class education
          </p>
        </motion.div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Animated timeline line - Mobile: left side, Desktop: centered */}
        <div className="hidden md:block absolute left-48 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent overflow-hidden">
          <motion.div
            style={{
              height: heightSpring,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-b from-blue-600 via-sky-500 to-blue-600 rounded-full shadow-lg"
          />
        </div>
        
        {/* Mobile timeline line */}
        <div className="md:hidden absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent overflow-hidden">
          <motion.div
            style={{
              height: heightSpring,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-gradient-to-b from-blue-600 via-sky-500 to-blue-600 rounded-full shadow-lg"
          />
        </div>

        {data.map((item, index) => {
          const isActive = activeIndex === index;
          const isPast = activeIndex > index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px", amount: 0.2 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.06,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
              className="relative mb-5 sm:mb-6 md:mb-16 pl-6 sm:pl-8 md:pl-0"
            >
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-8 items-start">
                {/* Year Badge - Mobile: Full width, Desktop: Left Side */}
                <div className="flex-shrink-0 w-full md:w-48">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.03 : 1,
                      opacity: isActive || isPast ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="relative inline-block w-full md:w-auto">
                      {/* Glowing background effect */}
                      {(isActive || isPast) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-sky-400/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-lg -z-10"
                        />
                      )}
                      
                      {/* Year card */}
                      <div className={`
                        relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl border-2 transition-all duration-300 w-full md:w-auto
                        ${isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-sky-500 border-blue-400 shadow-xl sm:shadow-2xl shadow-blue-500/50' 
                          : isPast
                          ? 'bg-gradient-to-br from-blue-100 to-sky-100 border-blue-200 shadow-md sm:shadow-lg'
                          : 'bg-white border-slate-200 shadow-sm sm:shadow-md'
                        }
                      `}>
                        <motion.h3
                          animate={{
                            color: isActive ? '#ffffff' : isPast ? '#1e40af' : '#64748b',
                          }}
                          className={`
                            text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold transition-colors duration-300 text-center md:text-left leading-tight
                            ${isActive ? 'text-white' : isPast ? 'text-blue-700' : 'text-slate-600'}
                          `}>
                          {item.title}
                        </motion.h3>
                        
                        {/* Progress indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-white/50 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content Card - Right Side */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.01 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 w-full"
                >
                  <div className={`
                    relative group rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border-2 overflow-hidden transition-all duration-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-white via-blue-50/30 to-sky-50/30 border-blue-300 shadow-xl sm:shadow-2xl shadow-blue-500/20 ring-2 ring-blue-200/50' 
                      : isPast
                      ? 'bg-gradient-to-br from-white to-slate-50 border-blue-200 shadow-lg sm:shadow-xl ring-1 ring-blue-100/30'
                      : 'bg-white border-slate-200 shadow-md sm:shadow-lg hover:shadow-xl hover:ring-1 hover:ring-blue-100/40'
                    }
                  `}>
                    {/* Animated gradient overlay with elegant shimmer */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-sky-500/0 to-blue-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      animate={isActive ? {
                        background: [
                          'linear-gradient(135deg, rgba(59, 130, 246, 0) 0%, rgba(14, 165, 233, 0) 50%, rgba(59, 130, 246, 0) 100%)',
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(14, 165, 233, 0.06) 50%, rgba(59, 130, 246, 0.04) 100%)',
                          'linear-gradient(135deg, rgba(59, 130, 246, 0) 0%, rgba(14, 165, 233, 0) 50%, rgba(59, 130, 246, 0) 100%)',
                        ]
                      } : {}}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    />
                    
                    {/* Image (if provided) */}
                    {item.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 overflow-hidden rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl"
                      >
                        {/* Elegant gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-sky-500/15 to-blue-600/20 z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-sky-900/10 z-10"></div>
                        
                        {/* Shimmer effect overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "linear"
                          }}
                        />
                        
                        {/* Main image with elegant effects */}
                        <motion.img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                          style={{ filter: 'brightness(1.05) contrast(1.1) saturate(1.1)' }}
                        />
                        
                        {/* Elegant border glow effect with animated pulse */}
                        <motion.div 
                          className="absolute inset-0 border-2 border-white/30 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl z-20 pointer-events-none"
                          animate={isActive ? {
                            boxShadow: [
                              '0 0 0 0px rgba(255, 255, 255, 0.3)',
                              '0 0 0 4px rgba(255, 255, 255, 0.1)',
                              '0 0 0 0px rgba(255, 255, 255, 0.3)',
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Decorative corner elements with elegant glow */}
                        <motion.div 
                          className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-bl-full backdrop-blur-md z-20 shadow-lg"
                          animate={isActive ? { opacity: [0.5, 0.8, 0.5] } : { opacity: 0.5 }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div 
                          className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-tr from-blue-500/40 via-blue-400/20 to-transparent rounded-tr-full backdrop-blur-md z-20 shadow-lg"
                          animate={isActive ? { opacity: [0.4, 0.7, 0.4] } : { opacity: 0.4 }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        />
                        
                        {/* Elegant frame shadow with glow */}
                        <motion.div 
                          className="absolute -inset-2 bg-gradient-to-br from-blue-400/30 via-sky-400/30 to-blue-400/30 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl blur-2xl -z-10"
                          animate={isActive ? {
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1]
                          } : {
                            opacity: 0
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        {/* Subtle vignette effect */}
                        <div 
                          className="absolute inset-0 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl z-10 pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.15) 100%)'
                          }}
                        ></div>
                      </motion.div>
                    )}

                    {/* Content */}
                    <div className={`relative ${item.image ? 'p-3 sm:p-4 md:p-5 lg:p-6' : 'p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8'}`}>
                      {item.content}
                    </div>

                    {/* Decorative corner accent */}
                    {(isActive || isPast) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: -45 }}
                        className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/15 to-sky-400/15 sm:from-blue-400/20 sm:to-sky-400/20 rounded-bl-full"
                      />
                    )}

                    {/* Connecting line indicator */}
                    {index < data.length - 1 && (
                      <div className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 lg:-bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-3 sm:h-4 md:h-6 lg:h-8 bg-gradient-to-b from-slate-200 to-transparent" />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Timeline dot connector - Mobile: left side, Desktop: centered */}
              <div className="absolute left-0 md:left-48 top-4 sm:top-5 md:top-6 -translate-x-1/2 z-20">
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : isPast ? 1.05 : 1,
                    boxShadow: isActive 
                      ? '0 0 0 3px rgba(59, 130, 246, 0.15), 0 0 0 1.5px rgba(14, 165, 233, 0.25)'
                      : isPast
                      ? '0 0 0 1.5px rgba(59, 130, 246, 0.1)'
                      : '0 0 0 0px rgba(59, 130, 246, 0)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border-2 sm:border-[2.5px] md:border-[3px] lg:border-4 transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-sky-500 border-white' 
                      : isPast
                      ? 'bg-gradient-to-br from-blue-400 to-sky-400 border-white'
                      : 'bg-white border-slate-300'
                    }
                  `}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
