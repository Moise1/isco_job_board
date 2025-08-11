import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
  jobs: [],
  filteredJobs: [],
  loading: false,
  error: null,
  filters: {
    title: "",
    location: "",
    salaryMin: null,
    salaryMax: null,
  },
};

// Fetch jobs from API
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/jobs"); // Axios instance automatically adds token
      return res.data; // should be an array of jobs
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setTitleFilter: (state, action) => {
      state.filters.title = action.payload;
      jobsSlice.caseReducers.applyFilters(state);
    },
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
      jobsSlice.caseReducers.applyFilters(state);
    },
    setSalaryRange: (state, action) => {
      state.filters.salaryMin = action.payload.min;
      state.filters.salaryMax = action.payload.max;
      jobsSlice.caseReducers.applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = {
        title: "",
        location: "",
        salaryMin: null,
        salaryMax: null,
      };
      state.filteredJobs = state.jobs;
    },
    applyFilters: (state) => {
      state.filteredJobs = state.jobs.filter((job) => {
        const jobTitle = job.title || "";
        const jobLocation = job.location || "";
        const filterTitle = state.filters.title || "";
        const filterLocation = state.filters.location || "";

        const matchesTitle = filterTitle
          ? jobTitle.toLowerCase().includes(filterTitle.toLowerCase())
          : true;

        const matchesLocation = filterLocation
          ? jobLocation.toLowerCase().includes(filterLocation.toLowerCase())
          : true;

        const matchesSalary =
          (state.filters.salaryMin === null ||
            job.max_salary >= state.filters.salaryMin) &&
          (state.filters.salaryMax === null ||
            job.min_salary <= state.filters.salaryMax);

        return matchesTitle && matchesLocation && matchesSalary;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.filteredJobs = action.payload; // no filter applied initially
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTitleFilter,
  setLocationFilter,
  setSalaryRange,
  clearFilters,
  applyFilters,
} = jobsSlice.actions;

export default jobsSlice.reducer;
