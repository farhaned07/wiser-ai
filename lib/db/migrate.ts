import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Try to load environment variables from .env.local or .env
try {
  config({
    path: '.env.local',
  });
} catch (error) {
  try {
    config({
      path: '.env',
    });
  } catch (error) {
    console.log('No .env or .env.local file found, using environment variables');
  }
}

const runMigrate = async () => {
  // Check for Vercel Postgres environment variables
  const postgresUrl = process.env.POSTGRES_URL || 
                      process.env.DATABASE_URL || 
                      process.env.POSTGRES_PRISMA_URL;
  
  if (!postgresUrl) {
    console.error('No database URL found. Checking for POSTGRES_URL, DATABASE_URL, or POSTGRES_PRISMA_URL');
    
    // In production, this is a critical error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('POSTGRES_URL is not defined');
    } else {
      // In development, we can exit more gracefully
      console.warn('Skipping database migrations due to missing database URL');
      process.exit(0);
    }
  }

  console.log('Using database URL:', postgresUrl.replace(/:[^:]*@/, ':****@')); // Log URL with password hidden

  const connection = postgres(postgresUrl, { max: 1 });
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
