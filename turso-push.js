const { createClient } = require('@libsql/client');
const fs = require('fs');
const libsql = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const script = fs.readFileSync('schema.sql', 'utf-8');
const statements = script.split(';').map(s => s.trim()).filter(Boolean);
(async () => {
  for (const s of statements) {
    // remove comments before executing
    const cleanSql = s.split('\n').filter(line => !line.startsWith('--')).join('\n').trim();
    if (!cleanSql) continue;
    try {
      console.log('Executing:', cleanSql.slice(0, 50));
      await libsql.execute(cleanSql);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('Done!');
})();
