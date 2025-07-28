import { configureStore } from '@reduxjs/toolkit'
import auth from '../redux/auth/authSlice'
import posts from '../redux/posts/postSlice'

export const store = configureStore({
 reducer: { auth, posts}
})
