const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;
const GUILD_ID = '1476138801872240794';
const VOICE_CHANNEL_ID = '1476189302416478371';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

let connection;

async function connectVoice() {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) return console.log("Guild tidak ditemukan");

        const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
        if (!channel) return console.log("Voice channel tidak ditemukan");

        console.log("Masuk voice channel...");

        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfMute: true,
            selfDeaf: true
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20000);
        console.log("Bot aktif di voice (24 jam)");

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            console.log("Disconnect, reconnect 5 detik...");
            try {
                await entersState(connection, VoiceConnectionStatus.Signalling, 5000);
            } catch {
                connection.destroy();
                setTimeout(connectVoice, 5000);
            }
        });

    } catch (err) {
        console.log("Error:", err);
        setTimeout(connectVoice, 5000);
    }
}

client.once('clientReady', () => {
    console.log(`Login sebagai ${client.user.tag}`);
    connectVoice();
});

client.login(TOKEN);