const { createClient } = require('@libsql/client');
const libsql = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
(async () => {
  try {
    const res = await libsql.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log(res.rows);
  } catch (e) { console.error(e) }
})();
