const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');
const mongo = require("../../src/mongo");
module.exports = {
    name: 'sale',
    aliases: [],
    utilisation: '`prefix` sale',
    usage: 'zwraca listę wszystkich sal w zse',//shows
    requiredPermission: false,
    cooldown: 5,
    minArgs: 0,

    execute: async (client, message, args) => {
        message.start = 0
        const nextButton = new MessageButton();
        const previosButton = new MessageButton();
        const minButton = new MessageButton();
        const maxButton = new MessageButton();
        // console.log(message);
        nextButton.setLabel('▶️');
        nextButton.setStyle('SECONDARY')
        nextButton.setCustomId('mextClassroom');
        previosButton.setStyle('SECONDARY')
        previosButton.setLabel('◀️');
        previosButton.setCustomId('previosClassroom');
        minButton.setStyle('SECONDARY')
        minButton.setLabel('⏮️');
        minButton.setCustomId('minClassroom');
        maxButton.setStyle('SECONDARY')
        maxButton.setLabel('⏭️');
        maxButton.setCustomId('maxClassroom');
        const row = new MessageActionRow().addComponents(minButton,previosButton, nextButton,maxButton);
        const filter = (interaction) => {
            if (interaction.user.id == message.author.id) {
                return true
            }
        }


        let saletable = []
        await mongo().then(async mongoose => {
            try {

                const result = await classroomsSchema.find()
                for (let i = 0; i < result.length; i++) {

                    saletable.push(result[i])

                }


            } finally {
                mongoose.connection.close()
            }
        })
        if(saletable.length>10){
            message.end = 10
        }else{
            message.end = saletable.length
        }
        const embed = new MessageEmbed();
        embed.setTitle('Lista wszystkich sal w ZSE')
        embed.setColor('#E67E22');

        let content = module.exports.getdata(message.start, message.end, saletable)
        // console.log(content);
        embed.setDescription(content);
        embed.setFooter({ text: `Showing ${message.end} of ${saletable.length}` });
        let msg = await message.channel.send({ embeds: [embed], components: [row] })
        // console.log(saletable);
        // let msg = module.exports.getdata(start, end, message, row, null, saletable) 
        // const collector = message.channel.createMessageComponentCollector({
        // https://stackoverflow.com/questions/71098387/error-when-more-than-one-fight-in-same-channel
        // const reply = await message.fetchReply();
        // console.log(msg);
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: 20000
        });
        collector.on('collect', async interaction => {
            const embedrepley = new MessageEmbed();
            embedrepley.setTitle('Lista wszystkich sal w ZSE')
            embedrepley.setColor('#E67E22');
    
            
            
            await interaction.deferUpdate();
            switch (interaction.customId) {
                case 'mextClassroom': {
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
                case 'previosClassroom': {
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
                case 'minClassroom':{
                    message.start = 0
                    message.end = 10
                    if(message.end>saletable.length){
                        message.end = saletable.length
                    }
                    break;
                }
                case 'maxClassroom':{
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

    getdata: (start, end, tablica) => {
        let str = ''
        for (let x = start; x < end; x++) {
            str = str + (x + 1) + ". `" + tablica[x].name + "`\n"
        }
        return str

        // msg.edit({ embeds: [embed], components: [row] })
    }
};