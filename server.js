// Importing required libraries
const cron = require("node-cron");
const express = require("express");
const scrapeTender = require('./scraper');

app = express(); // Initializing app

// Creating a cron job which runs on every 10 second
cron.schedule("* * * * *", function() {
    try{
    console.log("running a task every minute",new Date());
    scrapeTender();
    }
    catch(error){
        console.log("CRON ERROR",error);
    }
});

app.listen(3030);
