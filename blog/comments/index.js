const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    // Send event to event bus
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: { 
            id: commentId, 
            content, 
            postId: req.params.id ,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

// Receive events from event bus and acknowledge to event bus
app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    console.log('Received Event', type);

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        commentsByPostId[postId].find((comment) => comment.id === id).status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }

    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
});