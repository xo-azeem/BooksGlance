import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import HeroSection from '../components/Home/HeroSection';
import CategoryCard from '../components/Categories/CategoryCard';
import BookGrid from '../components/Books/BookGrid';
import BookCard from '../components/Books/BookCard';
import { genres, getFeaturedBooks, getBestSellers, getNewArrivals } from '../data/books';
import { ArrowRightIcon, SparklesIcon, MailIcon } from 'lucide-react';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const featuredBooks = getFeaturedBooks();
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white/90">Explore Categories</span>
            </motion.div>
            
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
            >
              Browse by Category
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our extensive collection organized by genres to find exactly what you're looking for.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {genres.map((genre, index) => (
              <motion.div
                key={genre.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryCard name={genre.name} icon={genre.icon} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Books Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Featured Books
              </h2>
              <p className="text-xl text-white/80">
                Handpicked selections from our editors
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link
                to="/categories"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white glass border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                View All Books
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <BookGrid books={featuredBooks} title="" />
        </div>
      </motion.section>

      {/* Best Sellers & New Arrivals Sections */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Best Sellers */}
            <motion.div variants={itemVariants}>
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  Best Sellers
                </h2>
                <Link
                  to="/best-sellers"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bestSellers.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </motion.div>

            {/* New Arrivals */}
            <motion.div variants={itemVariants}>
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  New Arrivals
                </h2>
                <Link
                  to="/new-arrivals"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {newArrivals.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 mb-6"
            >
              <MailIcon className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white/90">Stay Updated</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
            >
              Stay Updated with BookHaven
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Subscribe to our newsletter for the latest releases, exclusive deals, and reading recommendations.
            </motion.p>

            <motion.form
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-6 py-4 rounded-2xl glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
              />
              <motion.button
                type="submit"
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;