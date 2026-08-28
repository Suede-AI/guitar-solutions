import { describe, expect, it, vi } from 'vitest';

vi.mock('geist/font/sans', () => ({ GeistSans: { variable: '--geist-sans' } }));
vi.mock('geist/font/mono', () => ({ GeistMono: { variable: '--geist-mono' } }));
vi.mock('next/headers', () => ({ headers: vi.fn() }));

const LEGACY_GOOGLE_VERIFICATION =
  'AOoIfw-VogekFSkj1jmBG2vGHqlzpyG2Xk2w69s6a7U';
const CURRENT_GOOGLE_VERIFICATION =
  '8XJbkzFRKfZpwNHvnMbnJA202BGF5JzBuTHBDeDSasQ';

describe('Google site ownership verification', () => {
  it('keeps both the legacy and current verification values in page metadata', async () => {
    const { metadata } = await import('../../app/layout');

    expect(metadata.verification?.google).toEqual([
      LEGACY_GOOGLE_VERIFICATION,
      CURRENT_GOOGLE_VERIFICATION,
    ]);
  });
});
