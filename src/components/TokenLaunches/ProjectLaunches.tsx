'use client';

import { FilterTabs } from './FilterTabs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
import { useCoinsStore } from '@/stores/coinsStore';
import { TokenCard } from '../token/TokenCard';
import { ProjectsTable } from '../token/TokenList';

const POLLING_INTERVAL = 30000;
const POLLING_INTERVAL_ACTIVE = 10000;

const TokensLoading = () => (
  <section id="projects" className="min-h-screen w-full pb-16">
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="rounded-[24px] bg-black/20 border border-white/10 p-4 animate-pulse"
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
      </div>
    </div>
  </section>
);

const TokenLaunchesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { coins: projects, loading, error, fetchCoins } = useCoinsStore();

  useEffect(() => {
    fetchCoins(true);
  }, [fetchCoins]);

  useEffect(() => {
    const interval =
      activeTab === 'active' ? POLLING_INTERVAL_ACTIVE : POLLING_INTERVAL;

    pollingIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('Polling: fetching coins...');
        fetchCoins(true);
      }
    }, interval);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab visible: fetching coins...');
        fetchCoins(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = setInterval(() => {
            if (document.visibilityState === 'visible') {
              console.log('Polling: fetching coins...');
              fetchCoins(true);
            }
          }, interval);
        }
      } else {
        console.log('Tab hidden: stopping polling');
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab, fetchCoins]);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'active', label: 'Active' },
    { key: 'graduated', label: 'Graduated' },
  ];

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'list' || viewParam === 'grid') {
      setView(viewParam);
    }
  }, [searchParams]);

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`${pathname}?${params.toString()}`);
  };

  const searchFilteredProjects = projects.filter(
    project =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProjects = searchFilteredProjects.filter(project => {
    switch (activeTab) {
      case 'new':
        const within24Hours = 24 * 60 * 60 * 1000;
        return (
          new Date(project.created_at).getTime() > Date.now() - within24Hours
        );
      case 'active':
        return !project.complete && !project.bonding_curve_stats.is_graduated;
      case 'graduated':
        return project.complete || project.bonding_curve_stats.is_graduated;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <section id="projects" className="min-h-screen w-full pb-16">
      <div className="w-full space-y-6">
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          searchPlaceholder="search all"
          view={view}
          onViewChange={handleViewChange}
        />

        {loading ? (
          <TokensLoading />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">
              Failed to load projects
            </h3>
            <p className="text-neutral-400 mb-4">{error}</p>
            <button
              onClick={() => fetchCoins(true)}
              className="px-4 py-2 bg-[#00ffff] text-black rounded-lg hover:bg-[#00ffff]/80 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-neutral-400 mb-4">
              {search
                ? 'Try adjusting your search criteria'
                : 'No projects match the current filter'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-2 bg-[#00ffff] text-black rounded-lg hover:bg-[#00ffff]/80 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredProjects.map((project, idx: number) => (
              <div
                key={`${project.id}-${idx}`}
                className="break-inside-avoid mb-4"
              >
                <TokenCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <ProjectsTable projects={filteredProjects} />
        )}
      </div>
    </section>
  );
};

const ProjectLaunches = () => {
  return (
    <Suspense fallback={<TokensLoading />}>
      <TokenLaunchesContent />
    </Suspense>
  );
};

export default ProjectLaunches;
