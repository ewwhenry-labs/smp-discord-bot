import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChannelSelectMenuBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  RoleSelectMenuBuilder,
  TextChannel,
  TextDisplayBuilder,
} from "discord.js";
import { Command } from "../../classes/Command.js";
import { ExtendedClient } from "../../classes/ExtendedClient.js";
import { prisma } from "../../lib/prisma.js";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "tickets",
      description: "Get system information and statistics",
      options: [
        {
          name: "clearall",
          description: "Clear all tickets",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "spawn",
          description: "Spawn tickets",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "config",
          description:
            "Set basic configuration like category channel and staff role",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
      contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
    });
  }

  override async run(
    _client: ExtendedClient,
    intreaction: ChatInputCommandInteraction,
  ) {
    const subcommand = intreaction.options.getSubcommand();
    switch (subcommand) {
      case "clearall":
        await intreaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });
        const guildConfig = await prisma.guildConfig.findFirst({
          where: { guildId: intreaction.guildId! },
        });
        if (!guildConfig) return;
        const categoryChannels =
          (await listChannelsInCategory(
            _client,
            guildConfig.ticketsParentChannelId!,
          )) || [];

        await intreaction.editReply({
          content: `:tickets: Borrando ${categoryChannels?.length} canales de tickets dentro de la categoría <#${guildConfig.ticketsParentChannelId}>...`,
        });

        await prisma.ticket.deleteMany({
          where: {
            channelId: {
              in: categoryChannels,
            },
          },
        });

        for (const channelId of categoryChannels) {
          const channel = await _client.channels.fetch(channelId);
          if (channel) {
            await channel.delete();
          }
        }

        await intreaction.editReply({
          content: `:tickets: Todos los canales de tickets fueron borrados`,
        });
        break;

      case "spawn":
        await intreaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });
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
              .setCustomId("tickets:DUDA")
              .setEmoji("ℹ️")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:REPORTE_USUARIO")
              .setEmoji("📁")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:REPORTE_STAFF")
              .setEmoji("📋")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:REPORTE_BUG")
              .setEmoji("🔩")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:CREADOR")
              .setEmoji("📺")
              .setStyle(ButtonStyle.Primary),
          ),
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("tickets:RECUPERACION_CUENTA")
              .setEmoji("💾")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:APELANCION_BAN")
              .setEmoji("📛")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:SOS")
              .setEmoji("🆘")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:COMPRA_EXCLUSIVA")
              .setEmoji("🏆")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("tickets:COMPRA_DROIDS")
              .setEmoji("💎")
              .setStyle(ButtonStyle.Primary),
          ),
        ];

        const channel = await _client.channels.fetch(intreaction.channelId);
        if (!channel) return;

        await (channel as TextChannel).send({
          components,
          flags: MessageFlags.IsComponentsV2,
        });

        await intreaction.editReply({
          content: `:tickets: Tickets spawned`,
        });
        break;

      case "config":
        const currentConfig = await prisma.guildConfig.findFirst({
          where: { guildId: intreaction.guildId! },
        });
        const currentConfigTemplate = "Configuracion actual.";
        await intreaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });

        await intreaction.editReply({
          components: [
            new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent(currentConfigTemplate),
            ),

            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder()
                .setCustomId("tickets_config:ROLE")
                .setPlaceholder("Cambiar rol de staff")
                .setMinValues(1)
                .setMaxValues(1)
                .setDefaultRoles(
                  currentConfig?.ticketsStaffRoleId!
                    ? [currentConfig?.ticketsStaffRoleId!]
                    : [],
                )
                .setDisabled(false),
            ),
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
              new ChannelSelectMenuBuilder()
                .setCustomId("tickets_config:CHANNEL")
                .setPlaceholder("Cambiar categoría de tickets")
                .setMinValues(1)
                .setMaxValues(1)
                .setChannelTypes(ChannelType.GuildCategory)
                .setDefaultChannels(
                  currentConfig?.ticketsParentChannelId!
                    ? [currentConfig?.ticketsParentChannelId!]
                    : [],
                )
                .setDisabled(false),
            ),
          ],
          flags: MessageFlags.IsComponentsV2,
        });
        break;
    }
  }
}

async function listChannelsInCategory(
  bot: ExtendedClient,
  categoryChannelId: string,
) {
  const categoryChannel = (await bot.channels.fetch(
    categoryChannelId,
  )) as CategoryChannel;

  if (!categoryChannel) return;

  const categoryChannels = await categoryChannel.children.cache.map(
    (channel) => channel.id,
  );

  return categoryChannels;
}
