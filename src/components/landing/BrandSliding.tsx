'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import React, { CSSProperties, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import Image from 'next/image';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls;
    const size = direction === 'horizontal' ? width : height;
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey(prevKey => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export type BlurredInfiniteSliderProps = InfiniteSliderProps & {
  fadeWidth?: number;
  containerClassName?: string;
};

export function BlurredInfiniteSlider({
  children,
  fadeWidth = 80,
  containerClassName,
  ...sliderProps
}: BlurredInfiniteSliderProps) {
  const maskStyle: CSSProperties = {
    maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
  };

  return (
    <div
      className={cn('relative w-full', containerClassName)}
      style={maskStyle}
    >
      <InfiniteSlider {...sliderProps}>{children}</InfiniteSlider>
    </div>
  );
}

const brands = [
  { name: 'BDE', path: '/brands/BDE.svg' },
  { name: 'Microsoft', path: '/brands/Microsoft.svg' },
  { name: 'Puke', path: '/brands/Puke.svg' },
  { name: 'Salad', path: '/brands/Salad.svg' },
  { name: 'Soken', path: '/brands/Soken.svg' },
  { name: 'Solana', path: '/brands/Solana.svg' },
  { name: 'Circle', path: '/brands/Circle.avif' },
  {
    name: 'Meteora',
    path: '/brands/meteora.png',
  },
  {
    name: 'Jupiter',
    path: '/brands/jupiter.png',
  },
  {
    name: 'Triton',
    path: '/brands/triton.png'  ,
  }
];

export function BrandSliding() {
  return (
    <section className="relative overflow-hidden bg-[#0C1014]/10 pb-26">
      <div className="relative px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-neutral-400 dark:md:border-neutral-800 md:pr-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-400">
                Trusted by industry leaders
              </p>
            </div>
          </div>

          <div className="w-full py-6 md:w-auto md:flex-1">
            <BlurredInfiniteSlider
              speedOnHover={20}
              speed={40}
              gap={100}
              fadeWidth={80}
            >
              {brands.map(brand => (
                <div key={brand.name} className="flex">
                  <div className="relative w-[120px] h-[60px] sm:w-[160px] sm:h-[80px]">
                    <Image
                      src={brand.path}
                      alt={brand.name}
                      fill
                      className={`object-contain ${
                        brand.name === "Jupiter" ? "scale-170 mt-1" : ""
                      }`}
                      sizes="(max-width: 640px) 120px, 160px"
                    />
                  </div>
                </div>
              ))}
            </BlurredInfiniteSlider>
          </div>
        </div>
      </div>
    </section>
  );
}
