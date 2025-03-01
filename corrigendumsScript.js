import scrapeTender from "./scraper.js";
import { E_TENDER_WEBSITE_URL, MONGO_SERVER_URI } from "./config.js";
import { eCorrigendumScrapper } from "./utils.js";
import { connectDB } from "./database.js";
import { CorrigendumSchema } from "./schema.js";
import mongoose from "mongoose";

connectDB(MONGO_SERVER_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    const Corrigendums = mongoose.model("Corrigendums", CorrigendumSchema);
    await scrapeTender(E_TENDER_WEBSITE_URL, eCorrigendumScrapper, Corrigendums);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
