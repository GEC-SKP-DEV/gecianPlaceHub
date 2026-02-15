import postgres from 'postgres';

async function testWithPostgresLib(url: string) {
  console.log('--- Testing with "postgres" library ---');
  const sql = postgres(url, { ssl: 'require' });
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connected successfully with "postgres"');
    console.log('Current time:', result[0]);
  } catch (err: any) {
    console.error('❌ "postgres" library failed:', err.message);
  } finally {
    await sql.end();
  }
}

async function runTests() {
  const originalUrl = process.env.DATABASE_URL!;
  await testConnection(originalUrl, 'Original URL (pg)');
  await testWithPostgresLib(originalUrl);
}

runTests();
