import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load environment variables from .env.local if it exists
try {
  config({
    path: '.env.local',
  });
} catch (error) {
  console.log('No .env.local file found, using environment variables');
}

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    console.error('POSTGRES_URL is not defined');
    
    // In production, this is a critical error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('POSTGRES_URL is not defined');
    } else {
      // In development, we can exit more gracefully
      console.warn('Skipping database migrations due to missing POSTGRES_URL');
      process.exit(0);
    }
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
