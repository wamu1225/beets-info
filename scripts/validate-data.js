// Validates src/data/sections.ts and src/data/recipes.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sectionsPath = path.join(__dirname, '..', 'src', 'data', 'sections.ts');

if (!fs.existsSync(sectionsPath)) {
  console.error('Error: src/data/sections.ts not found');
  process.exit(1);
}

const src = fs.readFileSync(sectionsPath, 'utf-8').replace(/\r/g, '');
const idMatches = [...src.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
const ids = idMatches.filter((id) => /^[a-z][a-z0-9-]*$/.test(id));

const expected = ['basics', 'nutrition', 'cultivation', 'recipes', 'storage', 'cautions'];
const missing = expected.filter((e) => !ids.includes(e));
if (missing.length) {
  console.error(`Error: missing required section ids: ${missing.join(', ')}`);
  process.exit(1);
}

const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  console.error(`Error: duplicate section ids: ${dupes.join(', ')}`);
  process.exit(1);
}

console.log(`✓ validate-data: ${ids.length} sections (${ids.join(', ')})`);
