'use client';

import { Coin } from '@/types/types';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Flame } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconFlameFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const ProjectsTable = ({ projects }: { projects: Coin[] }) => {
  const router = useRouter();
  return (
    <div className="bg-slate-900 font-mono overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="">
          <TableRow className="text-sm text-muted-foreground font-medium border-white/5">
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              #
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              Token
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              MCAP
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              Change (24H)
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              Volume
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-muted-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-white/5">
          {projects.map((project, index) => {
            const percent = (index % 2 === 0 ? -22.14 : 18.5); // Remove percentChange
            const isUp = percent > 0;
            const isGraduated = project.complete || project.bonding_curve_stats.is_graduated;
            const isEven = index % 2 === 0;

            return (
              <TableRow
                key={project.id}
                onClick={() => router.push(`/markets/${project.mint}`)}
                className={`hover:bg-white/10 transition-colors cursor-pointer ${
                  isEven ? 'bg-black/10' : 'bg-black/30'
                }`}
              >
                <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                  #{index + 1}
                </TableCell>

                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={project.image_uri || '/coin.png'}
                      alt={project.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <div className=" gap-2">
                        <span className="font-semibold text-sm text-white">
                          {project.name}
                        </span>
                        <div className='flex items-center gap-1'>
                          <span
                            className={`text-xs font-mono ${isGraduated ? 'text-yellow-500' : 'text-muted-foreground'}`}
                          >
                            {project.symbol}
                          </span>
                          {isGraduated && (
                            <IconFlameFilled className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <div
                    className={`font-medium ${isGraduated ? 'text-yellow-400' : 'text-[#26e1fd]'}`}
                  >
                    ${project.market_cap ? (project.market_cap / 1000).toFixed(1) : '0'}K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      isUp ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(percent).toFixed(2)}%
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-neutral-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isGraduated
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 w-full'
                            : 'bg-gradient-to-r from-[#00ffff] to-[#a0ffff]'
                        }`}
                        style={
                          isGraduated
                            ? {}
                            : {
                                width: `${project.bonding_curve_stats.progress_percentage}%`,
                              }
                        }
                      ></div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <div className="text-white font-medium">
                    {project.virtual_sol_reserves} SOL
                  </div>
                  <div className="text-xs text-muted-foreground">
                    24h volume
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    {isGraduated ? (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs font-medium">
                          -
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-cyan-400 text-xs font-medium">
                          Funding
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {isGraduated
                        ? `${project.bonding_curve_stats.progress_percentage.toFixed(0)}%+ Goal`
                        : `${project.bonding_curve_stats.progress_percentage.toFixed(0)}% Goal`}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const ListProjectCard = ({ project }: { project: Coin }) => {
  const percent = 0; // Remove percentChange as it doesn't exist in Coin interface
  const isUp = percent > 0;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-black/20 border border-white/10 p-3 mb-3">
      <div className="flex-shrink-0">
        <Image
          src={project.image_uri || '/coin.png'}
          alt="Project Image"
          width={80}
          height={80}
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="font-semibold text-lg mb-1">{project.name}</div>
        <div className="text-xs text-muted-foreground mb-1">
          {project.symbol}
        </div>
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-muted-foreground">MC</span>
          <span className="text-[#00ffff] font-semibold">${project.market_cap ? (project.market_cap / 1000).toFixed(1) : '0'}K</span>
          <span
            className={`ml-2 font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}
          >
            {isUp ? '↑' : '↓'} {Math.abs(percent)}%
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-muted-foreground">SOL Reserves</span>
          <span className="text-[#00ffff] font-semibold">
            {project.virtual_sol_reserves} SOL
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          by{' '}
          <Image
            className="size-5 rounded-full"
            src={project.image_uri || '/coin.png'}
            alt="Founder Avatar"
            width={20}
            height={20}
          />
          {project.creator.slice(0, 6)}...{project.creator.slice(-4)}
        </div>
      </div>
    </div>
  );
};
