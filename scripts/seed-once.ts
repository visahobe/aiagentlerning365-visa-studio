import "dotenv/config";
import { seedAll } from "../src/db/seed";

seedAll()
  .then(() => {
    console.log("seeded");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
