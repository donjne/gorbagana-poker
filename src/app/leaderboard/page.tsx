'use client';

import { LeaderboardContent } from '@/components/leaderboard/LeaderboardContent';
import { TransitionLayout } from '@/components/ui/TransitionLayout';
import { StaggeredItem } from '@/components/ui/PageTransitions';
import type { JSX } from 'react';

export default function LeaderboardPage(): JSX.Element {
  return (
    <TransitionLayout>
      <StaggeredItem>
        <LeaderboardContent />
      </StaggeredItem>
    </TransitionLayout>
  );
}