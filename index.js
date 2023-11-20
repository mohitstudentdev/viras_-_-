const TelegramBot = require('node-telegram-bot-api');
const backtogrup = 'https://telegram.me/movie_hoster_gruop'
const keep_alive = require('./keep_alive.js');

// Replace 'YOUR_BOT_TOKEN' with the actual token obtained from the BotFather
const TOKEN = '6791062459:AAGOsFzU0YcdEtagUTIBoU0_JNoiJhbNX_w';


// Create a new bot
const bot = new TelegramBot(TOKEN, {polling: true});

// Define a dictionary to store video codes
const videoCodes = {};

// Function to generate a unique random code
function generateUniqueCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;

    // Keep generating until a unique code is found
    do {
        code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
    } while (videoCodes[code]);

    videoCodes[code] = true;
    return code;
}

// Define the start command handler
bot.onText(/\/start/, (msg) => {
    // bot.sendMessage(msg.chat.id, 'Welcome to the Movie Hoster Bot');
    bot.sendMessage(msg.chat.id, `Go to gruop for download movie \n ${backtogrup}`)
});

// Define the video handler
bot.on('video', (msg) => {
    // Get the video file ID
    const videoFileId = msg.video.file_id;

    // Generate a unique random code for the video
    const code = generateUniqueCode(25); // Adjust the length as needed

    // Create an invite link with the encoded code
    const inviteLink = `https://telegram.me/movie_hoster_bot?start=${code}`;

    // Store the video file ID in the dictionary
    videoCodes[code] = videoFileId;

    // Send the invite link to the user
    bot.sendMessage(msg.chat.id, `Here is your invite link:\n ${inviteLink}`);
});

// Define the start code handler
bot.onText(/\/start (.+)/, (msg, match) => {
    // Get the code from the start command
    const code = match[1];

    // Get the corresponding video file ID from the dictionary
    const videoFileId = videoCodes[code];

    // Check if the code is valid
    if (videoFileId) {
        // Send the video to the user
        bot.sendVideo(msg.chat.id, videoFileId, {caption: 'Enjoy\'s your Movie'});
    } else {
        bot.sendMessage(msg.chat.id, 'Invalid code. Please try again.');
    }
});

