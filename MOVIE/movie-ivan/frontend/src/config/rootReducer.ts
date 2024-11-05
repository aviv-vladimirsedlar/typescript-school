import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/auth.slice';
import movieReducer from './slices/movie.slice';
import userReducer from './slices/user.slice';

const persistConfig = {
  key: 'root', // Key to store the state in storage
  storage, // Type of storage, e.g., localStorage for web
  whitelist: ['auth', 'user'], // Reducers you want to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
