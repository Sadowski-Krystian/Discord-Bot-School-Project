const puppeteer = require('puppeteer');
const chachedStudentsPlansSvgSchema = require("../schemas/cached-students-plans-svg-schema.js")
const mongo = require("../src/mongo");
const axios = require('axios')
module.exports = {

     myJSON: async () => {
      const data = {"__args":[null,"21"],"__gsh":"00000000"}
      const res = await axios.post('https://zsel.edupage.org/timetable/server/regulartt.js?__func=regularttGetData', data).then(res => res.data)

      console.log(res.r.dbiAccessorRes.tables);
      },
      sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
}