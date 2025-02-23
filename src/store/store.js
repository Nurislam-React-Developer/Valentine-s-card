import { configureStore } from '@reduxjs/toolkit';
import requestSlice from './requestReducer';

export const store = configureStore({
  reducer: {
    [requestSlice.name]: requestSlice.reducer
  }
})