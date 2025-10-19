import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SearchIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  UserIcon, 
  SunIcon, 
  MoonIcon, 
  MenuIcon, 
  XIcon,
  BookOpenIcon,
  SparklesIcon
} from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Best Sellers', path: '/best-sellers' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Authors', path: '/authors' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass border-b border-white/20 shadow-glass' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 glass rounded-2xl border border-white/20">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                BookHaven
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-white glass border border-white/30'
                      : 'text-white/80 hover:text-white hover:glass hover:border-white/20'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 glass border border-white/30 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block w-1/3 max-w-md">
            <motion.form
              onSubmit={handleSearch}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-6 pr-12 rounded-2xl text-sm glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
              />
              <motion.button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl glass border border-white/20 text-white hover:bg-primary-500/80 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SearchIcon size={16} />
              </motion.button>
            </motion.form>
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {[
              { icon: HeartIcon, label: 'Wishlist', color: 'hover:bg-accent-500/80' },
              { icon: ShoppingCartIcon, label: 'Cart', color: 'hover:bg-primary-500/80', link: '/cart' },
              { icon: UserIcon, label: 'User Profile', color: 'hover:bg-secondary-500/80' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className={`p-3 rounded-2xl glass border border-white/20 text-white transition-all duration-300 ${item.color}`}
                    aria-label={item.label}
                  >
                    <item.icon size={18} />
                  </Link>
                ) : (
                  <button
                    className={`p-3 rounded-2xl glass border border-white/20 text-white transition-all duration-300 ${item.color}`}
                    aria-label={item.label}
                  >
                    <item.icon size={18} />
                  </button>
                )}
              </motion.div>
            ))}

            <motion.button
              onClick={toggleTheme}
              className="p-3 rounded-2xl glass border border-white/20 text-white hover:bg-yellow-500/80 transition-all duration-300"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-3 rounded-2xl glass border border-white/20 text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XIcon size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuIcon size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Search Bar */}
        <motion.div
          className="md:hidden pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-6 pr-12 rounded-2xl text-sm glass border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl glass border border-white/20 text-white hover:bg-primary-500/80 transition-all duration-300"
            >
              <SearchIcon size={16} />
            </button>
          </form>
        </motion.div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden py-6 glass rounded-3xl border border-white/20 mb-4"
            >
              <nav className="flex flex-col space-y-2 px-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-white transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'glass border border-white/30'
                          : 'hover:glass hover:border-white/20'
                      }`}
                      onClick={toggleMenu}
                    >
                      <SparklesIcon size={16} />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-white/20 px-4">
                {[
                  { icon: HeartIcon, label: 'Wishlist' },
                  { icon: ShoppingCartIcon, label: 'Cart', link: '/cart' },
                  { icon: UserIcon, label: 'Profile' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.link ? (
                      <Link
                        to={item.link}
                        className="p-3 rounded-2xl glass border border-white/20 text-white hover:bg-primary-500/80 transition-all duration-300"
                        aria-label={item.label}
                        onClick={toggleMenu}
                      >
                        <item.icon size={18} />
                      </Link>
                    ) : (
                      <button
                        className="p-3 rounded-2xl glass border border-white/20 text-white hover:bg-primary-500/80 transition-all duration-300"
                        aria-label={item.label}
                      >
                        <item.icon size={18} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;