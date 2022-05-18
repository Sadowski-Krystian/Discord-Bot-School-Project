const { MessageAttachment } = require('discord.js');
const cachedTeachersPlansSchema = require('../../schemas/cached-teachers-plans-schema');
// const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('./../../functions/svt-to-img.js');
module.exports = {
    name: 'nauczyciel',
    aliases: [],
    utilisation: '`prefix` nauczyciel `nauczyciel`',
    usage: 'Zwraca Plan lekcji danego nauczyciela. Nazwa nauczyciela musi być zgodna z listą pod komendą `nauczyciele` ze względów RODO',//shows
    requiredPermission: false,
    cooldown: 30,
    minArgs: 1,

    execute: async (client, message, args) =>{
        let cos
        await mongo().then(async mongoose =>{
            try{
                        
                        const result = await cachedTeachersPlansSchema.findOne({_id: args[0].toLocaleLowerCase()})
                        // console.log(result);
                        cos = result
                        
                        
                        
            }finally{
                mongoose.connection.close()
            }
        })
        if(cos){
            htmltoimg(cos['plan']).then((img)=>{
                message.channel.send({content: `To jest plan nauczyciela ${args[0].toLocaleLowerCase()}\n⁣`, files: [{ attachment: img }]})
            })
        }else{
            message.channel.send('Nie znaleziono takiego nauczyciela. sprawdź `nauczyciele`')
        }
        // console.log(cos);
    },
};