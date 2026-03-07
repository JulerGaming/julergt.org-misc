const express = require('express');
const { twiml: { VoiceResponse } } = require("twilio");
const app = express();
const path = require('path');
const port = 3000;
const twilio = require("twilio");
const cron = require("node-cron");
require('dotenv').config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const fromNumber = process.env.FROM_NUMBER; // your Twilio number
const toNumber = process.env.TO_NUMBER;   // your phone

function callMe() {
    client.calls.create({
        url: "https://misc.julergt.org/call", // plays the recording
        to: toNumber,
        from: fromNumber
    })
    .then(call => console.log("Calling you:", call.sid))
    .catch(err => console.error(err));
}

app.use('/nonapi', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: '400',
        message: 'Cannot GET /'
    }));
});

app.get('/flagged', (req, res) => {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'not implemented yet, please check back later'
    }));
});

app.post('/', (req, res) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: '400',
        message: 'Cannot POST /'
    }));
});

app.post("/call", (req, res) => {
    const response = new VoiceResponse();

    // play recording
    response.play("https://misc.julergt.org/nonapi/call-error.mp3");

    // hang up after audio
    response.hangup();

    res.type("text/xml");
    res.send(response.toString());
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});