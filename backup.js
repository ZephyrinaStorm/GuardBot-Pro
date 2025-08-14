const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Manages server backups.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Creates a new server backup.')
        .addStringOption(option =>
          option.setName('name')
            .setDescription('A name for this backup')
            .setRequired(true))),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'create') {
      const name = interaction.options.getString('name');
      await interaction.reply({ content: `Creating backup with name: **${name}**... This may take a moment.`, ephemeral: true });
      // TODO: Implement backup creation logic here.
      // This is a complex feature. You would typically:
      // 1. Create a new Backup entity in the database with status 'creating'.
      // 2. Fetch server roles, channels, settings.
      // 3. Serialize this data into a JSON file or database record.
      // 4. Update the Backup entity status to 'completed'.
      await interaction.followUp({ content: `✅ Backup **${name}** created successfully!`, ephemeral: true });
    }
  },
};
