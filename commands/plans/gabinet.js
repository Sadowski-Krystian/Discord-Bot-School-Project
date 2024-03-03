const { MessageAttachment, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const cardsSchema = require('../../schemas/cards-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');
const lessonsSchema = require('../../schemas/lessons-schema.js');
const periodsSchema = require('../../schemas/periods-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('../../functions/svt-to-img.js');
const { SlashCommandBuilder, ActionRowBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().
        setName("wolny")
        .setDescription("Wyświetla listę wolnych gabinetów o danej porze")
        .addStringOption(option =>
            option.setName('godzina')
                .setDescription('Podaj godzinę lub godzinę lekcyjną')
                .setRequired(false),)
        .addStringOption(option =>
                    option.setName('dzień')
                        .setDescription('Podaj dzień')
                        .setRequired(false)
                        .addChoices(
                            { name: 'poniedziałek', value: 'pon' },
                            { name: 'wtorek', value: 'wt' },
                            { name: 'środa', value: 'sr' },
                            { name: 'czwartek', value: 'czw' },
                            { name: 'piątek', value: 'pt' },
                        )
                        ),
    name: 'wolny',
    aliases: [],
    utilisation: '`prefx` gabinet `godzina:optional` `dzień:optional`',
    usage: 'Zwraca listę wolnych gabinetów aktualnie lub o podanej godzinie',//shows
    requiredPermission: false,
    cooldown: 20,
    minArgs: 0,

    execute: async (client, message, interaction, args) => {
        let cmd = {
            start: 0,
            end: 0,
            authorID: null,
            nextButton: new ButtonBuilder().setLabel('▶️').setStyle(ButtonStyle.Secondary).setCustomId('mextClassroom'),
            previosButton: new ButtonBuilder().setLabel('◀️').setStyle(ButtonStyle.Secondary).setCustomId('previosClassroom'),
            minButton: new ButtonBuilder().setLabel('⏮️').setStyle(ButtonStyle.Secondary).setCustomId('minClassroom'),
            maxButton: new ButtonBuilder().setLabel('⏭️').setStyle(ButtonStyle.Secondary).setCustomId('maxClassroom'),
            row: null,
            time: null,
            args_time: null,
            lessonstime: null,
            method: null,
            date:null,
            cards: null,
            classrooms: null,
            day: null,
            embed: new EmbedBuilder(),
            reply: message || interaction,
            days: ["10000", "01000", "00100", "00010", "00001"],
            messageCommand: async ()=>{
                // await cmd.embedGenerator()
                // cmd.embed.setDescription("Czekam na wyniki")
                // cmd.reply.reply({ embeds: [cmd.embed], ephemeral: true, allowedMentions: {
                //     repliedUser: false
                // }})
                
                cmd.date = new Date(message.createdTimestamp);args[0]
                if (args[1] != undefined) {
                    cmd.day = args[1].toLowerCase()
                }
                cmd.args_time = args[0]
                cmd.init()
            },
            interactionCommand: async ()=>{
                await cmd.embedGenerator()
                console.log(cmd.reply);
                cmd.reply.deferReply({ephemeral: true})
                cmd.date = new Date(interaction.createdTimestamp);
                cmd.args_time = interaction.options.getString('godzina')
                cmd.day = interaction.options.getString('dzień')
                cmd.init()
            },
            embedGenerator: ()=>{
                cmd.row = new ActionRowBuilder().addComponents(cmd.minButton,cmd.previosButton, cmd.nextButton,cmd.maxButton)
                cmd.embed.setTitle('Lista wolnych gabinetów na podaną godzinę')
                cmd.embed.setColor('#E67E22');
                if(cmd.content){
                    cmd.embed.setDescription(cmd.content);
                    cmd.embed.setFooter({ text: `Showing ${cmd.end} of ${cmd.classrooms.length}` });
                }else{
                
                    cmd.embed.setDescription("Możliwe że wystapił błąd")
                    
                }
                
                
            },
            init: async ()=>{
                switch (cmd.day) {
                    case 'pon':
                    case 'pn':
                    case 'poniedziałek':
                    case 'poniedzialek': {
        
                        // console.log(cmd.days[0]);
                        cmd.day = cmd.days[0]
                        break;
                    }
                    case 'wt':
                    case 'wtorek': {
        
                        // console.log(cmd.days[1]);
                        cmd.day = cmd.days[1]
                        break;
                    }
                    case 'sr':
                    case 'śr':
                    case 'środa':
                    case 'sroda': {
        
                        // console.log(cmd.days[2]);
                        cmd.day = cmd.days[2]
        
                        break;
                    }
                    case 'czw':
                    case 'czwartek': {
        
                        // console.log(cmd.days[3]);
                        cmd.day = cmd.days[3]
        
                        break;
                    }
                    case 'pt':
                    case 'pi':
                    case 'piątek':
                    case 'piatek':
                    case 'piontek': {
        
                        // console.log(cmd.days[4]);
                        cmd.day = cmd.days[4]
                        break;
                    }
        
        
        
        
        
                    default:
                        // console.log(cmd.date);
                        if (cmd.date.getDay() > 5) {
                            cmd.reply.editReply({ content: "Przepraszam ale dzisiaj jest weekend", ephemeral: true, allowedMentions: {
                                repliedUser: false
                            }})
                            return
                        } else {
                            cmd.day = cmd.days[cmd.date.getDay() - 1]
                        }
                        break;
                }
                if (cmd.args_time == undefined) {
                    cmd.method = 'time'
        
                    let hours = cmd.date.getHours();
                    // Minutes part from the timestamp
                    let minutes = "0" + cmd.date.getMinutes();
                    cmd.time = (hours + ':' + minutes.substr(-2)).replace(':', "")
                    cmd.time = parseInt(cmd.time)
                    // console.log(cmd.time);
        
                } else if (parseInt(cmd.args_time) <= 8 && parseInt(cmd.args_time) >= 1) {
                    cmd.method = 'hour'
                    cmd.time = parseInt(cmd.args_time)
                    // console.log(time);
        
        
        
                } else {
                    
                    cmd.method = 'time'
                    cmd.time = cmd.args_time.match(/\d/g);
                    if(cmd.time == null){
                        cmd.embed.setTitle('Nieprawidłowy format. `help wolny` po więcej informacji.')
                        cmd.embed.setColor('RED');

                        return cmd.reply.editReply({ embeds: [cmd.embed], ephemeral: true, allowedMentions: {
                            repliedUser: false
                        }})
                    }
                    cmd.time = cmd.time.join("");
                    cmd.time = parseInt(cmd.time)
                    // console.log(typeof(time));
                    // console.log(time);
        
                }
                await cmd.getMongoData()
                if(!cmd.lessonstime) return;
                // console.log(cmd.classrooms);
                if (cmd.classrooms.length > 10) {
                    cmd.end = 10
                } else {
                    cmd.end = cmd.classrooms.length
                }
                cmd.content = cmd.getdata(cmd.start, cmd.end, cmd.classrooms)
                // console.log(cmd.content);
                cmd.embedGenerator()
                if (interaction) {
                    cmd.authorID = interaction.member.id
                    // console.log(cmd.reply);
                    cmd.msg = await cmd.reply.editReply({
                        embeds: [cmd.embed], components: [cmd.row], ephemeral: true, allowedMentions: {
                            repliedUser: false
                        }
                    })
                } else {
                    cmd.authorID = message.author.id
                    // console.log(cmd.reply);
                    // let tmp = cmd.reply
                    cmd.msg = await cmd.reply.reply({
                        embeds: [cmd.embed], components: [cmd.row], ephemeral: true, allowedMentions: {
                            repliedUser: false
                        }
                    })
                }
                let filter = (int) => {
                    if (int.user.id == cmd.authorID) {
                        return true
                    }
                }
                let collector = await cmd.msg.createMessageComponentCollector({
                    filter,
                    time: 10000
                })
                collector.on('collect', async int => {
                    await int.deferUpdate();
                    switch (int.customId) {
                        case 'mextClassroom': {
                            cmd.start = cmd.start + 10
                            cmd.end = cmd.end + 10
                            if (cmd.end > cmd.classrooms.length) {
                                cmd.end = cmd.classrooms.length
                                cmd.start = cmd.classrooms.length - 10
                                if (cmd.start < 0) {
                                    cmd.start = 0
                                }

                            }
                            break;
                        }
                        case 'previosClassroom': {
                            cmd.start = cmd.start - 10
                            cmd.end = cmd.end - 10
                            if (cmd.start < 0) {
                                cmd.start = 0
                                cmd.end = 10
                                if (cmd.end > cmd.classrooms.length) {
                                    cmd.end = cmd.classrooms.length
                                }

                            }
                            break;
                        }
                        case 'minClassroom': {
                            cmd.start = 0
                            cmd.end = 10
                            if (cmd.end > cmd.classrooms.length) {
                                cmd.end = cmd.classrooms.length
                            }
                            break;
                        }
                        case 'maxClassroom': {
                            cmd.end = cmd.classrooms.length
                            cmd.start = cmd.classrooms.length - 10
                            if (cmd.start < 0) {
                                cmd.start = 0
                            }
                            break;
                        }
                    }
                    cmd.content = await cmd.getdata(cmd.start, cmd.end, cmd.classrooms)
                    // console.log(content);
                    await cmd.embedGenerator()
                    await int.editReply({ embeds: [cmd.embed], components: [cmd.row] });
                    collector.resetTimer()

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
            },
            getMongoData: async ()=>{
    
                if (cmd.method == 'time') {
                    await mongo().then(async mongoose => {
                        try {

                            cmd.lessonstime = await periodsSchema.findOne({ starttime: { $lt: cmd.time }, endtime: { $gt: cmd.time } })
                            // console.log(result);




                        } finally {
                            mongoose.connection.close()
                        }
                    })
                    // console.log(lessonstime['period']);
                } else if (cmd.method == 'hour') {
                    await mongo().then(async mongoose => {
                        try {

                            cmd.lessonstime = await periodsSchema.findOne({ _id: cmd.time })
                            // console.log(result);




                        } finally {
                            mongoose.connection.close()
                        }
                    })
                    
                    
                }
                if(!cmd.lessonstime){
                    await cmd.embedGenerator()
                    cmd.embed.setDescription("Możliwe że nie odbywa się teraz żadna lekcja")
                    return cmd.reply.editReply({ embeds: [cmd.embed], ephemeral: true, allowedMentions: {
                        repliedUser: false
                    }})
                }
                await mongo().then(async mongoose => {
                    try {
                        cmd.classrooms = await classroomsSchema.find()
                        cmd.cards = await cardsSchema.find({ period: cmd.lessonstime['period'], days: cmd.day })
                        // console.log(result);
                        console.log(cmd.classrooms.length);
                        for (let x = 0; x < cmd.cards.length; x++) {
                            let tmp = await lessonsSchema.findOne({ _id: cmd.cards[x]['lessonid'] })
                            cmd.classrooms.forEach((element, index, object) => {
                                try{
                                    if(element._id == tmp['classroomidss'][0][0]){
                                        object.splice(index, 1);
                                    }
                                }catch{

                                }
                                
                            });
                        }
                        


                    } finally {
                        mongoose.connection.close()
                    }

                })
                cmd.classrooms = cmd.classrooms.sort()


            }
        }
        if (interaction) {
            cmd.interactionCommand()
        }else{
            cmd.messageCommand()
        }



       
  
        
   
    //     const filter = (interaction) => {
    //         if (interaction.user.id == message.author.id) {
    //             return true
    //         }
    //     }
        
    //     if(classrooms.length>10){
    //         message.end = 10
    //     }else{
    //         message.end = classrooms.length
    //     }
    //     const embed = new MessageEmbed();
    //     embed.setTitle('Lista wolnych sal')
    //     embed.setColor('#E67E22');
        
    //     let content = module.exports.getdata(message.start, message.end, classrooms)
    //     embed.setDescription(content);
    //     embed.setFooter({ text: `Showing ${message.end} of ${classrooms.length}` });
    //     let msg
    //     if(classrooms.length>10){
    //         msg = await message.channel.send({ embeds: [embed], components: [row] })
    //     }else{
    //         msg = await message.channel.send({ embeds: [embed]})
    //     }
        
    //     const collector = await msg.createMessageComponentCollector({
    //         filter,
    //         time: 20000
    //     });
    //     collector.on('collect', async interaction => {
    //         const embedrepley = new MessageEmbed();
    //         embedrepley.setTitle('Lista wolnych sal')
    //         embedrepley.setColor('#E67E22');
    
            
            
    //         await interaction.deferUpdate();
    //         switch (interaction.customId) {
    //             case 'mextClassroom': {
    //                 message.start = message.start + 10
    //                 message.end = message.end + 10
    //                         if(message.end>classrooms.length){
    //                             message.end = classrooms.length
    //                             message.start  = classrooms.length - 10
    //                             if(message.start<0){
    //                                 message.start = 0
    //                             }
                                
    //                         }
    //                 break;
    //             }
    //             case 'previosClassroom': {
    //                 message.start = message.start - 10
    //                 message.end = message.end - 10
    //                 if (message.start < 0) {
    //                     message.start = 0
    //                     message.end = 10
    //                     if(message.end>classrooms.length){
    //                         message.end = classrooms.length
    //                     }
                        
    //                 }
    //                 break;
    //             }
    //             case 'minClassroom':{
    //                 message.start = 0
    //                 message.end = 10
    //                 if(message.end>classrooms.length){
    //                     message.end = classrooms.length
    //                 }
    //                 break;
    //             }
    //             case 'maxClassroom':{
    //                 message.end = classrooms.length
    //                 message.start  = classrooms.length - 10
    //                 if(message.start<0){
    //                     message.start = 0
    //                 }
    //                 break;
    //             }
    //         }
    //         let contentreplay = module.exports.getdata(message.start, message.end, classrooms)
    //         // console.log(content);
    //         embedrepley.setDescription(contentreplay);
    //         embedrepley.setFooter({ text: `Showing ${message.end} of ${classrooms.length}` });
    //         await interaction.editReply({ embeds: [embedrepley], components: [row] });
    //         collector.resetTimer()
            

    //     })
    //     collector.on('end', collected => {
    //         console.log(`Collected ${collected.size} clicks`)
    //     })
    // },
  

        // msg.edit({ embeds: [embed], components: [row] })
    }
};