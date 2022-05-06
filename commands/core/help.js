const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    showHelp: false,
    utilisation: '{prefix}help',
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
                let description = command.map(x=>x.usage)
                embed.setDescription(description[0]);
            }else{
                embed.setDescription("*Sorry, but I can't do that.*");
            }
            
        }else{
            
            const messages = ['Hi, What can I do for you?', 'Hi, What can I help you?', 'Hi, What are you want?']
            
            
            
    
            embed.setDescription('*'+messages[Math.floor(Math.random() * 3)]+'\nPlease ask me `'+guildPrefixes[message.guild.id]+'help` `[command]` for more details.*');
            embed.addField(`Enabled - ${commands.size}`, commands.map(x => `\`${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join(' | '));
    
            //embed.setTimestamp();
            //embed.setFooter('Bot created by Ewa_Kuacja', message.author.avatarURL({ dynamic: true }));
    
            
        }
        message.channel.send({ embeds: [embed] });
    },
};