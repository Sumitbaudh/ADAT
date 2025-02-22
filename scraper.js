const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

const uri = 'mongodb+srv://sumitbaudh2205:yUkHfLNv5DWsz6zy@sarakari-tender.neegz.mongodb.net/scrapper?retryWrites=true&w=majority&appName=sarakari-tender'
const localUri = 'mongodb://localhost:27017/scraper'
// MongoDB Connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const TenderSchema = new mongoose.Schema({
  title: String,
  referenceNo:  { type: String, index: true },
  closingDate: String,
  bidOpeningDate: String,
  link: String
},
{ timestamps: true }
);
const Tenders = mongoose.model("Tenders", TenderSchema);

async function scrapeTender() {
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.goto("https://etender.up.nic.in/nicgep/app", { waitUntil: "domcontentloaded" });

  const jobData = await page.evaluate(() => {
    let jobs = [];
    document.querySelectorAll("#activeTenders tr").forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 4) { // Ensure it's a valid row
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

  console.log("Scraped Jobs:", jobData);
  const bulkOps = jobData.map(tender => ({
    updateOne: {
      filter: { referenceNo: tender.referenceNo }, // Match existing document by referenceNo
      update: {
        $set: tender, // Update the fields
        $currentDate: { updatedAt: true } // Auto-update `updatedAt`
      },
      upsert: true // Insert if not exists
    }
}));

  // Save Jobs to MongoDB
  await Tenders.bulkWrite(bulkOps).catch(err => console.log(err.message));

  await browser.close();
}

module.exports = scrapeTender;
