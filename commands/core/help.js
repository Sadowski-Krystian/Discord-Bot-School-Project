const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    showHelp: false,
    utilisation: '`prefix` help',
    requiredPermission: false,
    minArgs: 0,

    execute: async (client, message, args) => {
            const embed = new MessageEmbed();
            embed.setColor('#E67E22');
            embed.setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
            const commands = client.commands.filter(x => x.showHelp !== false);
        if(args.length > 0){
            const command = commands.filter(x=>x.name == args[0] || x.aliases.includes(args[0]))
            console.log(command.size);
            if(command.size>0){
                let usage = command.map(x=>x.utilisation)
                let description = command.map(x=>x.usage)
                embed.setDescription('**Użycie: **'+usage[0]+"\n\n**Opis: **"+description[0]);
            }else{
                embed.setDescription("Nie ma takiej komendy");
            }
            
        }else{
            
            const messages = ['Witam w czym mogę ci dzis pomóc?', 'Czego dzisiaj potrzebujesz?', 'Cześć, w czym mogę ci pomóc?']
            
            
            
    
            embed.setDescription('*'+messages[Math.floor(Math.random() * 3)]+'\nWpisz `'+guildPrefixes[message.guild.id]+'help` `[command]` po więcej informacji');
            embed.addField(`Enabled - ${commands.size}`, commands.map(x => `\`${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join(' | '));
    
            //embed.setTimestamp();
            //embed.setFooter('Bot created by Ewa_Kuacja', message.author.avatarURL({ dynamic: true }));
    
            
        }
        let data = new Date
        data = data.getFullYear().toString()
        // console.log(data);
        embed.setFooter('Copyright © '+data+' Sadowski Krystian (Ewa Kuacja®) - wszelkie prawa zastrzerzone');
        message.channel.send({ embeds: [embed] });
    },
};