const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendDataToGoogleSheet } = require('./googleapi');
const settings = require('../config/settings.json');
const app = express();

const port = settings.port || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.post('/submitResults', async (req, res) => {
    const { name, phone, specialization } = req.body;

    try {
        const response = await sendDataToGoogleSheet(name, phone, specialization);
        res.json(response);
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ message: 'Произошла ошибка' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен!`);
});