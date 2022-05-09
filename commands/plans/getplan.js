const { MessageAttachment } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('./../../functions/svt-to-img.js');
module.exports = {
    name: 'plan',
    aliases: [],
    utilisation: '{prefix}plan `klasa`',
    usage: 'Zwraca Plan lekcji danej klasy',//shows
    requiredPermission: false,
    cooldown: 30,
    minArgs: 1,

    execute: async (client, message, args) =>{
        let cos
        await mongo().then(async mongoose =>{
            try{
                        
                        const result = await cachedStudentsPlansSvgSchema.findOne({_id: args[0].toLocaleLowerCase()})
                        // console.log(result);
                        cos = result
                        
                        
                        
            }finally{
                mongoose.connection.close()
            }
        })
        if(cos){
            htmltoimg(cos['plan']).then((img)=>{
                message.channel.send({content: `To jest plan klasy ${args[0].toLocaleLowerCase()}\n⁣`, files: [{ attachment: img }]})
            })
        }else{
            message.channel.send('Nie znaleziono takiej klasy')
        }
        // console.log(cos);
    },
};