import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts, reset } from '../../redux/posts/postSlice'
import './MainPage.scss'
import { Link } from 'react-router-dom'

const MainPage = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getAllPosts())
      await dispatch(reset())
    }
    fetchPosts()
  }, [dispatch])
  const { posts, isLoading } = useSelector((state) => state.posts)
  return (
    <>
      <h1>Main</h1>
      {isLoading ? 'Cargando...' :
        <div className='posts'>
          {posts && posts.map((post, index) => (
            <div className='__post' key={index}>

              <h2>{post.name}</h2>
              <p>{post.content}</p>
              <Link to={`id/${post._id}`}>
              click</Link>
            </div>
          ))}

        </div>}
    </>
  )
}

export default MainPage