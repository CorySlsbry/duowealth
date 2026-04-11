'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Receipt,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Budget', href: '/dashboard/budget', icon: TrendingUp },
  { label: 'Goals', href: '/dashboard/goals', icon: Target },
  { label: 'Bills', href: '/dashboard/bills', icon: Receipt },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Partner';
        setUserName(name);
      }
    };
    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/';
    return pathname?.startsWith(href);
  };

  const sidebarOpen = !sidebarCollapsed;

  return (
    <div className="bg-[#0a0a0f] text-[#e8e8f0] min-h-screen flex">
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 transition-all duration-300 flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#12121a] border-r border-[#2a2a3d]`}
      >
        {/* Logo */}
        <div
          className="h-16 border-b border-[#2a2a3d] flex items-center justify-center px-4 cursor-pointer"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center font-bold text-sm text-white">
                DW
              </div>
              <span className="font-bold text-lg">
                Duo<span className="text-[#0D9488]">Wealth</span>
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center font-bold text-sm text-white">
              DW
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/20'
                      : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d]'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-[#2a2a3d] p-3 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1a1a26] rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#0D9488] flex items-center justify-center font-bold text-xs flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{userName || 'Loading...'}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 z-50 bg-[#12121a] border-r border-[#2a2a3d] flex flex-col lg:hidden">
            <div className="h-16 border-b border-[#2a2a3d] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0D9488] flex items-center justify-center font-bold text-xs text-white">DW</div>
                <span className="font-bold">Duo<span className="text-[#0D9488]">Wealth</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#8888a0]">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-[#0D9488] text-white'
                          : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#2a2a3d]'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[#2a2a3d] p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8888a0] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <div className="h-14 sm:h-16 border-b border-[#2a2a3d] bg-[#12121a] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0]"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold">
              {navItems.find((n) => isActive(n.href))?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#2a2a3d] rounded-lg text-[#8888a0] hover:text-[#e8e8f0] transition">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D9488]/15 rounded-full text-[#0D9488] text-xs font-medium">
              <Heart size={12} />
              <span>Together</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#0a0a0f]">
          <div className="p-3 sm:p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
