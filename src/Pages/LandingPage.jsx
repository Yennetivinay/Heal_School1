import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer';
import TextCard from '../components/TextCard';
import CardCarousel from '../components/CardCarousel';
import { SpotlightCard } from '../components/SpotlightCard';
import { GraduationCap } from 'lucide-react';
import videoSrc from '../assets/Hero vid.mp4';


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
        className={`fixed top-0 left-0 right-0 z-10 mx-auto max-w-7xl px-6 pt-8 pb-28 text-center h-screen flex flex-col justify-center transition-opacity duration-300 ${
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
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/90 drop-shadow sm:text-lg min-h-[4rem]">
            {typedText}
            {isTyping && typedText.length < FULL_TEXT.length && (
              <span className="animate-pulse">|</span>
            )}
          </p>
          <div 
            ref={buttonsRef} 
            className={`mt-30 flex flex-nowrap items-center justify-center gap-3 transition-all duration-700 ease-out ${
              showButtons 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href="#admissions"
              className="rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:from-blue-700 hover:to-sky-600 whitespace-nowrap"
            >
              Apply for Admission
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
    <section id="vision" className="mx-auto max-w-7xl px-6 py-20">
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

    {/* Founder Message */}
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-white p-8 md:p-12 shadow-xl">
        <div className="grid md:grid-cols-4 gap-1 md:gap-2 items-center">
          {/* Left Side - Founder Image and Name */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-sky-400 shadow-2xl ring-4 ring-sky-100 mb-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Founder Name</h3>
              <p className="text-lg md:text-xl text-sky-600 font-semibold">Founder & Director</p>
            </div>
          </div>

          {/* Right Side - Founder Message */}
          <div className="relative pl-0 md:pl-0 md:col-span-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 text-center md:text-left">
              Message from the Founder
            </h2>
            <div className="absolute -top-4 -left-2 md:-left-4 text-6xl text-sky-200/50 font-serif">"</div>
            <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed relative z-10 italic font-medium pl-4 md:pl-0">
              Education is the most powerful weapon which you can use to change the world. At Heal Paradise 
              School, we believe that every child deserves access to quality education, regardless of their 
              circumstances. Our mission is to break barriers and create opportunities for those who need it most. 
              Through compassion, dedication, and excellence, we are building a future where every child can dream, 
              achieve, and inspire.
            </p>
            <div className="absolute -bottom-4 -right-4 text-6xl text-sky-200/50 font-serif">"</div>
          </div>
        </div>
      </div>
    </section>

    {/* Team/Leadership Carousel */}
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-4">
          Our Leadership Team
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Meet the dedicated leaders who guide our mission of excellence and compassion
        </p>
      </div>
      
      <CardCarousel 
        members={[
          {
            id: 1,
            name: "Dr. John Smith",
            designation: "Principal",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            details: "With over 20 years of experience in education, Dr. Smith leads our academic excellence initiatives."
          },
          {
            id: 2,
            name: "Ms. Sarah Johnson",
            designation: "Vice Principal",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
            details: "Passionate about student welfare and holistic development, Ms. Johnson ensures every child receives personalized attention."
          },
          {
            id: 3,
            name: "Mr. David Williams",
            designation: "Head of Academics",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
            details: "An expert in curriculum development, Mr. Williams designs innovative learning programs for our students."
          }
        ]}
      />
    </section>

 
  {/* Mission */}
    <section id="mission" className="mx-auto max-w-7xl px-6 py-16">
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

    {/* Programs */}
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop"
              alt="STEM Labs"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">STEM & Innovation</h3>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              Modern science labs, coding clubs, and hands‑on projects build curiosity and
              problem‑solving skills.
            </p>
          </div>
        </div>
        <div className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1600&auto=format&fit=crop"
              alt="Residential Care"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Residential Care</h3>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              Safe hostels, dedicated mentors, and balanced routines ensure comfort and growth.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Call To Action */}
    <section id="admissions" className="mx-auto max-w-7xl px-6 pb-24">
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
    
    {/* Footer */}
    <Footer />
    </>
  )
}

export default LandingPage;
