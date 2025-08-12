import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import jobsReducer from "./jobsSlice";
import jobApplicationReducer from "./applicationsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    jobs: jobsReducer,
    jobApplications: jobApplicationReducer
  },
});
