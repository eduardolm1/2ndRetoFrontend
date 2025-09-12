import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    isLoading: false,
    post: {}
}

export const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.post = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.post = action.payload;
                state.posts.unshift(action.payload);
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const updatedPost = action.payload;
                state.posts = state.posts.map((p) =>
                    p._id === updatedPost._id ? updatedPost : p
                );
                if (state.post && state.post._id === updatedPost._id) {
                    state.post = updatedPost;
                }
            })
            .addCase(dislikePost.fulfilled, (state, action) => {
                const updatedPost = action.payload?.post ?? action.payload;
                state.posts = state.posts.map((p) =>
                    p._id === updatedPost._id ? updatedPost : p
                );
                if (state.post && state.post._id === updatedPost._id) {
                    state.post = updatedPost;
                }
            })
    },
});

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {

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

export const createPost = createAsyncThunk("posts/createPost", async () => {
    try {
        return await postService.createPost()
    } catch (error) {
        console.error(error)
    }
})

export const likePost = createAsyncThunk("posts/likePost", async (id) => {
    try {
        return await postService.likePost(id)
    } catch (error) {
        console.error(error)
    }
})

export const dislikePost = createAsyncThunk("posts/dislikePost", async (id) => {
    try {
        return await postService.dislikePost(id)
    } catch (error) {
        console.error(error)
    }
})

export const { reset } = postSlice.actions
export default postSlice.reducer