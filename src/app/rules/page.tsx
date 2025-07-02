'use client';

import { RulesContent } from '@/components/rules/RulesContent';
import { TransitionLayout } from '@/components/ui/TransitionLayout';
import { FadeScale } from '@/components/ui/PageTransitions';
import type { JSX } from 'react';

export default function RulesPage(): JSX.Element {
  return (
    <TransitionLayout>
      <FadeScale isVisible={true} delay={0.2}>
        <RulesContent />
      </FadeScale>
    </TransitionLayout>
  );
}