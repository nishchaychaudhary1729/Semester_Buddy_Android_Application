import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'semester_buddy';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(DB_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

// Test connection function
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { client, db } = await connectToDatabase();
    
    // Test the connection by running a simple command
    await db.admin().ping();
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${DB_NAME}`);
    console.log(`🔗 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
    
    return { 
      success: true, 
      message: `Connected to MongoDB database: ${DB_NAME}` 
    };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return { 
      success: false, 
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
} 