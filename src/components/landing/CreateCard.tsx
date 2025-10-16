'use client';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { IconArrowUpRight } from '@tabler/icons-react';

export const CreateCard = () => {
  return (
    <Link href="/markets/create">
      <div className="rounded-[28px] shadow-xl hover:scale-101 transition-all duration-300 cursor-pointer group border p-3 bg-gradient-to-r from-[#010f11]/10 via-[#01181d] to-[#010f11]/10 border-[#042830]">
        <div className="flex items-center gap-4 mb-2 w-full border-b pb-2 border-blue-500/20">
          <div className="relative overflow-hidden h-22 w-30 flex items-center justify-center">
            <div className="h-full w-full rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#65e7fc]/20 to-[#65e7fc]/5 border border-blue-500/50">
              <Plus className="w-12 h-12 text-[#65e7fc]" />
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <h3>Create Project</h3>
              <p className="text-xs text-neutral-300">New</p>
            </div>
            <div>
              <span className="text-sm text-cyan-400">LAUNCH</span>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-400 to-cyan-500"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 w-full">
              <span className="w-full text-sm">
                Ready <span className="font-medium text-cyan-400">Now</span>
              </span>
              <span className="w-full text-sm">
                Start <span className="font-medium text-cyan-400">Free</span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm line-clamp-2 text-neutral-300">
          Submit your project and launch with the OnlyFounders community. Get
          your token live in minutes.
        </p>
        <div className="flex items-center justify-between gap-1 mt-4 text-sm text-neutral-300">
          <span>by OnlyFounders</span>
          <span className="border p-1 rounded-full transition-all duration-200 group-hover:rotate-360 border-blue-500/30 hover:bg-blue-500/10 text-blue-400 group-hover:text-blue-500">
            <IconArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
