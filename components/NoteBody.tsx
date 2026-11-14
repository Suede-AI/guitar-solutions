import { Fragment, type ReactNode } from 'react';

import type { NoteBlock } from '@/lib/notes-content';

// Renders a note's blocks. Inline links are written as [anchor](url) in
// lib/notes-content.ts; everything else is plain text.

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const index = m.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    out.push(
      <a key={index} href={m[2]} className="underline">
        {m[1]}
      </a>,
    );
    last = index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function NoteBody({ blocks }: { blocks: readonly NoteBlock[] }) {
  return (
    <div className="space-y-5 text-base leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="pt-6 text-2xl font-semibold">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 opacity-90">
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="opacity-90">
            <Fragment>{inline(block.text)}</Fragment>
          </p>
        );
      })}
    </div>
  );
}
