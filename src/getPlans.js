const puppeteer = require('puppeteer');
const chachedStudentsPlansSvgSchema = require("../schemas/cached-students-plans-svg-schema.js")
const mongo = require("../src/mongo");
module.exports = {

     myPlans: async (classnr) => {
        try {
          const browser = await puppeteer.launch();
          const [page] = await browser.pages();
          classnr = classnr.toString()
          for (let index = 17; index < 79; index++) {
            classnr = index.toString()
            await module.exports.sleep(30000)
            await page.goto('https://zsel.edupage.org/timetable/view.php?num=21&class=-'+classnr, { waitUntil: 'networkidle0' });
            const data = await page.evaluate(() => document.querySelector('svg').outerHTML);
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/xml");
            let paragraphs = doc.getElementsByTagName('text')[0].childNodes[0].nodeValue.toLocaleLowerCase()
            console.log(paragraphs + " "+index);
            await mongo().then(async mongoose =>{
              try{
                  await chachedStudentsPlansSvgSchema.findOneAndUpdate({
                      _id: paragraphs
                  },{
                      _id: paragraphs,
                      plan: data
                  },{
                      upsert: true
                  })
                  
                  
              }finally{
                  mongoose.connection.close()
              }
            })
          }
          
      
          
      
          await browser.close();
          //return data;
        } catch (err) {
          console.error(err);
        }
        
      },
      sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
}