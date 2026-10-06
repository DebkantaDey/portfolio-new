'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { authStorage } from '../../../lib/auth';
import { useToast } from '../../../components/ui/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@alexmorgan.dev');
  const [password, setPassword] = useState('AdminPassword123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      authStorage.setToken(res.token);
      authStorage.setUser(res.user);
      toast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${res.user.name || 'Admin'}!`,
      });
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@alexmorgan.dev');
    setPassword('AdminPassword123!');
    toast({
      type: 'info',
      title: 'Credentials Injected',
      message: 'Default admin credentials populated.',
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 relative overflow-hidden bg-grid">
      {/* Ambient background glow in #0F9A73 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0F9A73]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border-2 border-[#00007B]/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#00007B] hover:text-[#0F9A73] font-bold">
            <span>&larr; Back to Portfolio</span>
          </Link>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#0F9A73] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0F9A73] animate-pulse" />
            <span>Auth v2.4</span>
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#0F9A73]/15 border border-[#0F9A73]/40 items-center justify-center text-[#0F9A73] mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#00007B] tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-[#00007B]/70 mt-1">Authenticate to manage portfolio systems</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                placeholder="admin@alexmorgan.dev"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#00007B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#00007B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8fafd] border border-[#00007B]/20 text-[#00007B] placeholder:text-[#00007B]/40 text-sm focus:outline-none focus:border-[#0F9A73] focus:bg-white transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono text-[#0F9A73] hover:underline flex items-center gap-1 font-bold"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Default Admin Credentials</span>
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full justify-center bg-[#0F9A73] hover:bg-[#12b88a] text-white font-bold shadow-md mt-2"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#00007B]/10 text-center">
          <p className="text-[11px] text-[#00007B]/60 font-mono font-semibold">
            Palette: #00007B • #fff • #0F9A73
          </p>
        </div>
      </div>
    </div>
  );
}
