const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(JSON.stringify({
        status: '400',
        message: 'Cannot GET /'
    }));
});

app.post('/', (req, res) => {
    res.send(JSON.stringify({
        status: '400',
        message: 'Cannot POST /'
    }));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});