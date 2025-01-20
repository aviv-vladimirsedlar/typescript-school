import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/users/user.slice";

const persistConfig = {
  key: "root", // Key to store the state in storage
  storage, // Type of storage, e.g., localStorage for web
  whitelist: ["auth", "user"], // Reducers you want to persist
};

const rootReducer = combineReducers({
  auth: authReducer,

  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore paths in the state
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
