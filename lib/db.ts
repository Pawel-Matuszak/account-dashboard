import { Db, MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions);

  const db = await client.db(process.env.MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
