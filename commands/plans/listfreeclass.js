const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('./../../functions/svt-to-img.js');
module.exports = {
    name: 'sale',
    aliases: [],
    utilisation: '{prefix}plan `klasa`',
    usage: 'Zwraca listę aktualnie wolnych sal lub w podanej godzinie',//shows
    requiredPermission: false,
    // cooldown: 0,
    minArgs: 1,

    execute: async (client, message, args) =>{
        await mongo().then(async mongoose =>{
            try{
                        
                        const result = await cachedStudentsPlansSvgSchema.findOne({_id: args[0].toLocaleLowerCase()})
                        // console.log(result);
                        if(result){
                            parser = new DOMParser();
                            xmlDoc = parser.parseFromString(result['plan'],"text/xml");
                            

                            for (let index = 0; index < xmlDoc.getElementsByTagName("text").length; index++) {
                                let value = xmlDoc.getElementsByTagName("text")[index].childNodes[0].nodeValue;
                                // console.log("Wartość: "+value);
                            }
                            // htmltoimg(result['plan']).then((img)=>{
                            //     message.channel.send({content: `To jest plan klasy ${args[0].toLocaleLowerCase()}\n⁣`, files: [{ attachment: img }]})
                            // })
                        }else{
                            // message.channel.send('Nie znaleziono takiej klasy')
                        }
                        
                        
            }finally{
                mongoose.connection.close()
            }
        })
    },
};