import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openLoginModal: false
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setOpenLoginModal: (state, action) => {
            state.openLoginModal = action.payload
        }
    }
});

export default appSlice.reducer;
export const { setOpenLoginModal } = appSlice.actions;