'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: any; // If book is passed, it's edit mode
  onSuccess: () => void;
}

export default function BookModal({ isOpen, onClose, book, onSuccess }: BookModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        description: book.description || '',
        coverImage: book.coverImage || '',
        genre: book.genre || 'Uncategorized',
        tags: book.tags ? book.tags.join(', ') : '',
        status: book.status || 'Want to Read',
        rating: book.rating || '',
        isFavorite: book.isFavorite || false,
      });
    } else {
      reset({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        genre: 'Uncategorized',
        tags: '',
        status: 'Want to Read',
        rating: '',
        isFavorite: false,
      });
    }
  }, [book, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      // Format tags
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        rating: data.rating ? parseInt(data.rating, 10) : null,
      };

      if (book) {
        await api.put(`/books/${book._id}`, formattedData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', formattedData);
        toast.success('Book added successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Title *"
                placeholder="The Great Gatsby"
                error={errors.title?.message as string}
                {...register('title', { required: 'Title is required' })}
              />
              <Input
                label="Author *"
                placeholder="F. Scott Fitzgerald"
                error={errors.author?.message as string}
                {...register('author', { required: 'Author is required' })}
              />
            </div>

            <Input
              label="Cover Image URL"
              placeholder="https://example.com/cover.jpg"
              {...register('coverImage')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Genre"
                placeholder="Fiction, Sci-Fi..."
                {...register('genre')}
              />
              <Input
                label="Tags (comma separated)"
                placeholder="classic, 1920s, must-read"
                {...register('tags')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  className="flex h-10 w-full rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white"
                  {...register('status')}
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <Input
                label="Rating (1-5)"
                type="number"
                min="1"
                max="5"
                placeholder="5"
                {...register('rating')}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Notes</label>
              <textarea
                className="flex w-full rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white min-h-[100px] resize-y"
                placeholder="Write your thoughts..."
                {...register('description')}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFavorite"
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                {...register('isFavorite')}
              />
              <label htmlFor="isFavorite" className="text-sm text-gray-700 dark:text-gray-300">Mark as Favorite ❤️</label>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>{book ? 'Save Changes' : 'Add Book'}</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
