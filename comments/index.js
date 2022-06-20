import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { randomBytes } from 'crypto'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}

// 根据postId获取所有评论
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

// 根据postId创建一个评论
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex') // 随机产生一个commentId
  const { content } = req.body 
  const comments = commentsByPostId[req.params.id] || []
  comments.push({ id: commentId, content: content, status: 'pending' })
  commentsByPostId[req.params.id] = comments

  // 向事件总线发出CommentCreated事件
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id, // 从请求参数种获取postId
      status: 'pending'
    }
  })

  res.status(201).send(comments)
})


app.post('/events', async (req, res) => {
  console.log('Received event', req.body.type)

  const {type, data} = req.body

  if(type === 'CommentModerated') {
    const { postId, id, status, content } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find(comment => {
      return comment.id === id
    })
    comment.status = status

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

  res.send({})
})

app.listen(4001, () => {
  console.log('Comments service is listening on http://localhost:4001')
})