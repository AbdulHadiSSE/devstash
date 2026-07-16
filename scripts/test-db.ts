import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: { name: true, isSystem: true },
  });

  console.log(`Connected. Found ${systemTypes.length} system item types:`);
  console.log(systemTypes.map((t) => t.name).join(", "));
}

main()
  .catch((e) => {
    console.error("Database connection test failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
