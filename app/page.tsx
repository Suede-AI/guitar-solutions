import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: { absolute: 'Guitar Signal Chain Reference | guides.guitar.solutions' },
  description:
    'Technical guides on guitar signal chains: impedance, gain staging, power supplies and effects topology, by Suede AI.',
  alternates: {
    canonical: 'https://guides.guitar.solutions',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <h1 className="sr-only">
        Guitar signal chain reference
      </h1>
      <FeaturedStack guides={guides} />
    </div>
  );
}
