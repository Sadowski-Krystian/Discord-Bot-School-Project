module.exports = (client, int) => {
    if (!int.isButton()) return;


    // switch (int.customId) {
    //     case 'mextClassroom': {
    //         // int.reply("dawaj poprzednią strone")
    //         // console.log();
    //         // if (!queue || !queue.playing) return int.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true, components: [] });

    //         // int.member.send(`You saved the track ${queue.current.title} | ${queue.current.author} from the server ${int.member.guild.name} ✅`).then(() => {
    //         //     return int.reply({ content: `I have sent you the title of the music by private messages ✅`, ephemeral: true, components: [] });
    //         // }).catch(error => {
    //         //     return int.reply({ content: `Unable to send you a private message... try again ? ❌`, ephemeral: true, components: [] });
    //         // });
    //     }
    //     case 'previosClassroom': {
    //         int.reply("dawaj poprzednią strone")
    //         // if (!queue || !queue.playing) return int.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true, components: [] });

    //         // int.member.send(`You saved the track ${queue.current.title} | ${queue.current.author} from the server ${int.member.guild.name} ✅`).then(() => {
    //         //     return int.reply({ content: `I have sent you the title of the music by private messages ✅`, ephemeral: true, components: [] });
    //         // }).catch(error => {
    //         //     return int.reply({ content: `Unable to send you a private message... try again ? ❌`, ephemeral: true, components: [] });
    //         // });
    //     }
    // }
};