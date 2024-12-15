import { combineReducers, configureStore } from '@reduxjs/toolkit';
import LoadingSlice from '../reducers/loadingSlice.js';

const reducer = combineReducers({
    loading: LoadingSlice,
});

export const store = configureStore({
    reducer,
});
