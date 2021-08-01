import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { socketMiddleware } from "util/channel";
import { rootReducer } from "util/rootReducer";

const isDev = process.env.NODE_ENV === "development";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = [socketMiddleware, ...getDefaultMiddleware()];
    if (isDev) middlewares.push(logger);
    return middlewares;
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
