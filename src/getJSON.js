const puppeteer = require('puppeteer');
const chachedStudentsPlansSvgSchema = require("../schemas/cached-students-plans-svg-schema.js")
const mongo = require("../src/mongo");
const axios = require('axios');
const classroomsSchema = require('../schemas/classrooms-schema.js');
const periodsSchema = require('../schemas/periods-schema.js');
const teachersSchema = require('../schemas/teachers-schema.js');
const cardsSchema = require('../schemas/cards-schema.js');
const lessonsSchema = require('../schemas/lessons-schema.js');
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
        }else if(res.r.dbiAccessorRes.tables[i].id == 'teachers'){
          console.log('nauczyciele');
          await module.exports.adddataTeachers(res.r.dbiAccessorRes.tables[i])
        }else if(res.r.dbiAccessorRes.tables[i].id == 'cards'){
          await module.exports.adddataCards(res.r.dbiAccessorRes.tables[i])

        }else if(res.r.dbiAccessorRes.tables[i].id == 'lessons'){
          await module.exports.adddataLessons(res.r.dbiAccessorRes.tables[i])
        }
      }


      },
      async adddataClasses (res){
        
          await mongo().then(async mongoose =>{
            
            try{
              for(let x = 0; x<res.data_rows.length; x++){
                // await client.fun.sleep(10000)
                // console.log(res.data_rows[x]);
                console.log('dodano classes', x);
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
                // await client.fun.sleep(10000)
                // console.log(res.data_rows[x]);
                console.log('dodano periods', x);
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
        
      },
      async adddataTeachers (res){
        
        await mongo().then(async mongoose =>{
          try{
            for(let x = 0; x<res.data_rows.length; x++){
              // await client.fun.sleep(10000)
              // console.log(res.data_rows[x]);
              console.log('dodano teachers', x);
              await teachersSchema.findOneAndUpdate({
                  _id: res.data_rows[x].id
              },{
                  _id: res.data_rows[x].id,
                  short: res.data_rows[x].short,
                  gender: res.data_rows[x].gender,
                  bell: res.data_rows[x].bell,
                  color: res.data_rows[x].color,
              },{
                  upsert: true
              })
            }
              
          }finally{
              mongoose.connection.close()
          }
        })
      
    }, 
    async adddataCards (res){
        
      await mongo().then(async mongoose =>{
        try{
          for(let x = 0; x<res.data_rows.length; x++){
            // await client.fun.sleep(10000)
            // console.log(res.data_rows[x]);
            console.log('dodano cards', x);
            await cardsSchema.findOneAndUpdate({
                _id: res.data_rows[x].id
            },{
                _id: res.data_rows[x].id,
                lessonid: res.data_rows[x].lessonid,
                period: res.data_rows[x].period,
                days: res.data_rows[x].days,
            },{
                upsert: true
            })
          }
            
        }finally{
            mongoose.connection.close()
        }
      })
    
  }, async adddataLessons (res){
        
      await mongo().then(async mongoose =>{
        try{
          for(let x = 0; x<res.data_rows.length; x++){
            // await client.fun.sleep(10000)
            // console.log(res.data_rows[x]);
            console.log('dodano lessons', x);
            await lessonsSchema.findOneAndUpdate({
                _id: res.data_rows[x].id
            },{
                _id: res.data_rows[x].id,
                subjectid: res.data_rows[x].subjectid,
                teacherids: res.data_rows[x].teacherids,
                groupids: res.data_rows[x].groupids,
                classids: res.data_rows[x].classids,
                count: res.data_rows[x].count,
                durationperiods: res.data_rows[x].durationperiods,
                classroomidss: res.data_rows[x].classroomidss,
                terms: res.data_rows[x].terms,
            },{
                upsert: true
            })
          }
            
        }finally{
            mongoose.connection.close()
        }
      })
    
  }, 

}