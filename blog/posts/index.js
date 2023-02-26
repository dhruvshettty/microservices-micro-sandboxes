const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {    
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = Math.floor(Math.random() * 10000);
    const { title } = req.body;
    posts[id] = { id, title };

    // Send event to event bus
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: { id, title }
    });

    res.status(201).send(posts[id]);
});

// Receive events from event bus and acknowledge to event bus
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});
