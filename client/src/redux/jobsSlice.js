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
    min_salary: null,
    max_salary: null,
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


// Create a new job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, thunkAPI) => {
    try {
      const res = await api.post("/jobs", jobData);
      return res.data; // return newly created job
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);
// Update/Edit job 

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/jobs/${jobId}`, jobData);
      return response.data; // Should return the updated job object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return { jobId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete job");
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
      state.filters.min_salary = action.payload.min_salary;
      state.filters.max_salary = action.payload.max_salary;
      jobsSlice.caseReducers.applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = {
        title: "",
        location: "",
        min_salary: null,
        max_salary: null,
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
          (state.filters.min_salary === null ||
            job.max_salary >= state.filters.min_salary) &&
          (state.filters.max_salary === null ||
            job.min_salary <= state.filters.max_salary);

        return matchesTitle && matchesLocation && matchesSalary;
      });
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch jobs
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
      })

      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
        state.filteredJobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.loading = false;
        state.jobs.push(action.payload);

        // Check if the new job matches current filters before adding to filteredJobs
        const newJob = action.payload;
        const jobTitle = newJob.title || "";
        const jobLocation = newJob.location || "";
        const filterTitle = state.filters.title || "";
        const filterLocation = state.filters.location || "";

        const matchesTitle = filterTitle
          ? jobTitle.toLowerCase().includes(filterTitle.toLowerCase())
          : true;

        const matchesLocation = filterLocation
          ? jobLocation.toLowerCase().includes(filterLocation.toLowerCase())
          : true;

        const matchesSalary =
          (state.filters.min_salary === null ||
            newJob.max_salary >= state.filters.min_salary) &&
          (state.filters.max_salary === null ||
            newJob.min_salary <= state.filters.max_salary);

        // Only add to filteredJobs if it matches current filters
        if (matchesTitle && matchesLocation && matchesSalary) {
          state.filteredJobs.push(action.payload);
        }
      })
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;

        // Update the job in the jobs array
        const jobIndex = state.jobs.findIndex(
          (job) => job.id === updatedJob.id
        );
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = updatedJob;
        }

        // Update the job in the filteredJobs array
        const filteredJobIndex = state.filteredJobs.findIndex(
          (job) => job.id === updatedJob.id
        );
        if (filteredJobIndex !== -1) {
          // Check if updated job still matches current filters
          const jobTitle = updatedJob.title || "";
          const jobLocation = updatedJob.location || "";
          const filterTitle = state.filters.title || "";
          const filterLocation = state.filters.location || "";

          const matchesTitle = filterTitle
            ? jobTitle.toLowerCase().includes(filterTitle.toLowerCase())
            : true;

          const matchesLocation = filterLocation
            ? jobLocation.toLowerCase().includes(filterLocation.toLowerCase())
            : true;

          const matchesSalary =
            (state.filters.min_salary === null ||
              updatedJob.max_salary >= state.filters.min_salary) &&
            (state.filters.max_salary === null ||
              updatedJob.min_salary <= state.filters.max_salary);

          const noFiltersActive =
            !filterTitle &&
            !filterLocation &&
            state.filters.min_salary === null &&
            state.filters.max_salary === null;

          if (
            noFiltersActive ||
            (matchesTitle && matchesLocation && matchesSalary)
          ) {
            // Update the job in filteredJobs
            state.filteredJobs[filteredJobIndex] = updatedJob;
          } else {
            // Remove from filteredJobs if it no longer matches filters
            state.filteredJobs.splice(filteredJobIndex, 1);
          }
        } else if (filteredJobIndex === -1) {
          // Job wasn't in filteredJobs but might need to be added now
          const jobTitle = updatedJob.title || "";
          const jobLocation = updatedJob.location || "";
          const filterTitle = state.filters.title || "";
          const filterLocation = state.filters.location || "";

          const matchesTitle = filterTitle
            ? jobTitle.toLowerCase().includes(filterTitle.toLowerCase())
            : true;

          const matchesLocation = filterLocation
            ? jobLocation.toLowerCase().includes(filterLocation.toLowerCase())
            : true;

          const matchesSalary =
            (state.filters.min_salary === null ||
              updatedJob.max_salary >= state.filters.min_salary) &&
            (state.filters.max_salary === null ||
              updatedJob.min_salary <= state.filters.max_salary);

          const noFiltersActive =
            !filterTitle &&
            !filterLocation &&
            state.filters.min_salary === null &&
            state.filters.max_salary === null;

          if (
            noFiltersActive ||
            (matchesTitle && matchesLocation && matchesSalary)
          ) {
            state.filteredJobs.push(updatedJob);
          }
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(
          (job) => job.id !== action.payload.jobId
        );

        state.filteredJobs = state.filteredJobs.filter(
          (job) => job.id !== action.payload.jobId
        );
        state.successMessage = action.payload.message;
      })
      .addCase(deleteJob.rejected, (state, action) => {
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
