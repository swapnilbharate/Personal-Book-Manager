'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

const COLORS = ['#6366f1', '#ec4899', '#10b981'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/books/stats/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  const pieData = [
    { name: 'Want to Read', value: stats?.statusCounts['Want to Read'] || 0 },
    { name: 'Reading', value: stats?.statusCounts['Reading'] || 0 },
    { name: 'Completed', value: stats?.statusCounts['Completed'] || 0 },
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening in your library today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Books" 
            value={stats?.totalBooks || 0} 
            icon={<Book className="w-5 h-5 text-indigo-500" />} 
            bg="bg-indigo-500/10" 
          />
          <StatCard 
            title="Reading Now" 
            value={stats?.statusCounts['Reading'] || 0} 
            icon={<Clock className="w-5 h-5 text-pink-500" />} 
            bg="bg-pink-500/10" 
          />
          <StatCard 
            title="Completed" 
            value={stats?.statusCounts['Completed'] || 0} 
            icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
            bg="bg-emerald-500/10" 
          />
          <StatCard 
            title="Added This Month" 
            value={stats?.booksAddedThisMonth || 0} 
            icon={<TrendingUp className="w-5 h-5 text-amber-500" />} 
            bg="bg-amber-500/10" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="glass-card p-4 sm:p-6 rounded-3xl lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Reading Status</h3>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No data to display
                </div>
              )}
            </div>
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart (Top Genres) */}
          <div className="glass-card p-4 sm:p-6 rounded-3xl lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Genres</h3>
            <div className="h-64">
              {stats?.topGenres && stats.topGenres.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topGenres} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Add books with genres to see your stats!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 sm:p-6 rounded-3xl flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h4>
      </div>
    </motion.div>
  );
}
