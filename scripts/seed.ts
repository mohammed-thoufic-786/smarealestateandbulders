/**
 * Seed script — publishes the three official SMA properties to MongoDB.
 *
 * Usage:
 *   npm run seed
 *
 * Requires MONGODB_URI to be set (see .env.example). Without it, the app uses
 * the same three properties from the local catalogue and this script exits.
 */
import { connectDB, isDatabaseEnabled } from "../src/lib/db/connect";
import { PropertyModel } from "../src/lib/db/models";
import { OFFICIAL_PROPERTIES } from "../src/lib/data/properties";

async function main() {
  if (!isDatabaseEnabled()) {
    console.log("[seed] MONGODB_URI is not set — nothing to seed.");
    console.log("[seed] The app will use the official local catalogue instead.");
    process.exit(0);
  }

  console.log("[seed] Connecting to MongoDB…");
  await connectDB();

  console.log("[seed] Replacing the published property catalogue…");
  await PropertyModel.deleteMany({});
  await PropertyModel.insertMany(
    OFFICIAL_PROPERTIES.map((p) => ({ ...p, _id: undefined })),
  );

  console.log(`[seed] Published ${OFFICIAL_PROPERTIES.length} official properties.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
