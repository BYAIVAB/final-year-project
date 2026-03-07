import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ scrollY, onChatClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = scrollY > 50;

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '/dashboard', isRoute: true },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0A0E27]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">MedAI</span>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          ))}
          <button 
            onClick={onChatClick}
            className="px-5 py-2 rounded-full font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          >
            Try AI Assistant
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0A0E27]/95 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col items-center py-6 space-y-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link 
                  key={link.name} 
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-200 hover:text-white"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-lg font-medium text-slate-200 hover:text-white"
                >
                  {link.name}
                </a>
              )
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                onChatClick();
              }}
              className="mt-4 px-8 py-3 rounded-full font-medium text-white bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] w-3/4 max-w-xs"
            >
              Try AI Assistant
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
