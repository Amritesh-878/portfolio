import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // The chat route reads this build-generated index at runtime via fs; without
  // this, Vercel's function tracer omits it (it is not a static import).
  outputFileTracingIncludes: {
    '/api/chat': ['./src/generated/rag-index.json'],
  },
};

const withMDX = createMDX();

export default withMDX(config);
