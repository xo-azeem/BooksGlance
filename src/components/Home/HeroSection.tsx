import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animationVariants } from '../../utils/animations';
import OriginalBook from './OriginalBook';

// TypewriterText Component
interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  speed = 100 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

const HeroSection: React.FC = () => {

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Website Name */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-center -z-20 pt-8 pb-48 min-h-[80vh]">
        <h1 className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-black bg-gradient-to-r from-clay-300/15 via-terracotta-300/20 to-sand-300/15 dark:from-clay-600/25 dark:via-terracotta-600/30 dark:to-sand-600/25 bg-clip-text text-transparent font-very-tall tracking-[0.1em] leading-[0.3] select-none pointer-events-none whitespace-nowrap uppercase transform scale-y-[1.4]">
          BooksGlance
        </h1>
      </div>

      {/* Original 3D Book Background */}
      <OriginalBook />

      {/* Website Name at Top */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-12 transform -translate-x-1/2 z-30 pointer-events-auto text-center"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-clay-700 via-terracotta-700 to-clay-500 dark:from-cream-400 dark:via-cream-100 dark:to-sand-200 bg-clip-text text-transparent font-semibold tracking-wide leading-tight">
          BooksGlance
        </h1>
      </motion.div>

      <div className="relative z-20 container mx-auto px-6 py-20 pointer-events-none flex flex-col items-center justify-center min-h-screen">
        <motion.div
          variants={animationVariants.heroContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto pointer-events-auto"
        >

          {/* Main Heading with Typewriter Effect */}
          <motion.h2
            variants={animationVariants.heroText}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[0.9] tracking-wide"
          >
            <TypewriterText 
              text="Your Gateway to Stories"
              className="bg-gradient-to-r font-semibold from-terracotta-500 via-terracotta-600 to-sand-700 dark:from-terracotta-700 dark:via-sand-400 dark:to-clay-400 bg-clip-text text-transparent"
            />
          </motion.h2>

          {/* Subtitle with Typewriter Effect */}
          <motion.div
            variants={animationVariants.heroText}
            className="mb-12 relative"
          >
            <TypewriterText 
              text="Discover extraordinary books that inspire, educate, and transform your reading journey."
              className="text-xl md:text-2xl text-clay-600 dark:text-cream-400 leading-relaxed max-w-3xl mx-auto font-light font-display tracking-wide italic"
              delay={2000}
            />
            
            {/* Elegant decorative elements */}
            <motion.div
              className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-terracotta-400/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 3, duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-0.5 bg-gradient-to-l from-transparent via-sand-400/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 3.5, duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Floating particles around text */}
            <motion.div
              className="absolute -top-4 left-1/4 w-2 h-2 bg-terracotta-400/40 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
            <motion.div
              className="absolute -bottom-2 right-1/3 w-1.5 h-1.5 bg-sand-400/50 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4.5
              }}
            />
          </motion.div>

          {/* Action Button */}
          <motion.div
            variants={animationVariants.staggerContainer}
            className="flex justify-center pointer-events-auto"
          >
            <motion.div
              variants={animationVariants.buttonPrimary}
              whileHover={{ 
                scale: 1.05,
                y: -3,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <Link
                to="/categories"
                className="group relative inline-flex items-center px-16 py-6 rounded-2xl font-light text-xl text-clay-800 dark:text-cream-200 glass border-2 border-terracotta-300/40 hover:border-terracotta-400/60 transition-all duration-500 shadow-warm hover:shadow-glow-lg backdrop-blur-xl pointer-events-auto overflow-hidden font-display tracking-wide"
              >
                {/* Glassmorphic Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cream-100/30 via-sand-100/30 to-clay-100/30 dark:from-clay-800/30 dark:via-terracotta-800/30 dark:to-sand-800/30 rounded-2xl" />
                
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Content */}
                <span className="relative z-10 font-medium">Explore Collection</span>
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;