import React, {useState} from 'react'
import axios from 'axios'

const PostCreate = () => {
  const [title, setTitle] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    await axios.post('http://localhost:4000/posts', {
      title
    })
    setTitle('') // 提交完成后清空
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)}  />
        </div>
        <button className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  )
}

export default PostCreate