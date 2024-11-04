import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Movie } from '../../common/types/movie.types';
import { Pagination } from '../../common/types/pagination.types';

interface MovieState {
  data: Movie[];
  meta?: Pagination;
}

const initialState: MovieState = {
  data: [],
  meta: undefined,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    updateMovieList(state, action: PayloadAction<MovieState>) {
      state.data = action.payload.data;
      state.meta = action.payload.meta;
    },
  },
});

export const { updateMovieList } = movieSlice.actions;
export default movieSlice.reducer;
