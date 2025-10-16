'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
} from 'lucide-react';
import Link from 'next/link';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
}

export const FilterTabs = ({
  tabs,
  activeTab,
  onTabChange,
  onSearch,
  searchPlaceholder = 'search all',
  view = 'grid',
  onViewChange,
}: FilterTabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const container = containerRef.current;

    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      setIndicatorStyle({ left, width });
    }
  }, [activeTab, tabs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="flex items-center lg:flex-row flex-col lg:justify-between w-full md:p-4 bg-black/10 rounded-3xl lg:gap-0 gap-2">
      <div
        ref={containerRef}
        className="relative flex border border-[#65e7fc]/20 rounded-full md:p-1 p-0.5 backdrop-blur-sm"
      >
        <motion.div
          className="absolute top-1 bottom-1 bg-gradient-to-b from-[#26e1fd] via-[#26e1fd] to-[#8df0ff]  rounded-full"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        />

        {tabs.map(tab => (
          <button
            key={tab.key}
            ref={el => {
              tabRefs.current[tab.key] = el;
            }}
            onClick={() => onTabChange(tab.key)}
            className={`relative cursor-pointer z-10 md:px-6 px-3 py-2.5 text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-black font-semibold'
                : 'text-white/70 hover:text-[#65e7fc]'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="bg-white/5 border border-white/20 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-[#65e7fc] focus:ring-1 focus:ring-[#65e7fc] md:w-80 w-full text-sm"
          />
        </div>
        <Link
          className="w-full bg-gradient-to-b from-[#26e1fd] via-[#26e1fd] to-[#8df0ff] text-black shadow-lg rounded-full text-sm py-2 text-center md:hidden flex items-center justify-center font-medium"
          href={'/markets/create'}
        >
          Launch Token
        </Link>

        {/* {onViewChange && (
          <div className="md:flex hidden gap-1 bg-neutral-800/30 border border-neutral-700 rounded-xl p-1">
            <button
              onClick={() => onViewChange('grid')}
              className={`flex items-center text-sm gap-2 px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                view === 'grid'
                  ? 'bg-gradient-to-b from-[#26e1fd] via-[#26e1fd] to-[#8df0ff] text-black shadow-lg'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Grid3X3 className="size-4" />
              Grid
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center text-sm gap-2 px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                view === 'list'
                  ? 'bg-gradient-to-b from-[#26e1fd] via-[#26e1fd] to-[#8df0ff] text-black shadow-lg'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <List className="size-4" />
              List
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};
