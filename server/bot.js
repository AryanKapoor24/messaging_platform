const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf('7094725314:AAHF_GF-hisXhDbrpYEre9DW0gOYXp9ZJA4');

bot.start((ctx) => ctx.reply('Welcome!'));
bot.on('text', (ctx) => ctx.reply(`You said: hi there`));

bot.launch();
console.log('Bot is running...');
