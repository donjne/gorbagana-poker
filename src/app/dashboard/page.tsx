'use client';

import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { TransitionLayout } from '@/components/ui/TransitionLayout';
import { StaggeredItem } from '@/components/ui/PageTransitions';
import type { JSX } from 'react';

export default function DashboardPage(): JSX.Element {
  return (
    <TransitionLayout>
      <StaggeredItem>
        <DashboardContent />
      </StaggeredItem>
    </TransitionLayout>
  );
}