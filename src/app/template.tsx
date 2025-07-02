
'use client';

import { PageTransition, RouteLoadingBar, AnimatedBackground } from '@/components/ui/PageTransitions';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps): JSX.Element {
  const pathname = usePathname();
  
  const getBackgroundVariant = (path: string) => {
    if (path.startsWith('/game/')) return 'game';
    if (path === '/profile') return 'profile';
    return 'dashboard';
  };

  return (
    <>
      <RouteLoadingBar />
      <AnimatedBackground variant={getBackgroundVariant(pathname)} />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}