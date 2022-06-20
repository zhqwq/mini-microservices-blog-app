import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { randomBytes } from 'crypto'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

// 将posts保存在内存中
const posts = {}

// 获取posts
app.get('/posts', (req, res) => {
  res.send(posts)
})

// 创建一个post
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body
  posts[id] = {
    id,
    title
  }

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  })

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type)
  res.send({})
})

app.listen(4000, () => {
  console.log('Posts service is listening on http://localhost:4000')
})

