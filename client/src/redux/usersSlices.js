// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/index"; // Adjust the import path as necessary
import {jwtDecode} from "jwt-decode";


// LOGIN thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, navigate }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      const { accessToken } = res.data;

      console.log('access token', accessToken)
      // Save token to localStorage
      localStorage.setItem("token", accessToken);

      // Decode the token to get the role
      const decoded = jwtDecode(accessToken);
      const role = decoded.role; // adjust if token payload uses another key

      // Redirect based on role
      if (role === "applicant") {
        navigate("/jobs");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/"); // fallback
      }

      return {token: accessToken, decoded}; 
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// SIGNUP thunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      return response.data; // { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log('Login successful, token:', action.payload);
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
