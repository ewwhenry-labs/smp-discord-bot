import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextChannel,
  TextDisplayBuilder,
} from "discord.js";
import { defineEvent } from "../classes/Event.js";
import Tickets from "../services/Tickets.js";
import { prisma } from "../lib/prisma.js";
import { Category, State } from "../generated/prisma/enums.js";

export default defineEvent({
  name: "interactionCreate",
  once: false,
  run: async (_client, interaction: ButtonInteraction) => {
    if (!interaction.isButton() || !interaction.guildId) return;
    const guildConfig = await prisma.guildConfig.findFirst({
      where: { guildId: interaction.guildId! },
    });
    const buttonId = interaction.customId;

    if (!guildConfig) return;

    const [cmd, args] = buttonId.split(":");

    switch (cmd) {
      case "tickets":
        await interaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });
        if (!guildConfig.ticketsParentChannelId) return;
        const ticketSystem = new Tickets(
          interaction.guildId,
          guildConfig.ticketsParentChannelId,
        );

        const ticket = await ticketSystem.createTicket({
          openerId: interaction.user.id,
          category: args as Category,
        });

        await interaction.editReply({
          content: `:tickets: Ticket creado con éxito en el canal <#${ticket.channelId}>`,
        });
        break;

      case "take_ticket":
        await interaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });

        let interactionMember = await interaction.guild?.members.fetch(
          interaction.user.id,
        );
        if (!interactionMember) return;

        if (
          !interactionMember.roles.cache.has(guildConfig.ticketsStaffRoleId!)
        ) {
          await interaction.editReply({
            content: `:x: No tienes el rol de staff para tomar tickets`,
          });
          return;
        }

        const currentTicket = await prisma.ticket.update({
          where: {
            humanId: args,
          },
          data: {
            state: State.OPEN,
            responsableId: interaction.user.id,
          },
        });

        await interaction.editReply({
          content: `:tickets: Ticket tomado con éxito`,
        });

        const channel = await _client.channels.fetch(currentTicket.channelId);
        if (channel)
          await (channel as TextChannel).send({
            components: [
              new ContainerBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `:tickets: <@${currentTicket.openerId}>, tu ticket ha sido tomado por <@${interaction.user.id}>`,
                ),
              ),
            ],
            flags: MessageFlags.IsComponentsV2,
          });
        interaction.message.edit({
          components: [
            new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `### :tickets: Ticket creado por <@${currentTicket.openerId}>\nCategoria: ${currentTicket.category}\n-# Tomado por <@${currentTicket.responsableId}>`,
              ),
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`close_ticket:${currentTicket.humanId}`)
                .setEmoji("🤝")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Cerrar ticket"),
            ),
          ],
          flags: MessageFlags.IsComponentsV2,
        });
        break;
    }
  },
});
