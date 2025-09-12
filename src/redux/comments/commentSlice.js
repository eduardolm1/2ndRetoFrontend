import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentService";
import postService from "../posts/postService";


const initialState = {
    comments: [],
    isLoading: false,
    comment: {}
}

export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createComment.fulfilled, (state, action) => {
                if (action.payload && action.payload.comment) {
                    state.comments = [...state.comments, action.payload.comment];
                }
            })
            .addCase(getPostComments.fulfilled, (state, action) => {
                state.comments = action.payload;
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                const updatedComment = action.payload;
                state.comments = state.comments.map((comment) =>
                    comment._id === updatedComment._id ? updatedComment : comment
                );
            })
            .addCase(dislikeComment.fulfilled, (state, action) => {
                const updatedComment = action.payload;
                state.comments = state.comments.map((comment) =>
                    comment._id === updatedComment._id ? updatedComment : comment
                );
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                const updatedComment = action.payload.comment;
                state.comments = state.comments.map((comment) =>
                    comment._id === updatedComment._id ? updatedComment : comment
                );
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const deletedId = action.meta.arg.id;
                state.comments = state.comments.filter((c) => c._id !== deletedId);
            });
    }

})

export const getPostComments = createAsyncThunk('comments/id', async (id) => {
    try {
        return await commentService.getPostComments(id)
    } catch (error) {
        console.error(error)
    }
})

export const createComment = createAsyncThunk(
    'comments/create',
    async ({ text, id }) => {
        try {
            return await commentService.createComment({ text, id });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const updateComment = createAsyncThunk('comments/update', async (id) => {
    try {
        return await commentService.updateComment(id)
    } catch (error) {
        console.error(error)
    }
})

export const deleteComment = createAsyncThunk('comments/delete', async (id) => {
    try {
        return await commentService.deleteComment(id)
    } catch (error) {
        console.error(error)
    }
})

export const likeComment = createAsyncThunk('comments/like', async (id) => {
    try {
        return await commentService.likeComment(id)
    } catch (error) {
        console.error(error)

    }
})

export const dislikeComment = createAsyncThunk('comments/dislike', async (id) => {
    try {
        return await commentService.dislikeComment(id)
    } catch (error) {
        console.error(error)
    }
})

export const { reset } = commentSlice.actions

export default commentSlice.reducer