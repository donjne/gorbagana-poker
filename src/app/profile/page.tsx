'use client';

import { ProfileContent } from '@/components/profile/ProfileContent';
import { TransitionLayout } from '@/components/ui/TransitionLayout';
import { StaggeredItem } from '@/components/ui/PageTransitions';
import type { JSX } from 'react';

export default function ProfilePage(): JSX.Element {
  return (
    <TransitionLayout>
      <StaggeredItem>
        <ProfileContent />
      </StaggeredItem>
    </TransitionLayout>
  );
}