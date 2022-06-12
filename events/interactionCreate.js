module.exports = (client, interaction) => {
    if (!interaction.isCommand() || interaction.isAutocomplete()){
        switch (interaction.commandName) {
            case 'help':
                interaction.respond(client.helpChoise)
                break;
    
        }
            
        return;
    } 
    
    const command = interaction.commandName
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    if(cmd){
        const current_time = Date.now()
        const cooldown_amount = (cmd.cooldown) * 1000
        const cooldown_left = current_time + cooldown_amount
        if(cmd.cooldown){
            console.log(client.cooldowns[`${cmd.name}${interaction.member.id}`]);
            if(client.cooldowns[`${cmd.name}${interaction.member.id}`] !== undefined){
                const msg = "*Sorry but you must wait another "
                let time = Math.ceil( ((client.cooldowns[`${cmd.name}${interaction.member.id}`] - current_time) / 1000))
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
                return interaction.reply({content: out, ephemeral: true})
            }
            client.cooldowns[`${cmd.name}${interaction.member.id}`] = cooldown_left
            setTimeout(() => {
                delete client.cooldowns[`${cmd.name}${interaction.member.id}`]
                console.log("usunięcie z tablicy");
             } , cooldown_amount)
            
        }
        if(cmd.requiredPermission !== false){
            let missingperm = 0
            // console.log(cmd.requiredPermission);
            // console.log(cmd.requiredPermission.length);
            let str = ''
            cmd.requiredPermission.forEach(element => {
                if(isNaN(element)){
                    if(interaction.member.permissions.has(element) ){
                    
                    }else{
                        str = str + element+", "
                       missingperm++
                    }
                }else{
                    if(interaction.member.id == element ){
                    
                    }else{
                        str = str + "komenda dostepna tylko dla wybranych osób"
                       missingperm++
                    }
                }
                
                
            });

            if( cmd.requiredPermission.length == missingperm){
                interaction.reply({content: "Brak permisji\n"+str, ephemeral: true})
            }else{
                cmd.execute(client, null, interaction, null);
            }
            
            
        }else{

            cmd.execute(client, null, interaction, null);
        } 
    }



    
};