'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

export default function FAQSection() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What is OnlyFounders?',
      answer:
        "OnlyFounders is the first onchain fundraising engine where founder reputation is the collateral. It creates Internet Capital Markets and a Founder Capital Market layer that replaces gatekeepers with proof.",
    },
    {
      id: 'item-2',
      question: 'How does fundraising work?',
      answer:
        'Founders build verified reputation through identity, contributions, and attestations. That proof unlocks liquidity through tokenized fundraising on the launchpad.',
    },
    {
      id: 'item-3',
      question: 'Why is this different from traditional VCs or launchpads?',
      answer:
        "OnlyFounders is protocol-native infrastructure, not a fund. It creates liquid, permissionless Founder Capital Markets within a larger Internet Capital Market. Reputation is the lead input.",
    },

    {
      id: 'item-4',
      question: 'Who can participate?',
      answer:
        'Founders, retail investors, institutional backers, and ecosystem partners who want transparent access to conviction-driven projects.',
    },
    {
      id: 'item-5',
      question: 'What chains are supported?',
      answer:
        'Built on Solana for scale and speed. Future cross-chain expansions planned.',
    },
    {
      id: 'item-6',
      question: 'How is reputation quantified?',
      answer: 'Through verifiable identity, track record, performance data, and AI-native scoring models.'
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 mt-4 text-balance">
            Discover quick and comprehensive answers about our reputation-based
            token launchpad and how founder tokens work.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-gray-900 border-gray-800 w-full rounded-2xl border px-8 py-3 shadow-sm"
          >
            {faqItems.map(item => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed border-gray-700"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-white hover:text-[#65e7fc] transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-gray-300">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-gray-400 mt-6 px-8">
            Can't find what you're looking for? Contact our{' '}
            <Link
              href="https://x.com/ofdotfun"
              target='_blank'
              className="text-[#65e7fc] font-medium hover:underline"
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
