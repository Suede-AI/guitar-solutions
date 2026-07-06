import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

function stripFrontmatter() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;
    tree.children = tree.children.filter(
      (node) => node.type !== 'yaml' && node.type !== 'toml',
    );
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, stripFrontmatter],
  },
});

export default withMDX(nextConfig);
