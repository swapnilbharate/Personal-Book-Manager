'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null; // Or a nice splash screen

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-6 sm:px-12 text-center min-h-screen">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>The Next Generation Reading App</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
          Your Books, <br />Beautifully Managed.
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Elevate your reading habit. Track progress, curate collections, and visualize your literary journey in a stunning, distraction-free environment.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16"
        >
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-indigo-500" />}
            title="Curate Collections"
            desc="Organize your library elegantly. Categorize by status, genre, and custom tags."
          />
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-pink-500" />}
            title="Track Progress"
            desc="Stay motivated with beautiful charts, streaks, and reading goal insights."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
            title="Secure & Private"
            desc="Your data belongs to you. Fully encrypted, secure authentication."
          />
        </motion.div>
      </motion.div>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-6 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-300">
      <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center mb-4 shadow-sm border border-white/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
