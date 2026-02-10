import { AnySelectMenuInteraction, MessageFlags } from "discord.js";
import { defineEvent } from "../classes/Event.js";
import { prisma } from "../lib/prisma.js";

export default defineEvent({
  name: "interactionCreate",
  once: false,
  run: async (_client, interaction: AnySelectMenuInteraction) => {
    if (!interaction.isAnySelectMenu() || !interaction.guildId) return;
    const guildConfig = await prisma.guildConfig.findFirst({
      where: { guildId: interaction.guildId! },
    });
    const buttonId = interaction.customId;

    if (!guildConfig) return;

    const [cmd, args] = buttonId.split(":");

    switch (cmd) {
      case "tickets_config":
        switch (args) {
          case "ROLE":
            await interaction.deferReply({
              flags: MessageFlags.Ephemeral,
            });
            const selectedRole = interaction.values.shift();
            if (!selectedRole) return;
            const role = await interaction.guild?.roles.fetch(selectedRole);
            if (!role) return;
            const roleId = role.id;

            await prisma.guildConfig.update({
              where: {
                guildId: interaction.guildId,
              },
              data: {
                ticketsStaffRoleId: roleId,
              },
            });

            await interaction.editReply({
              content: `:tickets: Role de staff actualizado con éxito`,
            });
            break;
          case "CHANNEL":
            await interaction.deferReply({
              flags: MessageFlags.Ephemeral,
            });
            const selectedChannel = interaction.values.shift();
            if (!selectedChannel) return;

            const channel =
              await interaction.guild?.channels.fetch(selectedChannel);
            if (!channel) return;
            const channelId = channel.id;

            await prisma.guildConfig.update({
              where: {
                guildId: interaction.guildId,
              },
              data: {
                ticketsParentChannelId: channelId,
              },
            });

            await interaction.editReply({
              content: `:tickets: Categoría de tickets actualizada con éxito`,
            });
            break;
        }
        break;
    }
  },
});
