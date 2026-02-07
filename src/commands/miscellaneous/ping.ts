import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import { Command } from "../../classes/Command.js";
import { ExtendedClient } from "../../classes/ExtendedClient.js";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Ping the bot",
      contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
    });
  }

  override async run(
    _client: ExtendedClient,
    intreaction: ChatInputCommandInteraction,
  ) {
    const components = [
      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `# :tickets: Tickets\n### Selecciona una categoria`,
        ),
      ),
      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`
### ℹ️ · Dudas
> **·:?:»** Necesitas 🚩resolver tus ❔dudas.
 
### 📁 · Reportar usuario
> **·:?:»** Reporta a un 👤usuario que ha incumplido las 
Reglas 

### 📋 · Reportar staff
> **·:?:»** Reporta a un 👨‍💻staff que ⛔no está haciendo lo correcto.

### 🔩 · Reportar Bug
> **·:?:»** Reporta ⚠️errores de :SampDroid:SampDroid.

### 📺 · Creador de Contenido
> **·:?:»** Reclama 🎁recompensa como creador de contenido.

### 💾 · Recuperar Cuenta
> **·:?:»** Recupera una 👤cuenta por 📧correo.
> - Formas de recuperar cuenta:
> - Pulsa en 💾 para cambiar tu contraseña.

### 📛 · Apelar Ban
> **·:?:»** ¿🚯Baneado injustamente o 2️⃣segunda oportunidad?

### 🆘 · Soporte global
> **·:?:»** Tienes un ⛑️problema y necesitas 📠ayuda.

### 🏆 · Compra Exclusiva
> **·:?:»** Comprar 🎸accesorios, 🏎️vehículos, 🕴️skins, 🔫armas VIP.

### 💎 · Comprar Droids
> **·:?:»** si quires comprar droids presiona 💰`),
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("dudas")
          .setEmoji("ℹ️")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("reportar_usuario")
          .setEmoji("📁")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("reportar_staff")
          .setEmoji("📋")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("reportar_bug")
          .setEmoji("🔩")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("creador_de_contenido")
          .setEmoji("📺")
          .setStyle(ButtonStyle.Primary),
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("recuperar_cuenta")
          .setEmoji("💾")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("apelar_ban")
          .setEmoji("📛")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("soporte_global")
          .setEmoji("🆘")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("compra_exclusiva")
          .setEmoji("🏆")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("comprar_droids")
          .setEmoji("💎")
          .setStyle(ButtonStyle.Primary),
      ),
    ];

    intreaction.reply({
      components,
      flags: MessageFlags.IsComponentsV2,
    });
  }
}
