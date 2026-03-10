const express = require('express');
const { twiml: { VoiceResponse } } = require("twilio");
const app = express();
const path = require('path');
const port = 3000;
const twilio = require("twilio");
const cors = require("cors")
const cron = require("node-cron");
require('dotenv').config();

app.use(express.json());
app.use(cors());

const titleid = process.env.TITLEID;

app.options("/moderate", async (req, res) => {
    const playfab_secret_key = req.headers["X-SecretKey"];
    const { unique_identifier, labels, action_type, moderator_id } = req.body;

    // Validate input
    if (!playfab_secret_key || !unique_identifier || !action_type) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    if (unique_identifier == "test-device-id") {
        return res.status(200).json({ message: "Success" });
    }

    try {
        // Call PlayFab CloudScript with the provided Secret Key
        const response = await axios.post(
            `https://${titleid}.playfabapi.com/Server/ExecuteCloudScript`,
            {
                FunctionName: "voicePatrolModeration",
                FunctionParameter: {
                    unique_identifier,
                    labels,
                    action_type,
                    moderator_id
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-SecretKey": playfab_secret_key
                }
            }
        );

        res.json({ success: true, playfab: response.data });

    } catch (err) {
        console.error("Moderation error:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: "Moderation failed" });
    }
});

app.post("/moderate", async (req, res) => {
    return res.status(200).json({ message: "wtf is ts" })
})

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

app.get('/calljulergt', (req, res) => {
    callMe();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Calling you now...'
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