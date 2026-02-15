import { db } from './lib/db';
import { projects } from './lib/schema';

async function testConnection() {
  console.log('Testing connection using lib/db.ts configuration...');
  try {
    const allProjects = await db.select().from(projects);
    console.log('✅ Success! Found', allProjects.length, 'projects');
  } catch (err: any) {
    console.error('❌ Connection failed:');
    console.error('Message:', err.message);
    if (err.errors) {
      err.errors.forEach((e: any, i: number) => console.error(`  Error ${i}:`, e.message));
    }
    console.error('Stack:', err.stack);
  } finally {
    process.exit();
  }
}

testConnection();
