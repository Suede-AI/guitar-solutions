import type { MDXComponents } from 'mdx/types';

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (node !== null && typeof node === 'object' && 'props' in (node as object)) {
    const el = node as { props: { children?: React.ReactNode } };
    return getTextContent(el.props.children);
  }
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl md:text-5xl tracking-tight text-paper mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h2
          id={id}
          className="font-display text-2xl md:text-3xl tracking-tight text-paper mt-12 mb-4 border-t border-rule pt-8"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h3 id={id} className="font-display text-xl text-paper mt-8 mb-3">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-paper-mute leading-[1.7] mb-5 max-w-[68ch]">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-cyan underline decoration-cyan/40 underline-offset-[3px] hover:decoration-cyan transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-none pl-0 mb-6 space-y-2 text-paper-mute max-w-[68ch]">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-red">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-red pl-5 my-6 text-paper italic font-display max-w-[60ch]">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.9em] bg-ink-2 text-cyan px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="font-mono text-sm bg-ink-2 border border-rule p-4 rounded-sm overflow-x-auto mb-6 max-w-full">
        {children}
      </pre>
    ),
    hr: () => <hr className="border-rule my-12" />,
    ...components,
  };
}
