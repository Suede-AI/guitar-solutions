import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: 'Guitar Signal Chain Reference',
  description:
    'Technical guitar signal-chain guides by Jason Colapietro covering impedance, gain staging, power, effects loops, buffers, pedals, and amp routing.',
  alternates: {
    canonical: 'https://guitar.solutions',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <FeaturedStack guides={guides} />
    </div>
  );
}
