import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type GuideFrontmatter = {
  title: string;
  slug: string;
  category: string;
  published: string; // ISO date
  updated?: string;  // ISO date, optional
  description: string;
  authors?: string[];
};

export type GuideRecord = {
  frontmatter: GuideFrontmatter;
  filePath: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides');

function readGuideFile(file: string): GuideRecord | null {
  if (!file.endsWith('.mdx')) return null;
  const filePath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const fm = parsed.data as Partial<GuideFrontmatter>;
  if (!fm.title || !fm.slug || !fm.category || !fm.published || !fm.description) {
    return null;
  }
  return {
    frontmatter: {
      title: fm.title,
      slug: fm.slug,
      category: fm.category,
      published: fm.published,
      updated: fm.updated,
      description: fm.description,
      authors: fm.authors ?? ['Suede Labs'],
    },
    filePath,
  };
}

export function getAllGuides(): GuideRecord[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR);
  const records = files
    .map(readGuideFile)
    .filter((r): r is GuideRecord => r !== null);
  // Sort newest first
  return records.sort(
    (a, b) =>
      new Date(b.frontmatter.published).getTime() -
      new Date(a.frontmatter.published).getTime(),
  );
}

export function getGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.frontmatter.slug);
}

export function getGuideBySlug(slug: string): GuideRecord | undefined {
  return getAllGuides().find((g) => g.frontmatter.slug === slug);
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const guide of getAllGuides()) {
    const cat = guide.frontmatter.category;
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
