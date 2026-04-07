import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import { materialsApi } from './api/materialsApi';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [materialsApi.reducerPath]: materialsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(materialsApi.middleware),
});
