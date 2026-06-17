import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      const [key, value] = line.split('=', 2);
      return [key, value?.replace(/^"|"$/g, '')];
    }),
);

console.log('SUPABASE_URL=', env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY=', env.SUPABASE_SERVICE_ROLE_KEY);
console.log('KEY_PREFIX=', env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
console.log('KEY_LENGTH=', env.SUPABASE_SERVICE_ROLE_KEY?.length);

const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function run() {
  try {
    const result = await client.storage.getBucket('nexus-assets');
    console.log('RESULT=', result);
  } catch (err) {
    console.error('ERROR=', err);
  }
}

run();
