const Discord = require("discord.js");

const cooldowns = {}
module.exports = (client, message) => {
    
    if (message.channel.type === 'dm') return;
    if (message.author.bot){
        if(conservation){
        
            return
        }
        if(message.attachments.size > 0 && message.channel.id == guildWishChannels[message.guild.id]){
            client.fun.readspace(message)
        }
        return;
    }
    
    
    let gp
    try{
        gp = guildPrefixes[message.guild.id].toLowerCase()
    }catch{
        gp = guildPrefixes[message.guild.id]
    }
    
    const prefix = gp || client.config.app.px;
    let args = message.content.trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if (command.startsWith(client.config.app.px)) {
        
        command = command.slice(1)
        
        //var args = message.content.slice(1).trim().split(/ +/g);
    }else{
        
        if (!command.startsWith(prefix)) return;
        command = command.slice(prefix.length)
        //var args = message.content.slice(prefix.length).trim().split(/ +/g);
    }
    
    

    

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));


    // console.log(client.commands);


    if (cmd){
        if(conservation){
        
            return message.channel.send({content:"Chwilowo wyłączyliśmy wszystkie komendy ponieważ przeprowadzamy konserwacje 🤖"})
        }
        const current_time = Date.now()
        const cooldown_amount = (cmd.cooldown) * 1000
        const cooldown_left = current_time + cooldown_amount
        if(cmd.cooldown){
            console.log(cooldowns[`${cmd.name}${message.author.id}`]);
            if(cooldowns[`${cmd.name}${message.author.id}`] !== undefined){
                const msg = "*Sorry but you must wait another "
                let time = Math.ceil( ((cooldowns[`${cmd.name}${message.author.id}`] - current_time) / 1000))
                let tmp_msg
                if(time >= 60){
                    time = Math.ceil(time/60)
                    tmp_msg = `${time} minutes.*`
                    if(time >=60){
                        time = Math.ceil(time/60)
                        tmp_msg = `${time} hours.*`
                    }
                }
                let out = msg + (tmp_msg || `${time} seconds.*`)
                return message.channel.send(out)
            }
            cooldowns[`${cmd.name}${message.author.id}`] = cooldown_left
            setTimeout(() => {
                delete cooldowns[`${cmd.name}${message.author.id}`]
                console.log("usunięcie z tablicy");
             } , cooldown_amount)
            
        }
        
            if(cmd.minArgs <= args.length){
                if(cmd.requiredPermission !== false){
                    let missingperm = 0
                    // console.log(cmd.requiredPermission);
                    // console.log(cmd.requiredPermission.length);
                    cmd.requiredPermission.forEach(element => {
                        
                        if(message.member.permissions.has(element) || message.author.id == element){
                            
                        }else{
                           missingperm++
                        }
                        
                    });

                    if( cmd.requiredPermission.length == missingperm){
                        message.channel.send("*I'm sorry, you don't have permission to ask me that.*")
                    }else{
                        cmd.execute(client, message, args);
                    }
                    
                    
                }else{
                    cmd.execute(client, message, args);
                } 
            }else{
                message.channel.send("*This question need last 1 argument*")
            }
        

        
        
       
        
    } 
};
