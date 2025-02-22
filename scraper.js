const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const uri = 'mongodb+srv://sumitbaudh2205:yUkHfLNv5DWsz6zy@sarakari-tender.neegz.mongodb.net/scrapper?retryWrites=true&w=majority&appName=sarakari-tender'

const MONGO_URI = uri || "mongodb://localhost:27017/scraper";

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const TenderSchema = new mongoose.Schema({
  title: String,
  referenceNo: { type: String, index: true },
  closingDate: String,
  bidOpeningDate: String,
  link: String
}, { timestamps: true });

const Tenders = mongoose.model("Tenders", TenderSchema);

async function scrapeTender() {
  console.log("🚀 Starting scraper...");
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new", // Use "new" mode for stability
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://etender.up.nic.in/nicgep/app", { waitUntil: "domcontentloaded" });

    const jobData = await page.evaluate(() => {
      let jobs = [];
      document.querySelectorAll("#activeTenders tr").forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 4) {
          jobs.push({
            title: columns[0]?.innerText.trim(),
            referenceNo: columns[1]?.innerText.trim(),
            closingDate: columns[2]?.innerText.trim(),
            bidOpeningDate: columns[3]?.innerText.trim(),
            link: columns[0]?.querySelector("a")?.href || null
          });
        }
      });
      return jobs;
    });

    console.log(`✅ Scraped ${jobData.length} tenders.`);

    if (jobData.length > 0) {
      const bulkOps = jobData.map(tender => ({
        updateOne: {
          filter: { referenceNo: tender.referenceNo }, // Match existing document
          update: { $set: tender },
          upsert: true // Insert if not exists
        }
      }));

      await Tenders.bulkWrite(bulkOps);
      console.log("✅ Data saved to MongoDB.");
    } else {
      console.log("⚠️ No tenders found.");
    }
  } catch (error) {
    console.error("❌ Error in scraping:", error);
  } finally {
    if (browser) await browser.close();
    mongoose.connection.close(); // Close MongoDB connection
    console.log("🔄 Script completed, exiting...");
    process.exit(0); // Ensure script exits
  }
}

module.exports = scrapeTender;

// Run directly if script is executed (not imported)
if (require.main === module) {
  scrapeTender();
}
