const puppeteer = require('puppeteer');
const chachedStudentsPlansSvgSchema = require("../schemas/cached-students-plans-svg-schema.js");
const cachedTeachersPlansSchema = require('../schemas/cached-teachers-plans-schema.js');
const mongo = require("../src/mongo");
module.exports = {

     myPlans: async (client) => {
        try {
          const browser = await puppeteer.launch();
          const [page] = await browser.pages();
          // classnr = classnr.toString()
          await mongo().then(async mongoose =>{
            try{
          for (let index = 0; index < 90; index++) {
            try {
              let classnr = index.toString()
            await page.goto('https://zsel.edupage.org/timetable/view.php?num=63&class=*'+classnr, { waitUntil: 'networkidle0' });
            const data = await page.evaluate(() => document.querySelector('svg').outerHTML);
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/xml");
            let paragraphs = doc.getElementsByTagName('text')[0].childNodes[0].nodeValue.toLocaleLowerCase()
            console.log(paragraphs + " "+index);
            
                  await chachedStudentsPlansSvgSchema.findOneAndUpdate({
                      _id: paragraphs
                  },{
                      _id: paragraphs,
                      plan: data
                  },{
                      upsert: true
                  })
            } catch (error) {
              console.log(error);
            }
                  
                }
              }finally{
                  mongoose.connection.close()
              }
            })
          
          
      
          
      
          await browser.close();
          //return data;
        } catch (err) {
          console.error(err);
        }
        
      },
      myPlansTeachers: async (client) => {
        try {
          const browser = await puppeteer.launch();
          const [page] = await browser.pages();
          // classnr = classnr.toString()
          await mongo().then(async mongoose =>{
            try{
          for (let index = 0; index < 90; index++) {
            try {
              let classnr = index.toString()
            // await client.fun.sleep(30000)
            await page.goto('https://zsel.edupage.org/timetable/view.php?num=63&teacher=-'+classnr, { waitUntil: 'networkidle0' });
            const data = await page.evaluate(() => document.querySelector('svg').outerHTML);
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/xml");
            let paragraphs = doc.getElementsByTagName('text')[0].childNodes[0].nodeValue.toLocaleLowerCase()
            if(paragraphs != '1ta'){
              console.log(paragraphs + " "+index);
            
              await cachedTeachersPlansSchema.findOneAndUpdate({
                  _id: paragraphs
              },{
                  _id: paragraphs,
                  plan: data
              },{
                  upsert: true
              })
              
            }
            } catch (error) {
              console.log(err);
            }
            
            
                }
              }finally{
                  mongoose.connection.close()
              }
            })
          
          
      
          
      
          await browser.close();
          //return data;
        } catch (err) {
          console.error(err);
        }
        
      },
      
}