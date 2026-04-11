'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not send reset email. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#12121a] rounded-lg border border-[#1e1e2e] p-8 shadow-2xl">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-2xl tracking-tight">
              <span className="text-[#0D9488]">Duo</span><span className="text-[#e8e8f0]">Wealth</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-[#e8e8f0]">
            Reset Password
          </h2>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-700/50 rounded px-4 py-3 text-sm text-green-400 mb-6">
            <p className="font-medium mb-1">Check your email</p>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to reset your password.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          {!success && (
            <>
              <p className="text-sm text-[#8888a0] mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#e8e8f0] mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-2 rounded bg-[#0a0a0f] border border-[#1e1e2e] text-[#e8e8f0] placeholder-[#8888a0] focus:outline-none focus:border-[#0D9488] transition"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-700/50 rounded px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded font-semibold text-white bg-[#0D9488] hover:bg-[#0b7d72] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </>
          )}

          {success && (
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="w-full px-4 py-2 rounded font-semibold text-white bg-[#0D9488] hover:bg-[#0b7d72] transition"
            >
              Send Another Reset Link
            </button>
          )}
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-[#8888a0] hover:text-[#e8e8f0] transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
