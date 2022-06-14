const commandPrefixSchema = require("../schemas/command-prefix-schema");
const mongo = require("../src/mongo");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const cachedTeachersPlansSchema = require("../schemas/cached-teachers-plans-schema");
module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

    client.user.setActivity(client.config.app.playing);
   await module.exports.loadPrefixes(client)
   await module.exports.loadTeachers(client)
   const CLIENT_ID = client.user.id;
   const guild_id = "812303051377213463"
   console.log("registering in rest");
   const rest = new REST({ version: '9' }).setToken(client.config.app.token);
 (async () => {
     
     try {
         
         console.log('Started refreshing application (/) commands.');
         // console.log(client.slashCommands);
         for (const guild of client.guilds.cache){
             await rest.put(
                 Routes.applicationGuildCommands(CLIENT_ID, guild[1].id),
                 { body: client.slashCommands },
             );
             
             
     }
         
 
         console.log('Successfully reloaded application (/) commands.');
     } catch (error) {
         console.error(error);
     }
 })();
};

module.exports.loadPrefixes = async (client) =>{
    
    await mongo().then(async mongoose =>{
        try{
            for (const guild of client.guilds.cache){
                    const result = await commandPrefixSchema.findOne({_id: guild[1].id})
                    try{
                        guildPrefixes[guild[1].id] = result.prefix 
                    }catch{
                        guildPrefixes[guild[1].id] = 's'
                    }
                    
                    console.log(guildPrefixes);
            }
        }finally{
            
        }
    })

}
module.exports.loadTeachers = async (client) =>{
    let result
    await mongo().then(async mongoose =>{
        try{
           
                    const tmp_result = await cachedTeachersPlansSchema.find()
                   result = tmp_result
                    
                    
            
        }finally{
            
        }
    })
    result.forEach(element => {
        client.nauczyciele.push({name: element.id, value: element.id})
        
    });
    console.log(client.nauczyciele.length);
}


