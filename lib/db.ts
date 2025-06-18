export {};

import { MongoClient, FindOneAndUpdateOptions, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://praneshbharadwaj631:Pranesh123@cluster0.gwupm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("Samparka_RSS");
}

type CounterDoc = {
  _id: ObjectId;
  name: string;
  seq: number;
};

export async function getNextSeq(name: string): Promise<number> {
  const db = await getDb();

  const result = await db.collection("counters").findOneAndUpdate(
    { name: name }, // filter
    { $inc: { seq: 1 } }, // update
    {
      returnDocument: "after", // correct placement
      upsert: false, // don't insert if not found
    }
  );
  console.log("result", { result });

  if (!result) {
    throw new Error("Failed to get or create sequence document");
  }

  return result.seq;
}
