import { MongoClient, ServerApiVersion, Collection } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
const dbName: string = process.env.DB_NAME as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = async (collectionName: string): Promise<Collection | undefined> => {
  try {
    const db = client.db(dbName);
    console.log("MongoDB connected!");
    return db.collection(collectionName);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};