'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHomeFilled,
  IconTableFilled,
  IconCurrencyDollar,
  IconChartAreaFilled,
  IconShieldFilled,
} from '@tabler/icons-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: IconHomeFilled, href: '/admin' },
  { id: 'fees', label: 'Fee Management', icon: IconCurrencyDollar, href: '/admin/fees' },
  { id: 'analytics', label: 'Analytics', icon: IconChartAreaFilled, href: '/admin/analytics' },
  { id: 'users', label: 'User Management', icon: IconTableFilled, href: '/admin/users' },
  { id: 'security', label: 'Security Logs', icon: IconShieldFilled, href: '/admin/security' },
];

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className={className}>
      <SidebarHeader className='bg-black'>
        <div className="flex items-center gap-3 px-2">
          <Image
            src="/onlyfoundersdotfun cat-Photoroom.png"
            alt="OnlyFounders Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-bold text-foreground">OnlyFounders</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='bg-black'>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className='bg-black'>
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden px-2">
          Admin Dashboard v1.0
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
}
