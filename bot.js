require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { 
  joinVoiceChannel, 
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ],
});

let connection;

async function connectToVoice() {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.log("Guild tidak ditemukan");

  const channel = guild.channels.cache.get(process.env.VOICE_CHANNEL_ID);
  if (!channel) return console.log("Voice channel tidak ditemukan");

  connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  console.log("Bot masuk voice channel");

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    console.log("Terputus... mencoba reconnect");
    try {
      await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
      console.log("Reconnect berhasil");
    } catch (error) {
      console.log("Reconnect gagal, mencoba ulang...");
      connection.destroy();
      setTimeout(connectToVoice, 3000);
    }
  });
}

client.once("ready", async () => {
  console.log("Bot login sebagai: " + client.user.tag);
  connectToVoice();
});

client.on("error", console.error);
process.on("unhandledRejection", console.error);

client.login(process.env.DISCORD_TOKEN);
