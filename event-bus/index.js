import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const events = []

app.post('/events', (req, res) => {
  const event = req.body

  events.push(event); // 将事件存储起来

  // 转发事件
  axios.post('http://localhost:4000/events', event) // Posts服务
  axios.post('http://localhost:4001/events', event) // Comments服务
  axios.post('http://localhost:4002/events', event) // Query服务
  axios.post('http://localhost:4003/events', event) // Moderation服务

  res.send({status: 'OK'})
})

app.get('/events', (req, res) => {
  res.send(events)
})

app.listen(4005, () => {
  console.log('Event bus is listening on http://localhost:4005')
})