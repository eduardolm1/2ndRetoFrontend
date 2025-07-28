import  { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPostById } from '../../redux/posts/postSlice'

const PostDetail = () => {

    const { post } = useSelector((state) => state.posts)
    const { id } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPostById(id))
    }, [])

    return (
        <>
            <h1>{post.name}</h1>
            <p>{post.content}</p>
        </>
    )
}

export default PostDetail