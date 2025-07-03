const express = require('express');
const { StreamChat } = require('stream-chat');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = 'kt3cr78evu5y';
const apiSecret = 'kpfebwva7mvhp3wwwv8cynfgeemdrf7wkrexszr8zhz4p8nj2gnjr5jy4tadsamb';

const chatClient = StreamChat.getInstance(apiKey, apiSecret);

app.post('/stream/token', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const token = chatClient.createToken(userId);
  res.json({ token });
});

app.listen(5001, () => console.log('Stream token server running on port 5001')); 