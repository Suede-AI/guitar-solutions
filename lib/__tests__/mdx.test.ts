import { describe, it, expect } from 'vitest';
import { readingTime, extractHeadings } from '../mdx';

describe('readingTime', () => {
  it('returns 1 for very short content', () => {
    expect(readingTime('hello world')).toBe(1);
  });

  it('estimates at 200 wpm rounded up', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    expect(readingTime(words)).toBe(2);
  });

  it('rounds up partial minutes', () => {
    const words = Array.from({ length: 201 }, (_, i) => `word${i}`).join(' ');
    expect(readingTime(words)).toBe(2);
  });

  it('returns 1 for empty string', () => {
    expect(readingTime('')).toBe(1);
  });
});

describe('extractHeadings', () => {
  it('extracts h2 headings with correct id, text, level', () => {
    const content = `## First Section\n\nSome content\n\n## Second Section\n\nMore`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({ id: 'first-section', text: 'First Section', level: 2 });
    expect(headings[1]).toEqual({ id: 'second-section', text: 'Second Section', level: 2 });
  });

  it('extracts h3 headings with level 3', () => {
    const content = `## Main\n\n### Sub-heading`;
    const headings = extractHeadings(content);
    expect(headings[1]).toMatchObject({ text: 'Sub-heading', level: 3 });
  });

  it('ignores h1 lines', () => {
    const content = `# Title\n\n## Section`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0].level).toBe(2);
  });

  it('slugifies heading text', () => {
    const content = `## True Bypass vs. Buffered`;
    const [h] = extractHeadings(content);
    expect(h.id).toBe('true-bypass-vs-buffered');
  });

  it('returns empty array when no headings', () => {
    expect(extractHeadings('just paragraph text')).toEqual([]);
  });
});

import { getAllGuides, getGuideBySlug } from '../mdx';

describe('getAllGuides', () => {
  it('returns guides with readingTime >= 1', () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThan(0);
    for (const g of guides) {
      expect(g.readingTime).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns guides sorted newest first', () => {
    const guides = getAllGuides();
    for (let i = 1; i < guides.length; i++) {
      expect(new Date(guides[i - 1].frontmatter.published).getTime()).toBeGreaterThanOrEqual(
        new Date(guides[i].frontmatter.published).getTime(),
      );
    }
  });
});

describe('getGuideBySlug', () => {
  it('returns headings for signal-chain-topology', () => {
    const guide = getGuideBySlug('signal-chain-topology');
    expect(guide).toBeDefined();
    expect(guide!.headings.length).toBeGreaterThan(0);
  });
});
