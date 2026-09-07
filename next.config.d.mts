// Type surface for next.config.mjs so tests can assert on the redirect table.
// tsconfig sets allowJs: false on purpose, so the config module carries its own
// declaration instead of the whole project opting into JavaScript compilation.
import type { NextConfig } from 'next';

declare const nextConfig: NextConfig;
export default nextConfig;
