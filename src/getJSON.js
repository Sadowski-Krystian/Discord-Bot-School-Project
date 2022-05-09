const puppeteer = require('puppeteer');
const chachedStudentsPlansSvgSchema = require("../schemas/cached-students-plans-svg-schema.js")
const mongo = require("../src/mongo");
const axios = require('axios');
const classroomsSchema = require('../schemas/classrooms-schema.js');
const periodsSchema = require('../schemas/periods-schema.js');
// const myschemas = {'classrooms': classroomsSchema}
module.exports = {

     myJSON: async () => {
      const data = {"__args":[null,"21"],"__gsh":"00000000"}
      const res = await axios.post('https://zsel.edupage.org/timetable/server/regulartt.js?__func=regularttGetData', data).then(res => res.data)

      // console.log(res.r.dbiAccessorRes.tables);
      // console.log(res.r.dbiAccessorRes.tables.length);
      for(let i = 0; i<res.r.dbiAccessorRes.tables.length; i++){
        if(res.r.dbiAccessorRes.tables[i].id == 'classrooms'){
          // console.log(res.r.dbiAccessorRes.tables[i].data_rows.length);
          // console.log(res.r.dbiAccessorRes.tables);
          await module.exports.adddataClasses(res.r.dbiAccessorRes.tables[i])
        }else if(res.r.dbiAccessorRes.tables[i].id == 'periods'){
          // console.log(res.r.dbiAccessorRes.tables[i].data_rows);
          await module.exports.adddataPeriods(res.r.dbiAccessorRes.tables[i])
          // console.log(res.r.dbiAccessorRes.tables[i].data_rows[0].starttime)
          // console.log(res.r.dbiAccessorRes.tables[i].data_rows[0].starttime.replace(':', ""));
          // console.log(parseInt(res.r.dbiAccessorRes.tables[i].data_rows[0].starttime.replace(':', "")));
        }
      }


      },
      async adddataClasses (res){
        
          await mongo().then(async mongoose =>{
            
            try{
              for(let x = 0; x<res.data_rows.length; x++){
                await client.fun.sleep(10000)
                // console.log(res.data_rows[x]);
                console.log('dodano', x);
                await classroomsSchema.findOneAndUpdate({
                    _id: res.data_rows[x].id
                },{
                    _id: res.data_rows[x].id,
                    name: res.data_rows[x].name,
                    short: res.data_rows[x].short,
                    buildingid: res.data_rows[x].buildingid,
                    sharedroom: res.data_rows[x].sharedroom,
                    needssupervision: res.data_rows[x].needssupervision,
                    color: res.data_rows[x].color
                },{
                    upsert: true
                })
                
              }
            }finally{
                mongoose.connection.close()
            }
          })
        
      },
      async adddataPeriods (res){
        
          await mongo().then(async mongoose =>{
            try{
              for(let x = 0; x<res.data_rows.length; x++){
                await client.fun.sleep(10000)
                // console.log(res.data_rows[x]);
                console.log('dodano', x);
                await periodsSchema.findOneAndUpdate({
                    _id: res.data_rows[x].id
                },{
                    _id: res.data_rows[x].id,
                    period: res.data_rows[x].period,
                    name: res.data_rows[x].name,
                    short: res.data_rows[x].short,
                    starttime: parseInt(res.data_rows[x].starttime.replace(':', "")),
                    endtime: parseInt(res.data_rows[x].endtime.replace(':', "")),
                },{
                    upsert: true
                })
              }
                
            }finally{
                mongoose.connection.close()
            }
          })
        
      }
}