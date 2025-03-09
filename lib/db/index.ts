import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Get database URL from various possible environment variables
const getDatabaseUrl = () => {
  const possibleEnvVars = [
    'POSTGRES_URL',
    'DATABASE_URL',
    'POSTGRES_PRISMA_URL'
  ];
  
  for (const envVar of possibleEnvVars) {
    if (process.env[envVar]) {
      console.log(`Using ${envVar} for database connection`);
      return process.env[envVar];
    }
  }
  
  return null;
};

// Initialize database connection only if a database URL is available
let db: ReturnType<typeof drizzle> | null = null;

const databaseUrl = getDatabaseUrl();

if (databaseUrl) {
  try {
    // For query purposes (not for migrations)
    const client = postgres(databaseUrl, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    db = drizzle(client, { schema });
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    
    // In production, this is a critical error
    if (isProduction) {
      throw new Error('Database connection failed');
    }
  }
} else {
  console.warn('No database URL provided, database features will be unavailable');
}

export { db, schema }; 