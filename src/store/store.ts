import { configureStore } from "@reduxjs/toolkit";
import { amocrmApi } from "./api";
import { setupListeners } from "@reduxjs/toolkit/query";
import viewReducer from "./viewReducer";

export const store = configureStore({
  reducer: {
    view: viewReducer,
    [amocrmApi.reducerPath]: amocrmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(amocrmApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
