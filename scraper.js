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
      for (let tender of jobData) {
        if (tender.link) {
          console.log(`🔍 Scraping details from ${tender.link}`);

          const detailPage = await browser.newPage();
          await detailPage.goto(tender.link, { waitUntil: "domcontentloaded" });

          const additionalData = await detailPage.evaluate(() => {
            const getText = (selector) =>
              document.querySelector(selector)?.innerText.trim() || "";

            return {
              organisationChain: getText(".tablebg .td_field[colspan='5']"),
              tenderReferenceNumber: getText(".tablebg .td_field[colspan='3']"),
              tenderID: getText(
                ".tablebg tr:nth-child(3) .td_field:nth-child(2)"
              ),
              withdrawalAllowed: getText(
                ".tablebg tr:nth-child(3) .td_field:nth-child(4)"
              ),
              tenderType: getText(
                ".tablebg tr:nth-child(4) .td_field:nth-child(2)"
              ),
              formOfContract: getText(
                ".tablebg tr:nth-child(4) .td_field:nth-child(4)"
              ),
              tenderCategory: getText(
                ".tablebg tr:nth-child(5) .td_field:nth-child(1)"
              ),
              numberOfCovers: getText(
                ".tablebg tr:nth-child(5) .td_field:nth-child(2)"
              ),
              generalTechnicalEvaluationAllowed: getText(
                ".tablebg tr:nth-child(6) .td_field:nth-child(1)"
              ),
              itemWiseTechnicalEvaluationAllowed: getText(
                ".tablebg tr:nth-child(6) .td_field:nth-child(2)"
              ),
              paymentMode: getText(
                ".tablebg tr:nth-child(7) .td_field:nth-child(1)"
              ),
              isMultiCurrencyAllowedForBOQ: getText(
                ".tablebg tr:nth-child(7) .td_field:nth-child(2)"
              ),
              isMultiCurrencyAllowedForFee: getText(
                ".tablebg tr:nth-child(8) .td_field:nth-child(1)"
              ),
              allowTwoStageBidding: getText(
                ".tablebg tr:nth-child(8) .td_field:nth-child(2)"
              ),
            };
          });

          // Merge additional details into tender object
          Object.assign(tender, additionalData);

          await detailPage.close();
        }
      }
    }

    if (jobData.length > 0) {
      const bulkOps = jobData.map((tender) => ({
        updateOne: {
          filter: { tenderID: tender.tenderID }, // Match existing document
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
