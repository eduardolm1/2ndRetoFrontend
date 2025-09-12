import { configureStore } from '@reduxjs/toolkit'
import auth from '../redux/auth/authSlice'
import posts from '../redux/posts/postSlice'
import comments from '../redux/comments/commentSlice'
import follow from '../redux/follow/followSlice'

export const store = configureStore({
    reducer: {
        auth,
        posts,
        comments,
        follow
    }
})
