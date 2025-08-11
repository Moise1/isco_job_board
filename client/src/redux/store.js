import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import jobsReducer from "./jobsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    jobs: jobsReducer,
  },
});
