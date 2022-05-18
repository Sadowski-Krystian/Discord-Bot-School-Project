const { MessageAttachment } = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const cardsSchema = require('../../schemas/cards-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');
const lessonsSchema = require('../../schemas/lessons-schema.js');
const periodsSchema = require('../../schemas/periods-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('./../../functions/svt-to-img.js');
module.exports = {
    name: 'wolny',
    aliases: [],
    utilisation: '`prefx` gabinet `godzina:optional` `dzień:optional`',
    usage: 'Zwraca listę wolnych gabinetów aktualnie lub o podanej godzinie',//shows
    requiredPermission: false,
    cooldown: 20,
    minArgs: 0,

    execute: async (client, message, args) => {
        let time
        let lessonstime
        let method
        let date = new Date(message.createdTimestamp);
        let day
        let days = ["10000", "01000", "00100", "00010", "00001"]
        if (args[1] != undefined) {
            day = args[1].toLowerCase()
        }



        switch (day) {
            case 'pon':
            case 'pn':
            case 'poniedziałek':
            case 'poniedzialek': {

                // console.log(days[0]);
                day = days[0]
                break;
            }
            case 'wt':
            case 'wtorek': {

                // console.log(days[1]);
                day = days[1]
                break;
            }
            case 'sr':
            case 'śr':
            case 'środa':
            case 'sroda': {

                // console.log(days[2]);
                day = days[2]

                break;
            }
            case 'czw':
            case 'czwartek': {

                // console.log(days[3]);
                day = days[3]

                break;
            }
            case 'pt':
            case 'pi':
            case 'piątek':
            case 'piatek':
            case 'piontek': {

                // console.log(days[4]);
                day = days[4]
                break;
            }





            default:
                // console.log(date.getDay());
                if (date.getDay() > 5) {
                    message.channel.send({ content: "Przepraszam ale dzisiaj jest weekend" })
                    return
                } else {
                    day = days[date.getDay() - 1]
                }
                break;
        }
        if (args[0] == undefined) {
            method = 'time'

            let hours = date.getHours();
            // Minutes part from the timestamp
            let minutes = "0" + date.getMinutes();
            time = (hours + ':' + minutes.substr(-2)).replace(':', "")
            time = parseInt(time)
            // console.log(time);

        } else if (parseInt(args[0]) <= 8 && parseInt(args[0]) >= 1) {
            method = 'hour'
            time = parseInt(args[0])
            // console.log(time);



        } else {
            
            method = 'time'
            time = args[0].match(/\d/g);
            if(time == null){
                const embedtime = new MessageEmbed();
                embedtime.setTitle('Nieprawidłowy format. `help wolny` po więcej informacji.')
                embedtime.setColor('RED');
                return message.channel.send({ embeds: [embedtime]})
            }
            time = time.join("");
            time = parseInt(time)
            // console.log(typeof(time));
            // console.log(time);

        }
        if (method == 'time') {
            await mongo().then(async mongoose => {
                try {

                    lessonstime = await periodsSchema.findOne({ starttime: { $lt: time }, endtime: { $gt: time } })
                    // console.log(result);




                } finally {
                    mongoose.connection.close()
                }
            })
            // console.log(lessonstime['period']);
        } else if (method == 'hour') {
            await mongo().then(async mongoose => {
                try {

                    lessonstime = await periodsSchema.findOne({ _id: time })
                    // console.log(result);




                } finally {
                    mongoose.connection.close()
                }
            })
            
            
        }
        // console.log(lessonstime['period']);
        let cards
        let classrooms
        await mongo().then(async mongoose => {
            try {
                classrooms = await classroomsSchema.find()
                cards = await cardsSchema.find({ period: lessonstime['period'], days: day })
                // console.log(result);
                console.log(classrooms.length);
                for (let x = 0; x < cards.length; x++) {
                    let tmp = await lessonsSchema.findOne({ _id: cards[x]['lessonid'] })
                    classrooms.forEach((element, index, object) => {
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
        
        if(classrooms.length>10){
            message.end = 10
        }else{
            message.end = classrooms.length
        }
        const embed = new MessageEmbed();
        embed.setTitle('Lista wolnych sal')
        embed.setColor('#E67E22');
        
        let content = module.exports.getdata(message.start, message.end, classrooms)
        embed.setDescription(content);
        embed.setFooter({ text: `Showing ${message.end} of ${classrooms.length}` });
        let msg
        if(classrooms.length>10){
            msg = await message.channel.send({ embeds: [embed], components: [row] })
        }else{
            msg = await message.channel.send({ embeds: [embed]})
        }
        
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: 20000
        });
        collector.on('collect', async interaction => {
            const embedrepley = new MessageEmbed();
            embedrepley.setTitle('Lista wolnych sal')
            embedrepley.setColor('#E67E22');
    
            
            
            await interaction.deferUpdate();
            switch (interaction.customId) {
                case 'mextClassroom': {
                    message.start = message.start + 10
                    message.end = message.end + 10
                            if(message.end>classrooms.length){
                                message.end = classrooms.length
                                message.start  = classrooms.length - 10
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
                        if(message.end>classrooms.length){
                            message.end = classrooms.length
                        }
                        
                    }
                    break;
                }
                case 'minClassroom':{
                    message.start = 0
                    message.end = 10
                    if(message.end>classrooms.length){
                        message.end = classrooms.length
                    }
                    break;
                }
                case 'maxClassroom':{
                    message.end = classrooms.length
                    message.start  = classrooms.length - 10
                    if(message.start<0){
                        message.start = 0
                    }
                    break;
                }
            }
            let contentreplay = module.exports.getdata(message.start, message.end, classrooms)
            // console.log(content);
            embedrepley.setDescription(contentreplay);
            embedrepley.setFooter({ text: `Showing ${message.end} of ${classrooms.length}` });
            await interaction.editReply({ embeds: [embedrepley], components: [row] });
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

        // msg.edit({ embeds: [embed], components: [row] })
    }
};