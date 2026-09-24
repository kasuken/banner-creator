// Bundles the function app (plus ../shared) into dist/ and copies the server-side fonts.
// npm packages stay external and are resolved from api/node_modules at runtime.
import { build } from 'esbuild';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Open-licensed (OFL) stand-ins registered under the family names used by the web app (shared/presets.ts FONTS).
// Banner text is always drawn bold, so the 700 weight is used where available.
const FONTS = [
    { pkg: '@fontsource/arimo', file: 'arimo-latin-700-normal.woff2', families: ['Arial', 'Helvetica', 'sans-serif'] },
    { pkg: '@fontsource/tinos', file: 'tinos-latin-700-normal.woff2', families: ['Times New Roman', 'Times', 'serif'] },
    { pkg: '@fontsource/cousine', file: 'cousine-latin-700-normal.woff2', families: ['Courier New', 'Courier', 'monospace'] },
    { pkg: '@fontsource/gelasio', file: 'gelasio-latin-700-normal.woff2', families: ['Georgia'] },
    { pkg: '@fontsource/dejavu-sans', file: 'dejavu-sans-latin-700-normal.woff2', families: ['Verdana'] },
    { pkg: '@fontsource/anton', file: 'anton-latin-400-normal.woff2', families: ['Impact'] },
    { pkg: '@fontsource/comic-neue', file: 'comic-neue-latin-700-normal.woff2', families: ['Comic Sans MS', 'cursive'] },
];

rmSync('dist', { recursive: true, force: true });

await build({
    entryPoints: ['src/functions/mcp.ts'],
    outdir: 'dist/functions',
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    packages: 'external',
    sourcemap: true,
    logLevel: 'info',
});

mkdirSync('dist/fonts/licenses', { recursive: true });
for (const { pkg, file } of FONTS) {
    const pkgDir = path.dirname(require.resolve(`${pkg}/package.json`));
    cpSync(path.join(pkgDir, 'files', file), path.join('dist/fonts', file));
    cpSync(path.join(pkgDir, 'LICENSE'), path.join('dist/fonts/licenses', `${pkg.split('/')[1]}-LICENSE.txt`));
}
writeFileSync(
    'dist/fonts/manifest.json',
    JSON.stringify(FONTS.map(({ file, families }) => ({ file, families })), null, 2)
);
console.log(`Copied ${FONTS.length} font files to dist/fonts`);
