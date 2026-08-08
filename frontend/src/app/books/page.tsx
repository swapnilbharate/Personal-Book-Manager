'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Heart, BookOpen, Star } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import BookModal from '@/components/features/BookModal';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      // Construct query params
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await api.get(`/books?${params.toString()}`);
      setBooks(res.data.data);
    } catch (error) {
      console.error('Failed to fetch books', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const statusColors = {
    'Want to Read': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Reading': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Library</h1>
          <p className="text-gray-500 mt-1">Manage your collection of {books.length} books</p>
        </div>
        <Button onClick={openAddModal} className="flex-shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by title, author, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="bg-white/60 dark:bg-slate-800/60"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-gray-300 bg-white/60 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-slate-800/60 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No books found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {search || statusFilter ? 'Try adjusting your filters' : 'Your library is empty. Start adding some books!'}
          </p>
          {!(search || statusFilter) && <Button onClick={openAddModal}>Add Your First Book</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {books.map((book) => (
              <motion.div
                key={book._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-3xl overflow-hidden group flex flex-col h-full"
              >
                <div className="p-4 sm:p-5 flex-1 flex gap-3 sm:gap-4">
                  <div className="w-20 sm:w-24 h-28 sm:h-36 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md relative">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                    {book.isFavorite && (
                      <div className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full text-red-500">
                        <Heart className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={book.title}>
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{book.author}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[book.status as keyof typeof statusColors]}`}>
                        {book.status}
                      </span>
                    </div>

                    <div className="mt-auto pt-3">
                      {book.rating && (
                        <div className="flex items-center text-amber-500 text-sm mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < book.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Added {format(new Date(book.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50/50 dark:bg-black/20 px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(book)} className="h-8 text-xs">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(book._id)} className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <BookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        book={selectedBook}
        onSuccess={fetchBooks}
      />
    </DashboardLayout>
  );
}
