import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlices.js";

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});
