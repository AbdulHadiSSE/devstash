import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

async function main() {
  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: { name: true, isSystem: true },
  });

  console.log(`Connected. Found ${systemTypes.length} system item types:`);
  console.log(systemTypes.map((t) => t.name).join(", "));

  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    include: {
      collections: {
        include: {
          items: {
            include: { item: { include: { itemType: true } } },
          },
        },
      },
    },
  });

  if (!demoUser) {
    console.log(`\nNo demo user found for ${DEMO_USER_EMAIL} — run "npx prisma db seed" first.`);
    return;
  }

  const totalItems = demoUser.collections.reduce((sum, c) => sum + c.items.length, 0);

  console.log(
    `\nDemo user: ${demoUser.name} <${demoUser.email}> (isPro: ${demoUser.isPro})`
  );
  console.log(
    `${demoUser.collections.length} collections, ${totalItems} items total:\n`
  );

  for (const collection of demoUser.collections) {
    console.log(`${collection.name} — ${collection.description}`);
    for (const { item } of collection.items) {
      console.log(`  [${item.itemType.name}] ${item.title} — ${item.description}`);
    }
    console.log("");
  }
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
