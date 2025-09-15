import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    isLoading: false,
    post: {},
    error: null
}

export const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.posts || action.payload;
                state.error = null;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getPostById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload;
                state.error = null;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts.unshift(action.payload);
                state.error = null;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updatePost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedPost = action.payload;
                state.posts = state.posts.map((p) =>
                    p._id === updatedPost._id ? updatedPost : p
                );
                if (state.post && state.post._id === updatedPost._id) {
                    state.post = updatedPost;
                }
                state.error = null;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                const id = action.payload;
                state.posts = state.posts.filter((p) => p._id !== id);
                if (state.post && state.post._id === id) {
                    state.post = null;
                }
                state.error = null;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
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
            });
    },
});

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async (_, { rejectWithValue }) => {
    try {
        return await postService.getAllPosts();
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getPostById = createAsyncThunk("posts/getById", async (id, { rejectWithValue }) => {
    try {
        return await postService.getPostById(id);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (postData, { rejectWithValue }) => {
    try {
        return await postService.updatePost(postData);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (id, { rejectWithValue }) => {
    try {
        await postService.deletePost(id);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createPost = createAsyncThunk("posts/createPost", async (postData, { rejectWithValue }) => {
    try {
        return await postService.createPost(postData);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const likePost = createAsyncThunk("posts/likePost", async (id, { rejectWithValue }) => {
    try {
        return await postService.likePost(id);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const dislikePost = createAsyncThunk("posts/dislikePost", async (id, { rejectWithValue }) => {
    try {
        return await postService.dislikePost(id);
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const { reset, clearError } = postSlice.actions;
export default postSlice.reducer;