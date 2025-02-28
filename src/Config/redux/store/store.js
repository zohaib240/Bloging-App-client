import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducer/userSlice';
import allblogsReducer from "../reducer/allblogsSlice";

export const store = configureStore({
  reducer: {
    blogs: allblogsReducer,
    user: userReducer,
  },
});


