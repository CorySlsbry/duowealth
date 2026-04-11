import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div className="font-bold text-3xl tracking-tight">
            <span className="text-[#0D9488]">Duo</span>
            <span className="text-[#e8e8f0]">Wealth</span>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-[#0D9488] mb-4">404</h1>
        <p className="text-lg text-[#e8e8f0] mb-2">Page Not Found</p>
        <p className="text-sm text-[#8888a0] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg font-semibold text-[#e8e8f0] bg-[#1e1e2e] hover:bg-[#2a2a3d] transition text-sm"
          >
            Go to Homepage
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-lg font-semibold text-white bg-[#0D9488] hover:bg-[#0b7d72] transition text-sm"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
