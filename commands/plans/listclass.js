const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');
const mongo = require("../../src/mongo");
module.exports = {
    name: 'sale',
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
        // console.log(message);
        nextButton.setLabel('▶️');
        nextButton.setStyle('SECONDARY')
        nextButton.setCustomId('mextClassroom'+message.createdTimestamp);
        previosButton.setStyle('SECONDARY')
        previosButton.setLabel('◀️');
        previosButton.setCustomId('previosClassroom'+message.createdTimestamp);
        const row = new MessageActionRow().addComponents(previosButton, nextButton);
        const filter = (interaction) =>{
            if(interaction.user.id == message.author.id){
                return true
            }
        }
        
                     
        let saletable = []
        await mongo().then(async mongoose =>{
            try{
                
                const result = await classroomsSchema.find()
                for(let i = 0; i<result.length; i++){
                    
                    saletable.push(result[i])
                    
                }
                
                
            }finally{
                mongoose.connection.close()
            }
        })
            
        // console.log(saletable);
        module.exports.getdata(start, end, message, row, null, saletable) 
        // const collector = message.channel.createMessageComponentCollector({
            // https://stackoverflow.com/questions/71098387/error-when-more-than-one-fight-in-same-channel
            // const reply = await message.fetchReply();
            const collector = await message.createMessageComponentCollector({ 
            filter,
            time: 10000
        });
        let i = 0
        collector.on('collect', async interaction => {
            collector.resetTimer()
            i++
            await interaction.deferUpdate();
            await wait(4000);
            await interaction.editReply({ content: `cos2 ${i}`, components: [row] });
            // await interaction.update({ content: `cos2 ${i}`, components: [row] })
            // // interaction.deferUpdate() 
            // if(interaction.customId  == 'mextClassroom'){
            //     start  = start + 10
            //     end = end +10
            //     if(end<=saletable.length){
            //         module.exports.getdata(start, end, message, row, interaction.message, saletable)
            //         collector.resetTimer()
            //     }else{
            //         end = saletable.length
            //         start  = saletable.length - 10
            //         module.exports.getdata(start, end, message, row, interaction.message, saletable)
            //         collector.resetTimer()
            //     }
                
                
                
            // }else if(interaction.customId  == 'previosClassroom'){
            //     start  = start - 10
            //     end = end -10
            //     if(start>=0){
            //         module.exports.getdata(start, end, message, row, interaction.message, saletable) 
            //         collector.resetTimer()
                    
            //     }else{
            //         start = 0
            //         end = 10
            //         module.exports.getdata(start, end, message, row, interaction.message, saletable)
            //         collector.resetTimer()
            //     }
                 
            // }
            // // interaction.reply('Clicked!')
            
          })
          collector.on('end', collected => {
            console.log(`Collected ${collected.size} clicks`)
          })
        
    },

    getdata: async (start, end, message, row, edit, tablica)=>{
        const embed = new MessageEmbed();
                embed.setTitle('Lista wszystkich sal w ZSE')
                embed.setColor('#E67E22');
                str = ''
        for(let x = start; x<end; x++){
            str = str+(x+1)+". `"+tablica[x].name+"`\n"
        }
        embed.setDescription(str);
                embed.setFooter({ text: `Showing ${end} of ${tablica.length}` });
                if(edit == null){
                    message.channel.send({ content: "cos", components: [row] });
                }else{
                    edit.edit({ embeds: [embed], components: [row] })
                }
                // msg.edit({ embeds: [embed], components: [row] })
    }
};