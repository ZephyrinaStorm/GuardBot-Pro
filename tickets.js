const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Creates a new support ticket.')
    .addStringOption(option =>
      option.setName('subject')
        .setDescription('A brief summary of your issue.')
        .setRequired(true)),
  async execute(interaction) {
    const subject = interaction.options.getString('subject');
    
    // TODO: Check if a ticket system is enabled for this server in the database.
    // TODO: Check if the user already has an open ticket.

    try {
      // TODO: Find the ticket category from the database or use a default.
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        // parent: 'YOUR_TICKET_CATEGORY_ID_FROM_DB', // Set parent category
        permissionOverwrites: [
          {
            id: interaction.guild.id, // @everyone
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id, // The user who created the ticket
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AttachFiles'],
          },
          // {
          //   id: 'YOUR_SUPPORT_ROLE_ID_FROM_DB', // Support staff role
          //   allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          // },
        ],
      });

      // TODO: Save the new ticket to the database, linking ticketChannel.id
      await ticketChannel.send(`## New Ticket: ${subject}\n**Opened by:** ${interaction.user}\nPlease describe your issue in detail. A staff member will be with you shortly.`);
      await interaction.reply({ content: `Your ticket has been created: ${ticketChannel}`, ephemeral: true });

    } catch (error) {
      console.error("Failed to create ticket channel:", error);
      await interaction.reply({ content: 'Sorry, I was unable to create a ticket for you at this time.', ephemeral: true });
    }
  },
};
