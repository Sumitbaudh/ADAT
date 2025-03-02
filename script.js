import scrapeTender from "./scraper.js";
import { E_TENDER_WEBSITE_URL, MONGO_SERVER_URI } from "./config.js";
import { eTenderScrapper } from "./utils.js";
import { connectDB } from "./database.js";
import { TenderSchema } from "./schema.js";
import mongoose from "mongoose";

connectDB(MONGO_SERVER_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    const Tenders = mongoose.model("Tenders", TenderSchema);
    await scrapeTender(E_TENDER_WEBSITE_URL, eTenderScrapper, Tenders);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
