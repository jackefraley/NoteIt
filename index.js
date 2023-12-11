const express = require("express");
const cors = require('cors');
require("dotenv").config();
const OpenAI = require('openai').default;
const moment = require('moment');
let today = moment();

// get openai key from .env file
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

// get today's date
let currentDate = new Date();
let formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
let dayOfMonth = currentDate.getDate();
let dayOfWeek = currentDate.getDay();
let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let monthNames = currentDate.toLocaleString('default', { month: 'long' });
let thisYear = currentDate.getFullYear();
console.log(dayNames[dayOfWeek]);

app.use(express.json());
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use(express.static('public'));
let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/calendar', async (req, res) => {
    try {
        const userInput = req.body.text;

        // get gpt response
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "assistant",
                content: `Extract event details from the user's input. Start by identifying the action the user wants to perform, choosing from add, delete, or change. Then, determine the event's name, date, and time based on the context provided Always give numbers without a zero in front. Always plan events in the future unless the date is specified. Use the current date, which is ${dayNames[dayOfWeek]}, the ${dayOfMonth} of ${monthNames}, ${thisYear}, as a reference point, and format dates as month/day/year. If no event time is specified, default to All Day. 

                If the user mentions recurring or multiple events, or the event falls on multiple days, list each events action, name, dates, and time as a comma separated list inside the parentheses for all the events the user wants to add. For a "change" action, list two events: one with the action "delete" for the old event and another with the action "add" for the new event. 
                
                Output the details in the following format:
                eventAction: ()
                eventName: ()
                eventMonth: ()
                eventDay: ()
                eventYear: ()
                eventTime: ()
                
                User Input: ${userInput}
                
                Note: Always use the specified format for the output and dont deviate from the users requests.`
            }],
            max_tokens: 500,
            temperature: 0.2,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const chatMessage = gptResponse.choices[0].message.content;
        console.log(chatMessage);

        var regExp = /eventAction: \(([^)]+)\)\neventName: \(([^)]+)\)\neventMonth: \(([^)]+)\)\neventDay: \(([^)]+)\)\neventYear: \(([^)]+)\)\neventTime: \(([^)]+)\)/;
        var matches = regExp.exec(chatMessage);

        if (matches) {
            var eventAction = matches[1];
            var eventName = matches[2];
            var eventMonth = matches[3];
            var eventDay = matches[4];
            var eventYear = matches[5];
            var eventTime = matches[6];

            res.json({
                action: eventAction,
                month: eventMonth,
                day: eventDay,
                year: eventYear,
                time: eventTime,
                name: eventName,
            });
        } else {
            throw new Error("Failed to parse GPT response");
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({
            errorMessage: error.message,
            chatMessage: req.body.text // Send back the original chat message
        });
    }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

process.on('SIGINT', () => {
    console.log('Process terminated. Shutting down server...');
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0);
    });
});