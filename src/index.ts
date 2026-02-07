import { GatewayIntentBits as Intents } from "discord.js";
import { ExtendedClient } from "./classes/ExtendedClient.js";
import { BOT_TOKEN } from "./config.js";

const client = new ExtendedClient({
  intents:
    Intents.Guilds |
    Intents.GuildMessages |
    Intents.MessageContent |
    Intents.GuildMembers,
});

client.login(BOT_TOKEN);
