import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../../redux/posts/postSlice'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const CreatePostPage = () => {
  const [content, setContent] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.posts)

  const onSubmit = (e) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error("Escribe algo antes de publicar")
      return
    }

    dispatch(createPost({ content }))
      .unwrap()
      .then(() => {
        toast.success("¡Publicación creada!")
        setTimeout(() => navigate("/"), 1000)
      })
      .catch(() => {
        toast.error("Error al crear la publicación")
      })
  }

  return (
    <div className="createPostPage">
      <form onSubmit={onSubmit} className="formRegister">
        <h2>Crear publicación</h2>
        
        <textarea
          className="textarea-post"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando, usuario?"
          rows="5"
          required
        />

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Publicando..." : "Publicar"}
        </button>

        <p className="redirect-text">
          <span onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            ← Volver atrás
          </span>
        </p>
      </form>
      <Toaster />
    </div>
  )
}

export default CreatePostPage
