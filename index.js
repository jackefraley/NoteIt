//required files to pass data to openai and to server
const express = require("express")
const cors = require('cors');
require("dotenv").config()
const OpenAI = require('openai').default;
const moment = require('moment');
let today = moment();

//get openai key from .env file
//leave .env in .gitignore, DO NOT PUSH TO GITHUB
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
  });

const app = express()
app.use(cors());
app.use(express.static('public'));
app.use(express.json())

//get todays date
let currentDate = new Date();
let formattedDate = `${currentDate.getMonth() +1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
let dayOfMonth = currentDate.getDate()
let dayOfWeek = currentDate.getDay()
let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let monthNames = currentDate.toLocaleString('default', { month: 'long' })
let thisYear = currentDate.getFullYear()
console.log(dayNames[dayOfWeek])

//post request to server
app.post('/calendar', async (req, res) => {
    const userInput = req.body.text;
    //get gpt response
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
            role: "assistant",
            content: `Extract the event details from the user's input. Begin by identifying the action the user wants to perform from the list: "add, delete, change", then get the events name. Then, determine the event's date based on today's date which is ${dayNames[dayOfWeek]}, the ${dayOfMonth} of ${monthNames}, ${thisYear} and display it in the format month/day/year. If the user wants this event to be repeated, add the additional date directly after each variable including eventTime, eventDay, eventMonth, and eventYear outputted as a comma separated list, and tell me the number of events there are. If no event time is specified, default to "All Day". Finally present the information as follows with the value of each item inside parentheses:

            eventAction: ()
            eventName: ()
            eventMonth: ()
            eventDay: ()
            eventYear: ()
            eventTime: ()
            numberOfEvents: ()
            User Input: ${userInput}
            DO NOT OUTPUT ANYTHING BUT THE FORMAT GIVEN`
        }],
        //gpt response variables
        //max_tokens changes complexity of response, higher costs more money
        //temperature changes randomness of answer
        max_tokens: 500,
        temperature: 0.2,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    }); 
    
    const chatMessage  = gptResponse.choices[0].message.content;
    //output the gpt response
    //pull the specific data from the response
    console.log(chatMessage)
    var regExp = /eventAction: \(([^)]+)\)\neventName: \(([^)]+)\)\neventMonth: \(([^)]+)\)\neventDay: \(([^)]+)\)\neventYear: \(([^)]+)\)\neventTime: \(([^)]+)\)\nnumberOfEvents: \(([^)]+)\)/;
    var matches = regExp.exec(chatMessage);
    var eventAction = matches[1];
    var eventName = matches[2];
    var eventMonth = matches[3];
    var eventDay = matches[4];
    var eventYear = matches[5];
    var eventTime = matches[6];
    var numberOfEvents = matches[7];

res.json({
    action: eventAction, 
    month: eventMonth, 
    day: eventDay,
    year: eventYear,
    time: eventTime, 
    name: eventName,
    numOfEvents: numberOfEvents
})
});

//information needed to run the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {console.log(`Server listening on port ${port}`)});

process.on('SIGINT', () => {
    console.log('Process terminated. Shutting down server...');
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0);
    });
});