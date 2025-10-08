import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slices/settingsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
