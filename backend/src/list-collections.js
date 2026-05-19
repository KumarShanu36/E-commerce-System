import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  const collections = await mongoose.connection.db?.listCollections().toArray();
  console.log(
    "Collections:",
    collections?.map((c) => c.name),
  );
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
