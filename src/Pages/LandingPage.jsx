import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightCard } from '../components/common/SpotlightCard';

// Lazy load heavy components
const TeamTestimonials = lazy(() => import('../components/team/TeamTeastimonials').then(module => ({ default: module.TeamTestimonials })));
const Gallery = lazy(() => import('../components/gallery/GalleryLanding'));

import { GraduationCap, Trophy, Award, Medal, Star, Users, BookOpen, Building2, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, Sparkles, TrendingUp, Library, Microscope, Music, Dumbbell, Palette, Heart, Quote } from 'lucide-react';
import videoSrc from '../assets/Hero vid.mp4';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// Optimized Lazy Video Component - Uses poster image for fast LCP, loads video lazily but plays automatically
const LazyVideo = ({ videoSource, title }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Start loading video immediately but with a small delay to prioritize placeholder for LCP
  useEffect(() => {
    // Small delay ensures placeholder renders first (better LCP)
    const loadTimer = setTimeout(() => {
      setShouldLoad(true);
    }, 50);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(loadTimer);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Auto-play video when it loads and is visible
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (videoLoaded && isVisible) {
      // Auto-play video when loaded and visible
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Handle autoplay restrictions
          console.log('Video play failed:', error);
        });
      }
    } else if (!isVisible) {
      // Pause video when out of view
      video.pause();
    }
  }, [isVisible, videoLoaded]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // Ensure video plays once loaded
    if (videoRef.current && isVisible) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Video play failed:', error);
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full">
      {/* Video - uses metadata preload to show first frame quickly, then plays automatically */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.78vh',
            objectFit: 'cover',
          }}
          src={videoSource}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onLoadedMetadata={handleVideoLoaded}
          title={title}
        />
      )}
    </div>
  );
};

const LandingPage = () => {
  const [contentVisible, setContentVisible] = React.useState(true);
  const [typedText, setTypedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(true);
  const [showButtons, setShowButtons] = React.useState(false);
  const sectionRef = React.useRef(null);
  const buttonsRef = React.useRef(null);

  const videoContainerRef = React.useRef(null);

  const FULL_TEXT = "A compassionate, world‑class CBSE school dedicated to uplifting under‑privileged children, single‑parent families, and orphans — providing full scholarship, residential care.";

  // Show buttons after 25 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 25000); // 25 seconds

    return () => clearTimeout(timer);
  }, []);

  // Typing animation effect
  React.useEffect(() => {
    let currentIndex = 0;
    let timeoutId;

    const typeText = () => {
      if (currentIndex < FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeText, 30); // Typing speed: 30ms per character
      } else {
        // After typing completes, wait 5 seconds then start deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          currentIndex = FULL_TEXT.length;
          const deleteText = () => {
            if (currentIndex > 0) {
              setTypedText(FULL_TEXT.slice(0, currentIndex - 1));
              currentIndex--;
              timeoutId = setTimeout(deleteText, 30); // Deleting speed: 30ms per character
            } else {
              setTypedText('');
            }
          };
          deleteText();
        }, 5000); // Wait 5 seconds
      }
    };

    typeText();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!videoContainerRef.current || !buttonsRef.current) return;

      const videoRect = videoContainerRef.current.getBoundingClientRect();
      const buttonsRect = buttonsRef.current.getBoundingClientRect();
      
      // Hide content when buttons touch the bottom of the video (not the black space)
      // Video container is h-screen, so when its bottom reaches viewport bottom, hide content
      if (videoRect.bottom <= buttonsRect.bottom) {
        setContentVisible(false);
      } else {
        setContentVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <section ref={sectionRef} className="relative overflow-hidden h-screen bg-black">
      <div ref={videoContainerRef} className="absolute inset-0 h-screen w-full">
        <div className="absolute inset-0 z-0 w-full h-full">
          <LazyVideo
            videoSource={videoSrc}
            title="Heal Paradise Hero Video"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/0 w-full h-full pointer-events-none" />
        </div>
      </div>
      <div 
        className={`fixed top-0 left-0 right-0 z-10 mx-auto max-w-7xl px-6 pt-14 pb-28 text-center h-screen flex flex-col justify-center transition-opacity duration-300 ${
          contentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
          <span className="inline-flex items-center gap-2 rounded-full bg-transparent/20 border border-white/40 px-3 py-1 text-[10px] sm:text-xs font-medium text-white backdrop-blur max-w-fit mx-auto whitespace-nowrap">
            <GraduationCap fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />Residential School Affiliated to CBSE
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-6xl">
            <span className="text-sky-400" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 0px 1px 0px rgba(0,0,0,0.8), 0px -1px 0px rgba(0,0,0,0.8), 1px 0px 0px rgba(0,0,0,0.8), -1px 0px 0px rgba(0,0,0,0.8)' }}>
              Heal Paradise
            </span>{' '}
            <span className="text-white" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8), 0px 1px 0px rgba(0,0,0,0.8), 0px -1px 0px rgba(0,0,0,0.8), 1px 0px 0px rgba(0,0,0,0.8), -1px 0px 0px rgba(0,0,0,0.8)' }}>
              School
            </span>
          </h1>
         
          <div 
            ref={buttonsRef} 
            className={`mt-60 flex flex-nowrap items-center justify-center gap-3 transition-all duration-700 ease-out ${
              showButtons 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href="#admissions"
              className="rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:from-blue-700 hover:to-sky-600 whitespace-nowrap"
            >
              Apply for Admissions
            </a>
            <a
              href="#mission"
              className="rounded-full bg-transparent border border-white px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 whitespace-nowrap"
            >
              Our Mission
            </a>
          </div>
        </div>
    </section>

    {/* Gallery Section */}
    <section id="gallery" className="w-full mb-5 pb-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-sky-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-100/20 to-blue-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
      {/* Text and Illustration Section */}
      
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch py-8 md:py-12">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="space-y-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200/60 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-4 w-fit">
              <Heart className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                Transforming Lives
              </span>
              <br />
              <span className="text-slate-900">Through Education</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed">
              At Heal Paradise School, we believe every child deserves access to world-class education, regardless of their circumstances. Through our comprehensive scholarship program and residential care, we're building a future where every student can dream, achieve, and inspire.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['100% Free Education', 'Residential Care', 'CBSE Curriculum', 'Holistic Development'].map((tag, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200/60 text-sm font-semibold text-blue-700 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Illustration/Cartoon */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full min-h-[300px] md:min-h-[500px] w-full"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-white rounded-3xl p-4 md:p-6 lg:p-8 overflow-hidden shadow-2xl border-2 border-blue-100/60">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-3xl blur-2xl"></div>
              <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden z-10">
                <DotLottieReact 
                  src="https://lottie.host/4d9ea1cd-2ace-4050-b163-f474e23c12ff/RKARS6NZe4.lottie"
                  loop
                  autoplay
                  className="w-full h-full rounded-3xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Gallery Component */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="text-slate-600">Loading gallery...</div></div>}>
          <Gallery />
        </Suspense>
      </div>
      
      {/* View More Button */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center pt-8"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/gallery"
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white font-bold rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">View More</span>
          <motion.svg
            className="w-5 h-5 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
        </Link>
        </motion.div>
      </motion.div>
      </div>

      {/* Award Cards Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mt-12 md:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200/60 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm mb-4">
            <Trophy className="w-4 h-4" />
            Recognition
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-slate-900 mb-3">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Our Achievements
            </span>
            <br />
            <span className="text-slate-900">& Recognition</span>
          </h3>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Award Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-200/80 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-300/40 to-yellow-300/40 rounded-full blur-3xl -mr-20 -mt-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            <div className="relative z-10">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-5 shadow-xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Excellence in Education</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Recognized for outstanding academic performance and student achievement
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Award Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 border-2 border-blue-200/80 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-300/40 to-sky-300/40 rounded-full blur-3xl -mr-20 -mt-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            ></motion.div>
            <div className="relative z-10">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-5 shadow-xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Best CBSE School</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Awarded for maintaining highest standards in CBSE curriculum delivery
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-blue-400 text-blue-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Award Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-2 border-emerald-200/80 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-300/40 to-green-300/40 rounded-full blur-3xl -mr-20 -mt-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            ></motion.div>
            <div className="relative z-10">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-5 shadow-xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Medal className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Social Impact Award</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Honored for transforming lives of underprivileged children through education
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Award Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 border-2 border-purple-200/80 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/40 to-violet-300/40 rounded-full blur-3xl -mr-20 -mt-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            ></motion.div>
            <div className="relative z-10">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-5 shadow-xl"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Star className="w-10 h-10 text-white fill-white" />
              </motion.div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Innovation in Teaching</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Recognized for innovative teaching methods and holistic student development
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>

    {/* Founder Message */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.01 }}
        className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 md:p-10 lg:p-12 shadow-2xl border-2 border-blue-100/60 transition-all duration-500 hover:from-blue-100 hover:via-blue-50 hover:to-sky-100 hover:shadow-3xl hover:border-blue-200/80"
      >
        {/* Decorative background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-sky-200/30 rounded-full blur-3xl -mr-48 -mt-48"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-200/30 to-blue-200/30 rounded-full blur-3xl -ml-48 -mb-48"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        ></motion.div>
        
        <div className="relative z-10 grid md:grid-cols-4 gap-6 md:gap-8 items-center px-4 md:px-6">
          {/* Left Side - Founder Image and Name */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start md:col-span-1"
          >
            <motion.div 
              className="relative group mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full blur-xl opacity-30"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-100/50">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=400&auto=format&fit=crop"
                  alt="Founder"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 transition-all duration-500 group-hover:from-blue-900 group-hover:to-slate-800">
                Founder Name
              </h3>
              <p className="text-lg md:text-xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent font-semibold transition-all duration-500 group-hover:from-blue-700 group-hover:to-sky-700">
                Founder & Director
              </p>
            </div>
          </motion.div>

          {/* Right Side - Founder Message */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative pl-0 md:pl-8 md:col-span-3"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full"
                whileHover={{ width: 24 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
                <span className="text-slate-900">Message from the </span>
                <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Founder</span>
              </h2>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-4 text-7xl md:text-8xl text-blue-200/40 font-serif leading-none">"</div>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed relative z-10 font-medium pl-6 md:pl-8">
                Education is the most powerful weapon which you can use to change the world. At Heal Paradise 
                School, we believe that every child deserves access to quality education, regardless of their 
                circumstances. Our mission is to break barriers and create opportunities for those who need it most. 
                Through compassion, dedication, and excellence, we are building a future where every child can dream, 
                achieve, and inspire.
              </p>
              <div className="absolute -bottom-4 -right-4 text-7xl md:text-8xl text-blue-200/40 font-serif leading-none">"</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>

    {/* Team/Leadership Carousel */}
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3">
          Our Leadership Team
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Meet the dedicated leaders who guide our mission of excellence and compassion
        </p>
      </div>
      
      <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="text-slate-600">Loading testimonials...</div></div>}>
        <TeamTestimonials 
          testimonials={[
          {
            name: "Dr. John Smith",
            designation: "Principal",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            quote: "With over 20 years of experience in education, Dr. Smith leads our academic excellence initiatives."
          },
          {
            name: "Ms. Sarah Johnson",
            designation: "Vice Principal",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
            quote: "Passionate about student welfare and holistic development, Ms. Johnson ensures every child receives personalized attention."
          },
          {
            name: "Mr. David Williams",
            designation: "Head of Academics",
            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
            quote: "An expert in curriculum development, Mr. Williams designs innovative learning programs for our students."
          }
        ]}
        autoplay={true}
      />
      </Suspense>
    </section>

 
    {/* Student & Parent Testimonials */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-sky-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tr from-sky-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200/60 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-4">
          <Quote className="w-4 h-4" />
          Testimonials
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
            What Our Community
          </span>
          <br />
          <span className="text-slate-900">Says</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Hear from students and parents about their experiences at Heal Paradise School
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-white border-2 border-blue-100/80 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/60 to-sky-100/60 rounded-full blur-3xl -mr-16 -mt-16"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          ></motion.div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="w-14 h-14 text-blue-200 mb-5" />
            </motion.div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
              "Heal Paradise School has transformed my daughter's life. The caring teachers and excellent facilities have given her confidence and hope for a bright future."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-blue-100">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                P
              </motion.div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Parent Name</h4>
                <p className="text-sm text-slate-600">Parent of Class 8 Student</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-white border-2 border-emerald-100/80 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/60 to-green-100/60 rounded-full blur-3xl -mr-16 -mt-16"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          ></motion.div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="w-14 h-14 text-emerald-200 mb-5" />
            </motion.div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
              "I never imagined I could get such quality education for free. The teachers are amazing, and I've made so many friends. This school is my second home."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-emerald-100">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                S
              </motion.div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Student Name</h4>
                <p className="text-sm text-slate-600">Class 10 Student</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-white border-2 border-amber-100/80 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/60 to-yellow-100/60 rounded-full blur-3xl -mr-16 -mt-16"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          ></motion.div>
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="w-14 h-14 text-amber-200 mb-5" />
            </motion.div>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
              "The residential care and academic support here are exceptional. My son has grown so much in confidence and academic performance. We're truly grateful."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-amber-100">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                P
              </motion.div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Parent Name</h4>
                <p className="text-sm text-slate-600">Parent of Class 6 Student</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Upcoming Events & News */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200/60 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-4">
          <Calendar className="w-4 h-4" />
          Latest Updates
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
            Upcoming Events
          </span>
          <br />
          <span className="text-slate-900">& News</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Stay updated with our latest events, achievements, and announcements
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border-2 border-blue-100/80 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[280px]"
        >
          <motion.div 
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-xl mb-4"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <div className="text-sm text-blue-600 font-bold mb-2">Upcoming Event</div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">Annual Sports Day</h3>
            <p className="text-sm sm:text-base text-slate-700 mb-3 leading-relaxed max-w-full">Join us for our annual sports day celebration with exciting competitions and performances.</p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>March 15, 2024</span>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-green-50 border-2 border-emerald-100/80 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[280px]"
        >
          <motion.div 
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl mb-4"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <div className="text-sm text-emerald-600 font-bold mb-2">Achievement</div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">Board Exam Excellence</h3>
            <p className="text-sm sm:text-base text-slate-700 mb-3 leading-relaxed max-w-full">Our students achieve outstanding results in CBSE board examinations with 95% pass rate.</p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>February 2024</span>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-violet-50 border-2 border-purple-100/80 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[280px]"
        >
          <motion.div 
            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl mb-4"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            <div className="text-sm text-purple-600 font-bold mb-2">Announcement</div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">Admissions Open</h3>
            <p className="text-sm sm:text-base text-slate-700 mb-3 leading-relaxed max-w-full">New academic year admissions are now open. Apply for 100% scholarship programs.</p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>Ongoing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Mission */}
    <section id="mission" className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-6"
          spotlightColor="#3b82f630"
        >
          <h3 className="text-lg font-semibold text-slate-900">CBSE Curriculum</h3>
          <p className="mt-2 text-sm text-slate-700">
            Rigorous, future‑ready academics with experienced faculty and holistic evaluation.
          </p>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-6"
          spotlightColor="#0ea5e930"
        >
          <h3 className="text-lg font-semibold text-slate-900">100% Free Care</h3>
          <p className="mt-2 text-sm text-slate-700">
            No tuition, free accommodation, nutritious meals, and essential supplies.
          </p>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-6"
          spotlightColor="#8b5cf630"
        >
          <h3 className="text-lg font-semibold text-slate-900">Inclusive Support</h3>
          <p className="mt-2 text-sm text-slate-700">
            Prioritizing under‑privileged students, single‑parent children, and orphans.
          </p>
        </SpotlightCard>
        <SpotlightCard
          className="rounded-2xl border border-white/60 bg-neutral-200/40 backdrop-blur p-6"
          spotlightColor="#06b6d430"
        >
          <h3 className="text-lg font-semibold text-slate-900">Whole‑Child Growth</h3>
          <p className="mt-2 text-sm text-slate-700">
            Sports, arts, STEM labs, values education, and wellbeing programs.
          </p>
        </SpotlightCard>
      </div>
    </section>

  

    {/* Call To Action */}
    <section id="admissions" className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 md:p-12 lg:p-16 shadow-2xl"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-300/50 to-sky-300/50 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -left-16 -bottom-16 h-96 w-96 rounded-full bg-gradient-to-br from-sky-300/50 to-blue-300/50 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-sky-100 border border-blue-200/60 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Admissions Now Open
          </motion.div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
              Admissions Open
            </span>
            <br />
            <span className="text-slate-900">100% Scholarship</span>
          </h3>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed mb-8 font-medium">
            For under‑privileged students, single‑parent children, and orphans. Join a nurturing
            CBSE school with complete residential support at no cost.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Application
                <motion.svg 
                  className="w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group rounded-full bg-white/90 backdrop-blur-md border-2 border-blue-200/60 px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-white hover:border-blue-300"
            >
              Download Prospectus
            </motion.a>
          </div>
        </div>
      </motion.div>
      
    </section>
    </>
  )
}

export default LandingPage;
