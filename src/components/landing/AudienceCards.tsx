'use client';

import Link from 'next/link';
import { Rocket, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconCheck, IconRocket, IconTrendingUp } from '@tabler/icons-react';
import Image from 'next/image';

interface AudienceCardProps {
  title: string;
  subtitle: string;
  bullets: string[];
  icon: string;
  href: string;
  buttonText: string;
  buttonIcon: React.ComponentType<{ className?: string }>;
  gradient: string;
  delay?: number;
  reverse?: boolean;
}

const AudienceCard = ({
  title,
  subtitle,
  bullets,
  icon,
  href,
  buttonText,
  buttonIcon: ButtonIcon,
  delay = 0,
  reverse = false,
}: AudienceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="py-16"
    >
      <div
        className={`flex flex-col lg:flex-row gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}
      >
        <div className="lg:w-1/2 flex justify-center">
          <motion.div
            initial={{ y: 100, x: -100, opacity: 0 }}
            whileInView={{ y: 0, x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: delay + 0.2 }}
            className='relative'
          >
            <Image src={icon} alt="icon" className='relative z-10 md:scale-100 scale-75' height={350} width={350} />
            <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-cyan-900 to-purple-900 blur-3xl rounded-full'></div>
          </motion.div>
        </div>

        <div className="lg:w-1/2 space-y-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-medium text-white leading-tighter mb-4">
              {title}
            </h2>
            <p className="md:text-lg text-sm text-gray-300 leading-relaxed mb-6">
              {subtitle}
            </p>

            <div className="md:space-y-3 mb-8">
              {bullets.map((bullet, index) => (
                <div key={index} className="flex items-start md:gap-3 gap-2">
                  <IconCheck className="w-5 h-5 text-[#65e7fc] flex-shrink-0 mt-1" />
                  <span className="text-gray-300 md:text-base text-sm leading-relaxed">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link href={href}>
            <button className="bg-[#65e7fc] hover:bg-[#65e7fc]/90 text-black md:px-8 md:py-3 px-5
            py-2 rounded-lg font-semibold text-base transition-all duration-300 inline-flex items-center gap-3 hover:scale-105">
              {buttonText}
              <ButtonIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const AudienceCards = () => {
  const cards = [
    {
      title: 'Founders, investors and creators connect through proof and reputation.',
      subtitle:
        'Reputation becomes capital. Launch tokens. Raise funds. Build in public. Keep control.',
      bullets: [
        'Permissionless creation',
        'Reputation verified access',
        'Onchain fundraising with ownership intact',
      ],
      icon: '/rocket_transparent.png',
      href: '/markets/create',
      buttonText: 'Launch Your Token',
      buttonIcon: IconRocket,
      gradient: 'bg-gradient-to-br from-[#65e7fc]/20 to-[#65e7fc]/5',
      delay: 0,
      reverse: false,
    },
    {
      title: 'Invest in Founder Capital Markets',
      subtitle:
        "Gain direct access to tokenized founder raises where reputation is the collateral and proof drives allocation.",
      bullets: [
        'Reputation verified founders',
        'Tokenized capital opportunities',
        'Fully transparent onchain performance',
      ],
      icon: '/person_transparent.png',
      href: '/markets',
      buttonText: 'Explore',
      buttonIcon: IconTrendingUp,
      gradient: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5',
      delay: 0.3,
      reverse: true,
    },
  ];

  return (
    <div className="space-y-8">
      {cards.map((card, index) => (
        <AudienceCard key={index} {...card} />
      ))}
    </div>
  );
};
