'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { HowItWorksModal } from './how-it-works-modal';
import { motion } from 'framer-motion';
import { GradientButton } from './GradientButton';
import Image from 'next/image';
import { Spotlight } from '../ui/spotlight-new';
import { useRouter } from 'next/navigation';
const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  return (
    <section className="">
      <div className="min-h-screen w-full overflow-hidden relative pb-10 pt-[130px] sm:pb-0 sm:pt-0 sm:min-h-screen mask-b-from-80% flex flex-col justify-center items-center transition-all duration-300">
        <Spotlight />
        <div className="flex items-end justify-between max-w-7xl">
          <div className="relative z-20 w-full px-4 leading-none">
            <motion.h1
              className="text-3xl md:text-5xl w-full md:max-w-[44rem] relative md:leading-tighter leading-none mt-4 sm:mt-0 text-white md:text-left text-center grotesk"
              initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
              animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
              <span>
                The First Onchain{' '}
                <span className="bg-gradient-to-br from-[#4de7ff] to-[#a3e2ff] text-transparent bg-clip-text">
                  Launchpad
                </span>
              </span>
              <br />
              <span className="block sm:inline leading-none">
                Powered by Founder Reputation
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 md:mt-8 mx-aut md:max-w-2xl text-sm md:text-lg text-neutral-200 tracking-tight leading-relaxed md:text-left text-center"
              initial={{ y: 30, filter: 'blur(8px)', opacity: 0 }}
              animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              Where conviction, proof and reputation convert into liquid
              capital.
              <br className="md:block hidden" />
              Welcome to the Internet Capital Markets. The new foundation for
              founder led fundraising
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="mt-8 md:mt-10 flex justify-center md:justify-start flex-row md:gap-4"
            >
              <Link href="/markets/create">
                <GradientButton variant={'variant'}>
                  <span>Start Raising</span>
                </GradientButton>
              </Link>
              <motion.div>
                <Button
                  variant="link"
                  className="text-[#e5e7eb] px-4 sm:px-6 h-11 font-medium hover:text-[#65e7fc] hover:no-underline md:text-base text-sm"
                  onClick={() => router.push('/markets')}
                >
                  <span>Explore Markets</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            className="relative md:block hidden"
            initial={{ y: 30, filter: 'blur(10px)', opacity: 0 }}
            animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
          >
            <div className="absolute  inset-0 bg-gradient-to-t from-[#0A0F12] via-transparent to-[#0A0F12]"></div>
            <Image
              className="z-10 object-cover scale-125
            [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent),linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]
            [mask-composite:intersect] [mask-repeat:no-repeat] [mask-size:100%_100%] grayscale-50"
              src={'/onlyfoundersdotfun cat-Photoroom.png'}
              alt="Background"
              height={500}
              width={500}
              style={{ objectFit: 'cover' }}
              priority
            />
          </motion.div>
        </div>
      </div>

      <HowItWorksModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default HeroSection;
