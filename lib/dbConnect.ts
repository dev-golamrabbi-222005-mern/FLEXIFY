import { MongoClient, ServerApiVersion, Collection, Document } from "mongodb";

const uri: string | undefined = process.env.MONGODB_URI;
const dbName: string | undefined = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (!dbName) {
  throw new Error("DB_NAME is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = <T extends Document = Document>(
  cname: string
): Collection<T> => {
  return client.db(dbName).collection<T>(cname);
};