const express = require('express');

const app = express();

const posts = {};

app.get('/posts', (req, res) => {    
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = Math.floor(Math.random() * 10000);
    const title = req.body;
    posts[id] = {title};

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});