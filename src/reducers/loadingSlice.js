import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
};

export const LoadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        onLoading: (state) => {
            state.isLoading = true;
        },
        offLoading: (state) => {
            state.isLoading = false;
        },
    },
});

export const { onLoading, offLoading } = LoadingSlice.actions;

export default LoadingSlice.reducer;
