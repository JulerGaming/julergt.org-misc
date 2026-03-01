const express = require('express');
const path = require('node:path');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send(path.join(__dirname, 'public'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});
