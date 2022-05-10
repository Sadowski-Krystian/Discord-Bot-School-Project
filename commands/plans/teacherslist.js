const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const cachedTeachersPlansSchema = require('../../schemas/cached-teachers-plans-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');

const mongo = require("../../src/mongo");
module.exports = {
    name: 'nauczyciele',
    aliases: [],
    utilisation: '{prefix}plan `klasa`',
    usage: 'zwraca listę wszystkich klas',//shows
    requiredPermission: false,
    cooldown: 5,
    minArgs: 0,

    execute: async (client, message, args) =>{
        let start = 0
        let end = 10
        const nextButton = new MessageButton();
        const previosButton = new MessageButton();
        nextButton.setLabel('▶️');
        nextButton.setStyle('SECONDARY')
        nextButton.setCustomId('mextTeacher');
        previosButton.setStyle('SECONDARY')
        previosButton.setLabel('◀️');
        previosButton.setCustomId('previosTeacher');
        const row = new MessageActionRow().addComponents(previosButton, nextButton);
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
        end = saletable.length    
        // console.log(saletable[0]['_id']);
        module.exports.getdata(start, end, message, row, null, saletable) 
        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 10000
        });
        collector.on('collect', interaction => {
            interaction.deferUpdate()
            if(interaction.customId  == 'mextTeacher'){
                start  = start + 10
                end = end +10
                if(end<=saletable.length){
                    module.exports.getdata(start, end, message, row, interaction.message, saletable)
                    collector.resetTimer()
                }else{
                    end = saletable.length
                    start  = saletable.length - 10
                    if(start<0){
                        start = 0
                    }
                    module.exports.getdata(start, end, message, row, interaction.message, saletable)
                    collector.resetTimer()
                }
                
                
                
            }else if(interaction.customId  == 'previosTeacher'){
                start  = start - 10
                end = end -10
                if(start>=0){
                    module.exports.getdata(start, end, message, row, interaction.message, saletable) 
                    collector.resetTimer()
                    
                }else{
                    start = 0
                    end = saletable.length
                    module.exports.getdata(start, end, message, row, interaction.message, saletable)
                    collector.resetTimer()
                }
                 
            }
            // interaction.reply('Clicked!')
            
          })
          collector.on('end', collected => {
            console.log(`Collected ${collected.size} clicks`)
          })
        
    },

    getdata: async (start, end, message, row, edit, tablica)=>{
        const embed = new MessageEmbed();
        // console.log(tablica[0]['_id']);
                embed.setTitle('Lista wszystkich nauczycieli w ZSE')
                embed.setColor('#E67E22');
                str = ''
        for(let x = start; x<end; x++){
            // console.log(tablica[x]);
            str = str+(x+1)+". `"+tablica[x]._id+"`\n"
        }
        embed.setDescription(str);
                embed.setFooter({ text: `Showing ${end} of ${tablica.length}` });
                if(edit == null){
                    message.channel.send({ embeds: [embed], components: [row] });
                }else{
                    edit.edit({ embeds: [embed], components: [row] })
                }
                // msg.edit({ embeds: [embed], components: [row] })
    }
};