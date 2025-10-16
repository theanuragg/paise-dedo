import { Button } from '@/components/ui/button';
import Link from 'next/link';

const companies = [
  {
    src: '/brands/Solana.svg',
    alt: 'Solana',
  },
  {
    src: '/brands/educhain.svg',
    alt: 'EduChain',
  },
  {
    src: '/brands/OpenCampus.svg',
    alt: 'Open Campus',
  },
  {
    src: '/brands/Microsoft.svg',
    alt: 'Microsoft',
  },
  {
    src: '/brands/certik.svg',
    alt: 'CertiK',
  },
  {
    src: '/brands/BDE.svg',
    alt: 'BDE',
  },
];

const achievements = [
  { label: 'Total Value Locked', value: '$50M+' },
  { label: 'Successful Launches', value: '150+' },
  { label: 'Active Founders', value: '2,500+' },
  { label: 'Token Success Rate', value: '94%' },
];

export const About3 = () => {
  const title = 'About OnlyFounders';
  const description =
    'OnlyFounders is the world’s first founder capital markets launchpad, where reputation becomes liquid capital. We redefine how founders raise, tokenize, and allocate capital onchain.';
  const mainImage = {
    src: '/background.png',
    alt: 'OnlyFounders Platform Overview',
  };
  const secondaryImage = {
    src: '/OnlyFounder.png',
    alt: 'Founder Token Creation',
  };
  const breakout = {
    src: '/onlyfoundersdotfun cat-Photoroom.png',
    alt: 'OnlyFounders logo',
    title: 'Launch Your Founder Token',
    description:
      'Convert your reputation into tradable founder tokens. Let supporters invest in your growth while you retain full ownership and control.',
    buttonText: 'Tokenize Now',
    buttonUrl: '/markets',
  };
  const companiesTitle = 'Trusted by leading blockchain ecosystems';
  const achievementsTitle = 'Our Impact in Numbers';
  const achievementsDescription =
    'Empowering founders to build the future of decentralized innovation through reputation-backed token launches.';

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="md:text-4xl text-2xl font-medium text-white">
            {title}
          </h1>
          <p className="text-cyan-300 md:text-base text-sm md:px-0 px-4">
            {description}
          </p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3 md:px-0 px-4">
          <div className='relative lg:col-span-2'>
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2 z-10 relative"
            />
            <div className="absolute  inset-0 bg-gradient-to-t from-cyan-400 via-cyan-300 to-cyan-400 blur-3xl opacity-10">
            </div>
          </div>
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-cyan-900 p-7 md:w-1/2 lg:w-auto border border-cyan-800">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold text-white">
                  {breakout.title}
                </p>
                <p className="text-cyan-300">{breakout.description}</p>
              </div>
              <Button
                variant="outline"
                className="mr-auto bg-[#65e7fc] text-black border-[#65e7fc] hover:bg-[#65e7fc]/90"
                asChild
              >
                <Link href={breakout.buttonUrl}>{breakout.buttonText}</Link>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        {/* <div className="py-32">
          <p className="text-center text-cyan-300">{companiesTitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div className="flex items-center gap-3" key={company.src + idx}>
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8 filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-cyan-900 md:mx-0 mx-4 p-10 md:p-16 border border-cyan-800">
          <div className="flex flex-col gap-4 text-center md:text-left ">
            <h2 className="md:text-4xl text-2xl font-semibold text-white">
              {achievementsTitle}
            </h2>
            <p className="max-w-screen-sm text-cyan-300 md:text-base text-sm mx-auto md:mx-0">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
            {achievements.map((item, idx) => (
              <div
                className="flex md:flex-col items-center gap-4"
                key={item.label + idx}
              >
                <p className="text-cyan-400">{item.label}</p>
                <span className="text-3xl font-semibold md:text-5xl text-[#65e7fc]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,rgba(101,231,252,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(101,231,252,0.1)_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div> */}
      </div>
    </section>
  );
};
