require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ],
});

client.once('ready', () => {
    console.log(Bot login sebagai );

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.log('Guild tidak ditemukan');
        return;
    }

    const channel = guild.channels.cache.get(process.env.VOICE_CHANNEL_ID);
    if (!channel) {
        console.log('Voice channel tidak ditemukan');
        return;
    }

    joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
    });

    console.log('Bot berhasil masuk voice dan akan stay 24 jam');
});

client.login(process.env.DISCORD_TOKEN);
