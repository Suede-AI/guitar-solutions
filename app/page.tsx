import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: 'guitar.services — Signal Chain Reference',
  description:
    'Authoritative technical guides on guitar signal chains — impedance, gain staging, power supplies, and effects topology by Suede Labs.',
  alternates: {
    canonical: 'https://guitar.services',
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
