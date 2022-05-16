
const mongo = require('./mongo');
const getJSON = require('./getJSON.js')
const getPlans = require('./getPlans.js')
module.exports = {
    async myConservation (){
      conservation = true
        await getPlans.myPlans()
        await getPlans.myPlansTeachers()
        await getJSON.myJSON()
        conservation = false
            
    },
    
}