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
app.use(express.static('public'));
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

// post request to server
app.post('/calendar', async (req, res) => {
    try {
        const userInput = req.body.text;

        // get gpt response
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "assistant",
                content: `Extract event details from the user's input. Start by identifying the action the user wants to perform, choosing from "add", "delete", or "change". Then, determine the event's name, date, and time based on the context provided. Use the current date, which is ${dayNames[dayOfWeek]}, the ${dayOfMonth} of ${monthNames}, ${thisYear}, as a reference point, and format dates as month/day/year. If no event time is specified, default to "All Day". 

                If the user mentions recurring or multiple events, infer the dates and list each event separately. For a "change" action, list two events: one with the action "delete" for the old event and another with the action "add" for the new event. 
                
                Output the details in the following format:
                eventAction: ()
                eventName: ()
                eventMonth: ()
                eventDay: ()
                eventYear: ()
                eventTime: ()
                
                For instance, the input "I have a meeting every Tuesday in December at 10 AM" should be formatted as:
                eventAction: (add, add, add, add)
                eventName: (meeting, meeting, meeting, meeting)
                eventMonth: (12, 12, 12, 12)
                eventDay: (6, 13, 20, 27)
                eventYear: (2023, 2023, 2023, 2023)
                eventTime: (10 AM, 10 AM, 10 AM, 10 AM)
                
                User Input: ${userInput}
                
                Note: Adapt the response to fit the user's input, handling single, multiple, and recurring events. Always use the specified format for the output.`
            }],
            max_tokens: 500,
            temperature: 0.0,
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
        res.status(500).json({
            errorMessage: error.message,
            chatMessage: req.body.text // Send back the original chat message
        });
    }
});

// information needed to run the server
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