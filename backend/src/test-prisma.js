import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("Products found by Prisma:", products.length);
  const users = await prisma.user.findMany();
  console.log("Users found by Prisma:", users.length);
  if (users && users.length > 0 && users[0]) {
    console.log("First user email:", users[0].email);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
