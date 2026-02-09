import { prisma } from "../lib/prisma.js";
import bot from "../bot.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ContainerBuilder,
  MessageFlags,
  TextChannel,
  TextDisplayBuilder,
} from "discord.js";
import { nanoid } from "nanoid";
import { Category } from "../generated/prisma/enums.js";

export default class Tickets {
  constructor(
    public guildId: string,
    public parentChannelId: string,
  ) {}

  public async getAllTickets() {}
  public async getTicket() {}
  public async createTicket({
    openerId,
    category,
  }: {
    openerId: string;
    category: Category;
  }) {
    const { channel, id: generatedId } = await this.createTicketChannel();

    const createdTicket = await prisma.ticket.create({
      data: {
        humanId: generatedId,
        category: category,
        openerId: openerId,
        channelId: channel.id,
      },
    });

    await channel.send({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `### :tickets: Ticket creado por <@${openerId}>\nCategoria: ${category}`,
          ),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`take_ticket:${createdTicket.humanId}`)
            .setEmoji("🫳")
            .setStyle(ButtonStyle.Success)
            .setLabel("Tomar Ticket"),
          new ButtonBuilder()
            .setCustomId(`refuse_ticket:${createdTicket.humanId}`)
            .setEmoji("👎")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Descartar Ticket"),
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
    await channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `Hola <@${openerId}>, gracias por crear el ticket. Explica tu situacion aquí y en breve un staff atendera tu ticket.`,
          ),
        ),
      ],
    });

    return createdTicket;
  }

  private async createTicketChannel(): Promise<{
    id: string;
    channel: TextChannel;
  }> {
    const guild = await bot.guilds.fetch(this.guildId);
    const parentChannel = await bot.channels.fetch(this.parentChannelId);

    if (parentChannel) {
      const id = nanoid(6);
      const channel = await guild.channels.create({
        name: `ticket-${id}`,
        parent: this.parentChannelId,
        type: ChannelType.GuildText,
      });

      return {
        id,
        channel,
      };
    }

    throw new Error("No se pudo crear el canal de tickets");
  }
}
