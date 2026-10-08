'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage } from '../../lib/auth';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not authenticated and trying to access any admin route other than /admin/login
    if (!authStorage.isAuthenticated() && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // If on login page, render plain without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0F9A73] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#0a0e1a] transition-colors duration-200">
      {/* Desktop Fixed Sidebar on Left */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 h-screen z-30 bg-white dark:bg-[#0e1424] border-r border-[#00007B]/15 dark:border-white/10">
        <AdminSidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-screen bg-white dark:bg-[#0e1424] shadow-2xl border-r border-[#00007B]/15 dark:border-white/10">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area (Offset by 64 on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-[80%] lg:max-w-none mx-auto bg-[#f8fafd] dark:bg-[#0a0e1a]">
          {children}
        </main>
      </div>
    </div>
  );
}
