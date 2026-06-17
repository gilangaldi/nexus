import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('node_modules');
function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      walk(full);
    } else if (name.isFile() && /\.(js|mjs|cjs|ts|json)$/.test(name.name)) {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('Invalid Compact JWS') || text.includes('sb_secret')) {
        console.log(full);
        if (text.includes('Invalid Compact JWS')) {
          console.log('--- line snippet ---');
          const lines = text.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('Invalid Compact JWS')) {
              console.log(i+1, lines[i]);
            }
          }
        }
      }
    }
  }
}
walk(root);
