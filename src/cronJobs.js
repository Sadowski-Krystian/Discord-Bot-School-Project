const cron = require('cron').CronJob
console.log("-> Loaded Cron Jobs");
let importData = new cron("00 42 13 * * *", client.fun.myConservation);
importData.start()