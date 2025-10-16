import Link from 'next/link';
import Image from 'next/image';
import { Coin } from '@/types/types';
import { IconArrowUpRight, IconFlameFilled } from '@tabler/icons-react';

export const TokenCard = ({ project }: { project: Coin }) => {
  const isGraduated =
    project.complete || project.bonding_curve_stats.is_graduated;

  return (
    <Link href={`/markets/${project.mint}`}>
      <div
        className={`rounded-[28px] shadow-xl hover:scale-101 transition-all duration-300 cursor-pointer group border p-3 ${
          isGraduated
            ? 'bg-gradient-to-br from-yellow-500/5 via-[#ffd23c79]/30 to-amber-500/5 border-yellow-500/20'
            : 'bg-gradient-to-r from-[#010f11]/20 via-[#01181d] to-[#010f11]/20 border-[#042830]'
        }`}
      >
        <div
          className={`flex items-center gap-4 mb-2 w-full ${project.description ? 'border-b pb-2' : ''} ${isGraduated ? 'border-yellow-500/20' : 'border-cyan-500/20'}`}
        >
          <div className="relative overflow-hidden h-22 w-30 flex items-center justify-center">
            <Image
              className={`h-full w-full rounded-2xl object-cover border ${isGraduated ? 'border-yellow-500/30' : 'border-cyan-500/50'}`}
              src={project.image_uri || '/coin.png'}
              alt={project.name}
              fill
            />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className='text-white'>{project.name}</h3>
              <p className="text-xs text-neutral-300">
                {(() => {
                  const now = Date.now();
                  const created = new Date(project.created_at).getTime();
                  const diffMs = now - created;

                  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const minutes = Math.floor(diffMs / (1000 * 60));

                  if (days > 0) return `${days}d ago`;
                  if (hours > 0) return `${hours}h ago`;
                  return `${minutes}m ago`;
                })()}
              </p>
            </div>
            <div>
              <span
                className={`text-sm text-${isGraduated ? 'yellow' : 'cyan'}-400`}
              >
                {project.symbol}
              </span>
              {isGraduated && (
                <IconFlameFilled className="size-4 text-yellow-500 inline-block ml-1" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isGraduated
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                        : 'bg-gradient-to-r from-cyan-400 to-cyan-500'
                    }`}
                    style={{
                      width: isGraduated
                        ? '100%'
                        : `${Number(project.bonding_curve_stats.progress_percentage) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 w-full">
              {/* <span className="w-full text-sm">
                Volume{' '}
                <span
                  className={`font-medium ${isGraduated ? 'text-yellow-400' : 'text-cyan-400'}`}
                >
                  {project.virtual_sol_reserves}
                </span>
              </span> */}
              <span className="w-full text-white text-sm">
                MC{' '}
                <span
                  className={`font-medium ${
                    isGraduated ? 'text-yellow-400' : 'text-cyan-400'
                  }`}
                >
                  ${`5`}K
                </span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm line-clamp-2 text-neutral-300">
          {project.description}
        </p>
        <div className="flex items-center justify-between gap-1 mt-4 text-xs text-neutral-300">
          <span>
            {' '}
            by {project.creator.slice(0, 6)}...
            {project.creator.slice(-4)}
          </span>
          <span
            className={`border p-1 rounded-full transition-all duration-200 group-hover:rotate-360 ${
              isGraduated
                ? 'border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400 group-hover:text-yellow-500'
                : 'border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 group-hover:text-cyan-500'
            }`}
          >
            <IconArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
