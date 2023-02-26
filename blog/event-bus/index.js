// Custom event bus using express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    // Simple event bus using Express
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err);
    });  // posts service
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err);
    });  // comments service
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err);
    });  // query service

    res.send({ status: 'OK' });
})

app.listen(4005, () => {
    console.log('Listening on port 4005');
});