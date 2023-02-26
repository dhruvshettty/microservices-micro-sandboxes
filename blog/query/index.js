const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
     const { type, data } = req.body;

     console.log('Received Event', type);

    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        posts[postId].comments.push({ id, content });
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on port 4002');
});