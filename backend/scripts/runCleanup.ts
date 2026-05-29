import { runCleanup } from "../src/services/cleanup.service.js";
import { prisma } from "../src/prisma/client.js";

const main = async () => {
  console.log("Starting cleanup...");

  const result = await runCleanup();

  console.log("Cleanup completed.");
  console.table(result);
};

main()
  .catch((error) => {
    console.error("Cleanup failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
