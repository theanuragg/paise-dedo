import { MainHeader } from '@/components/MainHeader';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="min-h-screen w-full relative">
        <div
          className="fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(125% 125% at 50% 10%, #0C1014 40%, #0d1a36 100%)',
          }}
        />
      <MainHeader />
      <div className="pt-16 md:max-w-[85vw] mx-auto relative">{children}</div>
      </div>
    </div>
  );
}
