const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/scraper", { useNewUrlParser: true, useUnifiedTopology: true });

const TenderSchema = new mongoose.Schema({
  title: String,
  referenceNo: String,
  closingDate: String,
  bidOpeningDate: String,
  link: String
});
const Tenders = mongoose.model("Tenders", TenderSchema);

async function scrapeJobs() {
  const browser = await puppeteer.launch({ headless: true });
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

  // Save Jobs to MongoDB
  await Tenders.insertMany(jobData, { ordered: false }).catch(err => console.log(err.message));

  await browser.close();
}

// Run the scraper
scrapeJobs();
