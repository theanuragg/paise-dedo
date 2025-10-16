'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AdminSidebar, { sidebarItems } from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const currentItem = sidebarItems.find(item => item.href === pathname);
  const pageTitle = currentItem?.label || 'Admin Dashboard';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-full bg-black text-foreground flex ">
        <AdminSidebar className="bg-black" />

        <SidebarInset className='rounded-4xl border bg-neutral-900/50 overflow-hidden shadow-2xl'>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="" />
            <div className="h-4 w-px bg-border mx-2" />
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </header>
          <main className="flex-1 p-8 overflow-y-auto hide-scrollbar">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
