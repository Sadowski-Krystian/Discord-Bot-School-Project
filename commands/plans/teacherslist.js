const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const cachedTeachersPlansSchema = require('../../schemas/cached-teachers-plans-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');

const mongo = require("../../src/mongo");
module.exports = {
    name: 'nauczyciele',
    aliases: [],
    utilisation: '`prefix` nauczyciel',
    usage: 'zwraca listę wszystkich nauczycieli w zse',//shows
    requiredPermission: false,
    cooldown: 5,
    minArgs: 0,

    execute: async (client, message, args) =>{
        message.start = 0
        
        const nextButton = new MessageButton();
        const previosButton = new MessageButton();
        const minButton = new MessageButton();
        const maxButton = new MessageButton();
        // console.log(message);
        nextButton.setLabel('▶️');
        nextButton.setStyle('SECONDARY')
        nextButton.setCustomId('mextTeacher');
        previosButton.setStyle('SECONDARY')
        previosButton.setLabel('◀️');
        previosButton.setCustomId('previosTeacher');
        minButton.setStyle('SECONDARY')
        minButton.setLabel('⏮️');
        minButton.setCustomId('minTeacher');
        maxButton.setStyle('SECONDARY')
        maxButton.setLabel('⏭️');
        maxButton.setCustomId('maxTeacher');
        const row = new MessageActionRow().addComponents(minButton,previosButton, nextButton,maxButton);
        const filter = (interaction) =>{
            if(interaction.user.id == message.author.id){
                return true
            }
        }
        
                     
        let saletable = []
        await mongo().then(async mongoose =>{
            try{
                
                const result = await cachedTeachersPlansSchema.find()
                for(let i = 0; i<result.length; i++){
                    
                    saletable.push(result[i])
                    
                }
                
                
            }finally{
                mongoose.connection.close()
            }
        })
        if(saletable.length>10){
            message.end = 10
        }else{
            message.end = saletable.length
        }
        const embed = new MessageEmbed();
        embed.setTitle('Lista wszystkich nauczycieli w ZSE (RODO)')
        embed.setColor('#E67E22');

        let content = module.exports.getdata(message.start, message.end, saletable)
        // console.log(content);
        embed.setDescription(content);
        embed.setFooter({ text: `Showing ${message.end} of ${saletable.length}` });
        let msg = await message.channel.send({ embeds: [embed], components: [row] })
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: 10000
        });
        collector.on('collect', async interaction => {
            const embedrepley = new MessageEmbed();
            embedrepley.setTitle('Lista wszystkich nauczycieli w ZSE (RODO)')
            embedrepley.setColor('#E67E22');
    
            
            
            await interaction.deferUpdate();
            switch (interaction.customId) {
                case 'mextTeacher': {
                    message.start = message.start + 10
                    message.end = message.end + 10
                            if(message.end>saletable.length){
                                message.end = saletable.length
                                message.start  = saletable.length - 10
                                if(message.start<0){
                                    message.start = 0
                                }
                                
                            }
                    break;
                }
                case 'previosTeacher': {
                    message.start = message.start - 10
                    message.end = message.end - 10
                    if (message.start < 0) {
                        message.start = 0
                        message.end = 10
                        if(message.end>saletable.length){
                            message.end = saletable.length
                        }
                        
                    }
                    break;
                }
                case 'minTeacher':{
                    message.start = 0
                    message.end = 10
                    if(message.end>saletable.length){
                        message.end = saletable.length
                    }
                    break;
                }
                case 'maxTeacher':{
                    message.end = saletable.length
                    message.start  = saletable.length - 10
                    if(message.start<0){
                        message.start = 0
                    }
                    break;
                }
            }
            let contentreplay = module.exports.getdata(message.start, message.end, saletable)
            // console.log(content);
            embedrepley.setDescription(contentreplay);
            embedrepley.setFooter({ text: `Showing ${message.end} of ${saletable.length}` });
            await interaction.editReply({ embeds: [embedrepley], components: [row] });
            collector.resetTimer()
            
          })
          collector.on('end', collected => {
            console.log(`Collected ${collected.size} clicks`)
          })
        
    },

    getdata: (start, end, tablica) => {
        let str = ''
        // console.log(tablica[0]);
        for (let x = start; x < end; x++) {
            str = str + (x + 1) + ". `" + tablica[x]._id + "`\n"
        }
        return str

        // msg.edit({ embeds: [embed], components: [row] })
    }
};