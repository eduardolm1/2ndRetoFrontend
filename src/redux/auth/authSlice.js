import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'
import { likePost, dislikePost } from '../posts/postSlice'

const userStorage = JSON.parse(localStorage.getItem('user'))
const tokenStorage = JSON.parse(localStorage.getItem('token'))

const initialState = {
  user: userStorage ? userStorage : null,
  token: tokenStorage ? tokenStorage : null,
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

export const register = createAsyncThunk('auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  })

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const getInfo = createAsyncThunk("auth/getInfo", async (id, thunkAPI) => {
  try {
    return await authService.getInfo(id)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const getUsers = createAsyncThunk("auth/getUsers", async (_, thunkAPI) => {
  try {
    return await authService.getUsers()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const updateUser = createAsyncThunk("auth/updateUser", async (userData, thunkAPI) => {
  try {
    return await authService.updateUser(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer para actualizar posts manualmente si es necesario
    updateUserPost: (state, action) => {
      const updatedPost = action.payload;
      if (state.userInfo && state.userInfo.posts) {
        state.userInfo.posts = state.userInfo.posts.map(p => 
          p._id === updatedPost._id ? updatedPost : p
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.userInfo = null;
      })
      .addCase(getInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(getInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userInfo = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        if (state.userInfo && state.userInfo.posts) {
          state.userInfo.posts = state.userInfo.posts.map(p => 
            p._id === updatedPost._id ? updatedPost : p
          );
        }
      })
      .addCase(dislikePost.fulfilled, (state, action) => {
        const updatedPost = action.payload?.post ?? action.payload;
        if (state.userInfo && state.userInfo.posts) {
          state.userInfo.posts = state.userInfo.posts.map(p => 
            p._id === updatedPost._id ? updatedPost : p
          );
        }
      });
  },
});

export const { updateUserPost } = authSlice.actions;
export default authSlice.reducer;