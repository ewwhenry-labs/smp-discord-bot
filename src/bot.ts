import { GatewayIntentBits as Intents } from "discord.js";
import { ExtendedClient } from "./classes/ExtendedClient.js";

const bot = new ExtendedClient({
  intents:
    Intents.Guilds |
    Intents.GuildMessages |
    Intents.MessageContent |
    Intents.GuildMembers,
});

export default bot;
