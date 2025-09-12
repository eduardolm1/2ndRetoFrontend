import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import followService from "./followService";

const initialState = {
  following: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (id, thunkAPI) => {
    try {
      const res = await followService.followUser(id);
      return { userId: id, message: res.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (id, thunkAPI) => {
    try {
      const res = await followService.unfollowUser(id);
      return { userId: id, message: res.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newUserId = action.payload.userId;
        if (!state.following.includes(newUserId)) {
          state.following.push(newUserId);
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const removedId = action.payload.userId;
        state.following = state.following.filter((id) => id !== removedId);
      });
  },
});

export const { reset } = followSlice.actions;
export default followSlice.reducer;
