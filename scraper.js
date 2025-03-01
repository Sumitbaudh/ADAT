const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

async function scrapeTender(url, scrapperFunc, dbInstance) {
  console.log("🚀 Starting scraper...");
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new", // Use "new" mode for stability
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const jobData = await page.evaluate(scrapperFunc);

    console.log(`✅ Scraped ${jobData.length} tenders.`);

    if (jobData.length > 0) {
      const bulkOps = jobData.map((tender) => ({
        updateOne: {
          filter: { referenceNo: tender.referenceNo }, // Match existing document
          update: { $set: tender },
          upsert: true, // Insert if not exists
        },
      }));

      await dbInstance.bulkWrite(bulkOps);
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
