import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Initialize database connection only if POSTGRES_URL is available
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.POSTGRES_URL) {
  try {
    // For query purposes (not for migrations)
    const client = postgres(process.env.POSTGRES_URL, {
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
  console.warn('POSTGRES_URL not provided, database features will be unavailable');
}

export { db, schema }; 