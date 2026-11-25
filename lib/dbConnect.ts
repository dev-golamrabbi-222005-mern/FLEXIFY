import { MongoClient, ServerApiVersion, Collection, Document } from "mongodb";

declare global {
  var _mongoClient: MongoClient | undefined;
}

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/flexify";
const dbName = process.env.DB_NAME || "flexify";

function getClient(): MongoClient {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
    }
    return global._mongoClient;
  }

  // In production, instantiate client or reuse instance
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return global._mongoClient;
}

export const dbConnect = <T extends Document = Document>(
  cname: string
): Collection<T> => {
  const client = getClient();
  return client.db(dbName).collection<T>(cname);
};
