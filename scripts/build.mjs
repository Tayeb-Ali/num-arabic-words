// Build: tsc (CJS + ESM) + esbuild UMD bundle. Run: npm run build
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readdirSync, copyFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', shell: true });

run('npx tsc -p tsconfig.cjs.json');
run('npx tsc -p tsconfig.esm.json');

// Package-type markers so Node resolves dual CJS+ESM correctly.
writeFileSync('dist/esm/package.json', '{"type":"module"}');
writeFileSync('dist/cjs/package.json', '{"type":"commonjs"}');

// Copy all .d.ts emitted by the CJS build into the ESM tree.
function copyDts(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const e of readdirSync(src)) {
    const s = join(src, e);
    const d = join(dest, e);
    if (statSync(s).isDirectory()) copyDts(s, d);
    else if (e.endsWith('.d.ts') && !existsSync(d)) copyFileSync(s, d);
  }
}
copyDts('dist/cjs', 'dist/esm');

// CJS callable interop: require('num-arabic-words') === function (v1 compat),
// while keeping named props (require('...').tafqeet).
{
  const p = 'dist/cjs/index.js';
  const { readFileSync, appendFileSync } = await import('node:fs');
  const src = readFileSync(p, 'utf8');
  if (!src.includes('__CALLABLE_INTEROP__')) {
    appendFileSync(
      p,
      '\n// __CALLABLE_INTEROP__ (v1 compat)\n' +
        'module.exports = exports.tafqeet;\n' +
        'Object.assign(module.exports, exports);\n'
    );
  }
}

// UMD browser bundle via esbuild (proper multi-file bundling).
mkdirSync('dist/umd', { recursive: true });
run('npx esbuild src/index.ts --bundle --format=iife --global-name=NumArabicWords --outfile=dist/umd/num-arabic-words.js');
run('npx esbuild src/index.ts --bundle --format=iife --global-name=NumArabicWords --minify --outfile=dist/umd/num-arabic-words.min.js');

console.log('Build OK: dist/cjs + dist/esm + dist/umd');
