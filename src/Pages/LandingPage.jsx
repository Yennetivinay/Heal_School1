import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import TextCard from '../components/TextCard';
import { TeamTestimonials } from '../components/TeamTeastimonials';
import { SpotlightCard } from '../components/SpotlightCard';
import Gallery from '../components/GalleryLanding';

import { GraduationCap, Trophy, Award, Medal, Star } from 'lucide-react';
import videoSrc from '../assets/Hero vid.mp4';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// Simple Lazy Video Component - Loads only when visible, pauses when out of view
const LazyVideo = ({ videoSource, title }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
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
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [shouldLoad]);

  // Pause/resume video based on visibility
  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;

    const video = videoRef.current;
    
    if (isVisible) {
      // Resume video when visible
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Handle autoplay restrictions
          console.log('Video play failed:', error);
        });
      }
    } else {
      // Pause video when out of view
      video.pause();
    }
  }, [isVisible, shouldLoad]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full">
      {shouldLoad ? (
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.78vh',
            objectFit: 'cover'
          }}
          src={videoSource}
          muted
          loop
          playsInline
          preload="metadata"
          title={title}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-900 w-full h-full" />
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/0 w-full h-full" />
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
    

    {/* Our Mission & Vision */}
    <section id="vision" className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Our Mission */}
        <TextCard
          title="Our Mission"
          description="To provide world-class CBSE education with complete residential care, free of cost, 
            to underprivileged children, single-parent families, and orphans. We are committed to 
            nurturing each child's potential through holistic education, compassionate support, and 
            values-based learning that empowers them to become confident, responsible, and successful 
            individuals who can transform their communities."
          icon={GraduationCap}
          iconGradient="from-blue-500 to-sky-500"
        />

        {/* Our Vision */}
        <TextCard
          title="Our Vision"
          description="To be a beacon of hope and excellence in education, creating a nurturing environment 
            where every child, regardless of their background, receives equal opportunities to excel. 
            We envision a future where our students become leaders, innovators, and change-makers, 
            breaking cycles of poverty through education and contributing meaningfully to society 
            with integrity, compassion, and excellence."
          icon={GraduationCap}
          iconGradient="from-sky-500 to-blue-500"
        />
      </div>
    </section>

    {/* Gallery Section */}
    <section id="gallery" className="w-full mb-5 pb-10 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 rounded-3xl overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
      {/* Text and Illustration Section */}
      
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Text Content */}
          <div className="space-y-6 flex flex-col justify-center pl-4 md:pl-6 lg:pl-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              We are on a mission to transform lives through quality education and compassionate care
            </h2>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              At Heal Paradise School, we believe every child deserves access to world-class education, regardless of their circumstances. Through our comprehensive scholarship program and residential care, we're building a future where every student can dream, achieve, and inspire.
            </p>
          </div>

          {/* Illustration/Cartoon */}
          <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[500px] w-full">
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-transparent rounded-3xl p-4 md:p-6 lg:p-8 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden">
                <DotLottieReact 
                  src="https://lottie.host/4d9ea1cd-2ace-4050-b163-f474e23c12ff/RKARS6NZe4.lottie"
                  loop
                  autoplay
                  className="w-full h-full rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Component */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Gallery />
      </div>
      
      {/* View More Button */}
      <div className="mx-auto max-w-7xl px-6">
      <div className="flex justify-center pt-8">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-sky-600 transition-all duration-300 hover:scale-105"
        >
          View More
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Link>
      </div>
      </div>

      {/* Award Cards Section */}
      <div className="mx-auto max-w-7xl px-6">
      <div className="mt-12 md:mt-16">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-8 md:mb-12">
          Our Achievements & Recognition
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Award Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-200 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/30 to-yellow-300/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Excellence in Education</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Recognized for outstanding academic performance and student achievement
              </p>
              <div className="mt-4 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Award Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 border-2 border-blue-200 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-sky-300/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Best CBSE School</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Awarded for maintaining highest standards in CBSE curriculum delivery
              </p>
              <div className="mt-4 flex items-center gap-1">
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Award Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-2 border-emerald-200 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-300/30 to-green-300/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Social Impact Award</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Honored for transforming lives of underprivileged children through education
              </p>
              <div className="mt-4 flex items-center gap-1">
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Award Card 4 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 border-2 border-purple-200 p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-300/30 to-violet-300/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Innovation in Teaching</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Recognized for innovative teaching methods and holistic student development
              </p>
              <div className="mt-4 flex items-center gap-1">
                <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
                <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
                <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
                <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
                <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>

    {/* Founder Message */}
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 md:p-10 lg:p-12 shadow-2xl border border-blue-100/50 transition-all duration-500 hover:from-blue-100 hover:via-blue-50 hover:to-sky-100 hover:shadow-3xl hover:border-blue-200/70 hover:scale-[1.02] active:scale-[1.01]">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-sky-200/20 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-500 group-hover:from-blue-300/40 group-hover:to-sky-300/40 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-200/20 to-blue-200/20 rounded-full blur-3xl -ml-48 -mb-48 transition-all duration-500 group-hover:from-sky-300/40 group-hover:to-blue-300/40 group-hover:scale-110"></div>
        
        <div className="relative z-10 grid md:grid-cols-4 gap-6 md:gap-8 items-center px-4 md:px-6">
          {/* Left Side - Founder Image and Name */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <div className="relative group mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl ring-2 ring-white/50 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 transition-all duration-500 group-hover:from-blue-900 group-hover:to-slate-800">
                Founder Name
              </h3>
              <p className="text-lg md:text-xl bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent font-semibold transition-all duration-500 group-hover:from-blue-700 group-hover:to-sky-700">
                Founder & Director
              </p>
            </div>
          </div>

          {/* Right Side - Founder Message */}
          <div className="relative pl-0 md:pl-8 md:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full transition-all duration-500 group-hover:w-16 group-hover:from-blue-600 group-hover:to-sky-600"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                <span className="text-slate-900">Message from the </span>
                <span className="text-blue-600">Founder</span>
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
          </div>
        </div>
      </div>
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
    <section id="admissions" className="mx-auto max-w-7xl px-6 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/40 to-sky-200/40 blur-3xl animate-pulse" />
          <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 to-blue-200/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent mb-4">
            Admissions Open — 100% Scholarship
          </h3>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">
            For under‑privileged students, single‑parent children, and orphans. Join a nurturing
            CBSE school with complete residential support at no cost.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="group rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-slate-800 hover:to-slate-700"
            >
              Start Application
            </a>
            <a
              href="#"
              className="group rounded-full bg-white/80 backdrop-blur-md border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white hover:border-slate-300"
            >
              Download Prospectus
            </a>
          </div>
        </div>
      </div>
      
    </section>
    </>
  )
}

export default LandingPage;
