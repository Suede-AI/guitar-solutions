import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: 'guitar.solutions — The Signal Chain by Jason Colapietro',
  description:
    'Authoritative technical guides on guitar signal chains — impedance, gain staging, power supplies, and effects topology by Jason Colapietro.',
  alternates: {
    canonical: 'https://guitar.solutions',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <h1 className="sr-only">
        guitar.solutions - The Signal Chain by Jason Colapietro
      </h1>
      <FeaturedStack guides={guides} />
    </div>
  );
}
