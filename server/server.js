import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import CORS package
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const bot = new Telegraf('7094725314:AAHF_GF-hisXhDbrpYEre9DW0gOYXp9ZJA4');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors()); // Enable CORS for all routes

// Routes and bot integration as previously defined...

let lastMessage = null;

bot.on('text', (ctx) => {
    lastMessage = {
        sender: 'Telegram User',
        message: ctx.message.text
    };
});

bot.launch();

app.post('/api/send', (req, res) => {
    const { message } = req.body;
    // Replace 'YOUR_CHAT_ID' with the actual chat ID
    bot.telegram.sendMessage('5949702687', message); 
    res.sendStatus(200);
});

app.get('/api/messages', (req, res) => {
    res.json(lastMessage);
    lastMessage = null; // Resetting lastMessage after it's been sent
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
