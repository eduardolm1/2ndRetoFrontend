import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    isLoading: false,
    post: {}
}

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllPosts.fulfilled, (state, action) => {
            state.posts = action.payload;
        }).addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
        }).addCase(getPostById.fulfilled, (state, action) => {
            state.post = action.payload
        })


    },

})

export const getAllPosts = createAsyncThunk('post/getAllPosts', async (user) => {

    try {
        return await postService.getAllPosts()
    } catch (error) {
        console.error(error)
    }
})

export const getPostById = createAsyncThunk("posts/getById", async (id) => {
    try {
        return await postService.getPostById(id)
    } catch (error) {
        console.error(error)
    }
})


export const { reset } = postSlice.actions
export default postSlice.reducer