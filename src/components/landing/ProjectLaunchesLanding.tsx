'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreateCard } from './CreateCard';
import { TokenCard } from '../token/TokenCard';
import { AudienceCards } from './AudienceCards';
import { getRecentCoins } from '@/utils/httpClient';
import { Coin } from '@/utils/types';

type BondingCurveStats = {
  progress_percentage: number;
  sol_in_curve: number;
  graduation_target: number;
  is_graduated: boolean;
};

type CoinProject = Coin & {
  price_per_token: number | null;
  bonding_curve_progress: string;
  bonding_curve_stats: BondingCurveStats;
};

export const ProjectLaunchesLanding = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecentProjects() {
      try {
        setLoading(true);
        setError(null);

        const data = await getRecentCoins(2);
        // Use data directly as it already matches the Coin interface
        const projectsWithStats = data;

        setProjects(projectsWithStats);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load recent projects'
        );
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecentProjects();
  }, []);

  const filteredProjects = projects.slice(0, 2);

  return (
    <div className="min-h-screen w-full relative">
      <section
        id="projects"
        className="min-h-screen w-full p-10 border mask-b-from-99% border-neutral-800/30 relative rounded-4xl flex items-center justify-center transition-all duration-300"
      >
        <div className="w-full max-w-7xl mx-auto relative">
          <div className="mb-20">
            <h3 className="text-xl md:text-3xl font-medium">
              Choose Your Path
            </h3>
            <p className="text-neutral-300 mb-10 text-sm">
              Whether you're building, investing, or creating — we have the
              right tools for you.
            </p>
            <AudienceCards />
          </div>

          <h2 className="text-xl md:text-3xl font-medium pt-20">
            Explore Markets
          </h2>
          <p className="text-neutral-300">
            Explore what&#39;s live now, what&#39;s coming soon, and what&#39;s
            already shipped.
          </p>

          <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {loading ? (
              <>
                {[...Array(2)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[24px] bg-black/20 border border-white/10 p-2 animate-pulse"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="size-32 sm:size-38 rounded-2xl bg-neutral-700"></div>
                      <div className="flex flex-col flex-1 space-y-2">
                        <div className="h-4 bg-neutral-700 rounded"></div>
                        <div className="h-3 bg-neutral-700 rounded w-3/4"></div>
                        <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              filteredProjects.map((project, idx) => (
                <div key={`${project.id}-${idx}`}>
                  <TokenCard project={project} />
                </div>
              ))
            )}
            <div>
              <CreateCard />
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/markets">
              <button className="rounded-xl font-[500] py-2 px-6 mb-2 text-black bg-[#65e7fc] hover:bg-[#65e7fc]/80 transition-all duration-300 cursor-pointer font-funnel-display">
                Explore More Tokens
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
