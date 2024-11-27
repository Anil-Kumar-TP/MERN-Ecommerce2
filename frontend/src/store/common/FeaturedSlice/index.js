import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    featuredImageList:[],
}

export const getFeaturedImages = createAsyncThunk('/featured/getFeaturedImages', async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/common/feature/get`);
    return response.data;
})


export const addFeaturedImages = createAsyncThunk('/featured/addFeaturedImages', async (image) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/common/feature/add`, { image });
    return response.data;
})

const commonSlice = createSlice({
    name: 'commonSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFeaturedImages.pending, (state) => {
            state.isLoading = true;
        }).addCase(getFeaturedImages.fulfilled, (state, action) => {
            state.isLoading = false;
            state.featuredImageList = action.payload.data;
        }).addCase(getFeaturedImages.rejected, (state) => {
            state.isLoading = false;
            state.featuredImageList = [];
        })
    }
})

export default commonSlice.reducer;