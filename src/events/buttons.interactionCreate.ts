import { ButtonInteraction, MessageFlags } from "discord.js";
import { defineEvent } from "../classes/Event.js";
import Tickets from "../services/Tickets.js";
import { prisma } from "../lib/prisma.js";
import { Category } from "../generated/prisma/enums.js";

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

    if (buttonId.startsWith("tickets:")) {
      await interaction.deferReply();
      if (!guildConfig.ticketsParentChannelId) return;
      const ticketSystem = new Tickets(
        interaction.guildId,
        guildConfig.ticketsParentChannelId,
      );
      const [_, category] = buttonId.split(":");

      const ticket = await ticketSystem.createTicket({
        openerId: interaction.user.id,
        category: category as Category,
      });

      await interaction.reply({
        content: `:tickets: Ticket creado con éxito en el canal <#${ticket.channelId}>`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
});
