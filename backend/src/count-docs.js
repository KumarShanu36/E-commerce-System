import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  const db = mongoose.connection.db;
  const collections = await db?.listCollections().toArray();
  for (const coll of collections || []) {
    const count = await db?.collection(coll.name).countDocuments();
    console.log(`Collection: ${coll.name}, Documents: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
