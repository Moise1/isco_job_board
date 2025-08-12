import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';


// Async thunk to submit job application
export const submitJobApplication = createAsyncThunk(
  'jobApplication/submit',
  async ({job_id, cover_letter, cv_link }, { rejectWithValue }) => {
      try {
        
            const token = localStorage.getItem("token");

            const response = await api.post(
            "/applications",
              {
              job_id,
              cover_letter,
              cv_link,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      return response.data?.message;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to submit application');
    }
  }
);


export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/applications/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch applications"
      );
    }
  }
);

const jobApplicationSlice = createSlice({
  name: "jobApplication",
  initialState: {
    loading: false,
    error: null,
    success: false,
    message: null,
    data: [],
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    clearApplications: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitJobApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload;
      })
      .addCase(submitJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
        state.message = null;
      })
      
      // Fetch applications

      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearApplications } = jobApplicationSlice.actions;
export default jobApplicationSlice.reducer;
