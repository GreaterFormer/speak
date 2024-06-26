import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "types";

const initialState: UserInfo = {
    id: '',
    publicAddress: '',
    correspondingAddress: '',
    isAdmin: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.id = action.payload.id;
            state.publicAddress = action.payload.publicAddress
            state.correspondingAddress = action.payload.correspondingAddress
            state.isAdmin = action.payload.isAdmin
        }
    }
});

export default userSlice.reducer;
export const { setUserInfo } = userSlice.actions;