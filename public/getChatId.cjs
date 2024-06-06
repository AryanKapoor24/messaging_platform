const { Telegraf } = require('telegraf');
require('dotenv').config();

// Debugging: Check if the bot token is being read correctly
console.log('Bot Token:', '7094725314:AAHF_GF-hisXhDbrpYEre9DW0gOYXp9ZJA4');

const bot = new Telegraf('7094725314:AAHF_GF-hisXhDbrpYEre9DW0gOYXp9ZJA4');

bot.on('text', (ctx) => {
    console.log('Chat ID:', ctx.chat.id);
    ctx.reply(`Your chat ID is: ${ctx.chat.id}`);
});

bot.launch();
console.log('Send a message to your bot to get the chat ID.');
