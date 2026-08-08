'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 dark:border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              BookManager
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hidden sm:flex">Dashboard</Button>
                </Link>
                <Button onClick={logout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/20 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={toggleMenu}>
                    <Button className="w-full justify-center h-12 text-lg">Dashboard</Button>
                  </Link>
                  <Button onClick={() => { logout(); toggleMenu(); }} variant="outline" className="w-full justify-center h-12 text-lg border-red-200 text-red-600 dark:border-red-900 dark:text-red-400">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full justify-center h-12 text-lg border-gray-300 dark:border-gray-700">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={toggleMenu}>
                    <Button className="w-full justify-center h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
