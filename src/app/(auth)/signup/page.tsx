'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { Check, Heart } from 'lucide-react';

const highlights = [
  'Shared couple dashboard',
  'Real-time partner sync',
  'Bill splitting & joint goals',
  '$5.99/mo for both partners',
];

function SignupContent() {
  const [fullName, setFullName] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setLoadingStep('Creating your account...');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NOTE: the signup API currently expects `companyName` as a required field.
        // We reuse it to store the couple\u2019s nickname until the API is refactored
        // to the couples tenancy model.
        body: JSON.stringify({ email, password, fullName, companyName: coupleName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Signing you in...');
      const supabase = createBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created but sign-in failed: ' + signInError.message);
        setLoading(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Getting your dashboard ready...');
      router.push('/dashboard');
      return;
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl">
        {/* Branding */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-2xl tracking-tight">
              <span className="text-[#0D9488]">Duo</span><span className="text-[#e8e8f0]">Wealth</span>
            </h1>
          </div>
          <h2 className="text-lg font-semibold text-[#e8e8f0]">
            Start Your Couple&apos;s Budget
          </h2>
          <p className="text-sm text-[#b0b0c8] mt-1">
            14-day free trial. No credit card required.
          </p>
        </div>

        {/* Highlights */}
        <div className="bg-[#0a0a0f] border border-[#2a2a3d] rounded-lg p-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {highlights.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check size={14} className="text-[#0D9488] flex-shrink-0" />
                <span className="text-xs text-[#b0b0c8]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
                Your Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex"
                required
                className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#0D9488] transition"
              />
            </div>

            <div>
              <label htmlFor="coupleName" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
                Couple Nickname
              </label>
              <input
                id="coupleName"
                type="text"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                placeholder="Alex & Sam"
                required
                className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#0D9488] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#0D9488] transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#e8e8f0] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                required
                minLength={6}
                className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#0D9488] transition"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-[#0D9488] hover:bg-[#0b7d72] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? loadingStep || 'Processing...' : 'Start Free Trial'}
          </button>

          <p className="text-center text-xs text-[#8888a0]">
            You won&apos;t be charged during your 14-day trial. Cancel anytime.
          </p>
        </form>

        {/* Links */}
        <div className="mt-5 text-center text-sm">
          <span className="text-[#8888a0]">Already have an account? </span>
          <Link
            href="/login"
            className="text-[#0D9488] hover:text-[#14b8a6] font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-xl">
        <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl text-center">
          <div className="text-[#8888a0]">Loading...</div>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
