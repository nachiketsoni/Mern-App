import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../AxiosConfig/axios";

const initialState = {
   
};

export const userSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        
    },
});

// Action creators are generated for each case reducer function
export const {  } = userSlice.actions;

export const loginAsync = (dets) => async (dispatch, getState) => {
    
};


export default userSlice.reducer;