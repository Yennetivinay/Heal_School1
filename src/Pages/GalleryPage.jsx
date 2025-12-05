import React from 'react';
import { motion } from 'framer-motion';
import { MorphingCardStack } from '../components/gallery/MorphingCardStack';
import { 
  Camera, 
  GraduationCap, 
  Users, 
  Trophy, 
  Music, 
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Video,
  Heart
} from 'lucide-react';

const GalleryPage = () => {
  // Gallery categories with images
  const galleryCards = [
    {
      id: 'academic',
      title: 'Academic Excellence',
      description: 'Students engaged in learning, science experiments, and academic competitions showcasing our educational achievements.',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'rgba(59, 130, 246, 0.1)',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'sports',
      title: 'Sports & Athletics',
      description: 'Action-packed moments from our sports events, competitions, and physical education activities.',
      icon: <Trophy className="w-5 h-5" />,
      color: 'rgba(14, 165, 233, 0.1)',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'cultural',
      title: 'Cultural Events',
      description: 'Vibrant celebrations of our annual day, cultural festivals, dance performances, and artistic expressions.',
      icon: <Music className="w-5 h-5" />,
      color: 'rgba(59, 130, 246, 0.1)',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'community',
      title: 'Community Service',
      description: 'Our students making a difference through community outreach, social service, and environmental initiatives.',
      icon: <Heart className="w-5 h-5" />,
      color: 'rgba(14, 165, 233, 0.1)',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'infrastructure',
      title: 'Campus & Facilities',
      description: 'A glimpse into our modern classrooms, laboratories, library, sports facilities, and residential areas.',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'rgba(59, 130, 246, 0.1)',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'achievements',
      title: 'Awards & Recognition',
      description: 'Celebrating our achievements, awards ceremonies, and moments of recognition for excellence.',
      icon: <Trophy className="w-5 h-5" />,
      color: 'rgba(14, 165, 233, 0.1)',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'daily-life',
      title: 'Daily Life',
      description: 'Candid moments from daily school life, meals, study sessions, and interactions between students and teachers.',
      icon: <Users className="w-5 h-5" />,
      color: 'rgba(59, 130, 246, 0.1)',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'special-events',
      title: 'Special Events',
      description: 'Memorable occasions including graduation ceremonies, guest lectures, workshops, and special celebrations.',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'rgba(14, 165, 233, 0.1)',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  const handleCardClick = (card) => {
    console.log('Card clicked:', card);
    // You can add navigation or modal opening logic here
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/20 via-sky-200/20 to-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-16 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm mb-4"
            >
              <Camera className="w-4 h-4" />
              Photo Gallery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-4"
            >
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                Our Gallery
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Capturing moments of excellence, joy, and achievement in our school community
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Morphing Card Stack Gallery */}
      <section className="relative py-8 md:py-12 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-3 text-center">
              Explore Our <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Collections</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-center">
              Switch between stack, grid, and list views to browse our gallery
            </p>
          </motion.div>

          <MorphingCardStack
            cards={galleryCards}
            defaultLayout="stack"
            onCardClick={handleCardClick}
            className="min-h-[600px]"
          />
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative py-8 md:py-12 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6"
          >
            {[
              {
                icon: <ImageIcon className="w-8 h-8" />,
                title: '500+ Photos',
                description: 'High-quality images capturing our school life',
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: '100+ Videos',
                description: 'Recorded moments from events and activities',
              },
              {
                icon: <Camera className="w-8 h-8" />,
                title: 'Regular Updates',
                description: 'New content added weekly from various events',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative rounded-2xl bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm border border-white/60 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 mb-4 text-white shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-700">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;

