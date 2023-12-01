//required files to pass data to openai and to server
const express = require("express")
const cors = require('cors');
require("dotenv").config()
const OpenAI = require('openai').default;

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

//post request to server
app.post('/calendar', async (req, res) => {
    const userInput = req.body.text;
    //get gpt response
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
            role: "assistant",
            content: `Extract the event details from the user's input. Begin by identifying the action the user wants to perform from the list: "add, delete, change", then get the events name. Then, determine the event's date based on today's date which is ${formattedDate}, formatted as "month/day/year". If the user wants this event to be repeated, add the additional dates underneath the eventDate. If no event time is specified, default to "All Day". Finally present the information as follows with the value of each item inside parentheses:

            Desired Format:
            eventAction: ()
            eventName: ()
            eventDate: ()
            eventTime: ()
            User Input: ${userInput}`
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
    

    //console.log(formattedDate)
    
    
    const chatMessage  = gptResponse.choices[0].message.content;
    //output the gpt response
    //pull the specific data from the response
    console.log(chatMessage)
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(chatMessage);
    var eventAction = matches[1];
    var eventName = matches[2];
    var eventDate = matches[3];
    var eventTime = matches[4]

    //console.log(content)

    /*let action;
    if(content.includes('add')){
        action = 'add';
    } else if(content.includes('remove')){
        action = 'remove'
    } else{
        action = 'unknown'
    }*/

   // res.json({ action: action, content: content });
//pass the response back to the server
res.json({content: eventAction, content: eventDate, content: eventTime, content: eventName})
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

