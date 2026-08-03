'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        login(res.data.data);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Join the Club</h2>
          <p className="text-sm text-gray-500 mt-2">Start managing your personal library</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Name"
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message as string}
            {...register('name', { required: 'Name is required' })}
          />
          <Input 
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message as string}
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            })}
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message as string}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Must be at least 6 characters' }
            })}
          />

          <Button type="submit" className="w-full h-12 text-lg rounded-xl mt-4" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
