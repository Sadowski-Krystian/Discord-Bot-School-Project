
const mongo = require('./mongo');
module.exports = {
    async sleep(ms){
        
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          
    },
    
}