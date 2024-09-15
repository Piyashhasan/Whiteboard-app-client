import { configureStore } from "@reduxjs/toolkit";
import drawingsSlice from "../features/drawings/drawingsSlice";
import { appApi } from "../services/appApi";

// --- create store ---
export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    drawings: drawingsSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});
