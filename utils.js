export const eTenderScrapper = () => {
  let jobs = [];
  document.querySelectorAll("#activeTenders tr").forEach((row) => {
    const columns = row.querySelectorAll("td");
    if (columns.length === 4) {
      let link = columns[0]?.querySelector("a")?.href
        ? new URL(columns[0]?.querySelector("a")?.href)
        : null;
      if (link) {
        link.searchParams.delete("session");
        link = link.toString();
      }

      jobs.push({
        title: columns[0]?.innerText.trim(),
        referenceNo: columns[1]?.innerText.trim(),
        closingDate: columns[2]?.innerText.trim(),
        bidOpeningDate: columns[3]?.innerText.trim(),
        link,
      });
    }
  });
  return jobs;
};


export const eCorrigendumScrapper = () => {
    let jobs = [];
    document.querySelectorAll("#activeCorrigendums tr").forEach((row) => {
      const columns = row.querySelectorAll("td");
      if (columns.length === 4) {
        let link = columns[0]?.querySelector("a")?.href
          ? new URL(columns[0]?.querySelector("a")?.href)
          : null;
        if (link) {
          link.searchParams.delete("session");
          link = link.toString();
        }
  
        jobs.push({
          title: columns[0]?.innerText.trim(),
          referenceNo: columns[1]?.innerText.trim(),
          closingDate: columns[2]?.innerText.trim(),
          bidOpeningDate: columns[3]?.innerText.trim(),
          link,
        });
      }
    });
    return jobs;
  };
