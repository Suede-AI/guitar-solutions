import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: 'guides.guitar.solutions — Technical Reference for Guitar Signal Chains',
  description:
    'Authoritative technical guides on guitar signal chains — impedance, gain staging, power supplies, and effects topology by Suede Labs.',
  alternates: {
    canonical: 'https://guides.guitar.solutions',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <h1 className="sr-only">
        guides.guitar.solutions - Technical Reference for Guitar Signal Chains
      </h1>
      <FeaturedStack guides={guides} />
    </div>
  );
}
