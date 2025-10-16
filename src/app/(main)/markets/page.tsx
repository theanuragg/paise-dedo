'use client';

import Footer from '@/components/landing/footer';
import ProjectLaunches from '@/components/TokenLaunches/ProjectLaunches';

export default function ProjectsPage() {
  return (
    <>
      <main className="w-full p-4">
        <ProjectLaunches />
      </main>

      <Footer />
    </>
  );
}
