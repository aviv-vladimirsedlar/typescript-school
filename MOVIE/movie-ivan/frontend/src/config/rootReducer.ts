import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth.slice';
import movieReducer from './slices/movie.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
