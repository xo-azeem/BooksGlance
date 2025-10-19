import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowRightIcon, SparklesIcon, BookOpenIcon, StarIcon } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-16"
        >
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white/90">New Collection Available</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Discover Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent">
                Next Adventure
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl"
            >
              Immerse yourself in our curated collection of books that transport you to new worlds, 
              expand your mind, and ignite your imagination.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/categories"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-glow"
                >
                  <BookOpenIcon className="w-5 h-5" />
                  Explore Collection
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/best-sellers"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white glass border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <StarIcon className="w-5 h-5" />
                  Best Sellers
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 mt-16 justify-center lg:justify-start"
            >
              {[
                { number: "10K+", label: "Books Available" },
                { number: "50+", label: "Categories" },
                { number: "99%", label: "Happy Readers" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Floating Book Cards */}
          <div className="lg:w-1/2 relative">
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="relative"
            >
              {/* Main Book Stack */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass rounded-3xl p-6 border border-white/20 shadow-glass">
                  <img
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                    alt="Book Collection"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Featured Collection</h3>
                    <p className="text-white/70">Discover our handpicked selection of must-read books</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className="absolute -top-4 -right-4 glass rounded-2xl p-4 border border-white/20 shadow-glass"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-16 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 border border-white/20 shadow-glass"
                animate={{
                  y: [5, -5, 5],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-16 h-20 bg-gradient-to-br from-accent-400 to-primary-400 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;