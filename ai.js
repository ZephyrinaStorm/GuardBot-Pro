const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('AI-powered tools for your server.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addSubcommand(subcommand =>
      subcommand
        .setName('summarize')
        .setDescription('Summarizes the recent chat history in this channel.')
        .addIntegerOption(option =>
          option.setName('messages')
            .setDescription('Number of recent messages to summarize (max 100).')
            .setRequired(false)
            .setMinValue(10)
            .setMaxValue(100))
        .addUserOption(option =>
          option.setName('user')
            .setDescription('Summarize messages only from a specific user.')
            .setRequired(false))),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'summarize') {
      await interaction.deferReply({ ephemeral: true });

      const messageCount = interaction.options.getInteger('messages') || 50;
      const targetUser = interaction.options.getUser('user');

      try {
        let messages = await interaction.channel.messages.fetch({ limit: messageCount });
        
        if (targetUser) {
            messages = messages.filter(m => m.author.id === targetUser.id);
        }

        if (messages.size < 5) {
            return interaction.editReply('Not enough messages to create a meaningful summary.');
        }

        const chatContent = messages.reverse().map(m => `${m.author.username}: ${m.content}`).join('\n');

        // TODO: This is where you would call your AI service (e.g., OpenAI, Gemini).
        // You would pass `chatContent` to the AI with a prompt like:
        // "Please summarize the following Discord conversation. Identify key topics, decisions, and overall sentiment."
        
        // --- Placeholder AI Response ---
        const summary = `This is a placeholder summary. In a real scenario, an AI would analyze the last ${messages.size} messages. Key topics would be identified here.`;
        // -----------------------------

        const embed = {
            color: 0x3b82f6, // Blue
            title: `Chat Summary (${messages.size} messages)`,
            description: summary,
            fields: [
                { name: 'Channel', value: `${interaction.channel}`, inline: true },
                { name: 'Requested by', value: `${interaction.user}`, inline: true },
            ],
            footer: { text: 'Powered by GuardBot Pro AI' },
            timestamp: new Date().toISOString(),
        };

        if (targetUser) {
            embed.title = `Chat Summary for ${targetUser.username} (${messages.size} messages)`;
        }

        await interaction.editReply({ embeds: [embed] });

      } catch (error) {
        console.error('AI Summarize Error:', error);
        await interaction.editReply('An error occurred while trying to summarize the chat.');
      }
    }
  },
};
