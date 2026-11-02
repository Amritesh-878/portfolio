import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const source = join(
  dirname(require.resolve('pdfjs-dist/package.json')),
  'build',
  'pdf.worker.min.mjs',
);
const target = join(process.cwd(), 'public', 'pdf.worker.min.mjs');

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

console.log(`Copied the PDF worker to ${target}`);
