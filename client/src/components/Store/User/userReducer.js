import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../AxiosConfig/axios";

const initialState = {
    user : {},
    isAuthenticatedUser : false,
    error : null
};

export const userSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticatedUser = true;
        },
        logout: (state) => {
            state.user = {};
            state.isAuthenticatedUser = false;
        },
        register: (state, action) => {
            state.user = action.payload;
            state.isAuthenticatedUser = true;
        },
        myprofile: (state, action) => {
            state.user = action.payload;
            state.isAuthenticatedUser = true;
        },
        isLoggedIn: (state, action) => {
            state.user = action.payload;
            state.isAuthenticatedUser = true;
        },
        error: (state, action) => {
            state.user = {};
            state.error = action.payload;
            state.isAuthenticatedUser = false;
        }
    },
});

// Action creators are generated for each case reducer function
export const { login , logout, register , myprofile,isLoggedIn, error  } = userSlice.actions;

export const loginAsync = (dets) => async (dispatch, getState) => {
    try {
    const {data} = await axios.post("/login", dets)
    console.log(data);
        dispatch(login(data));
    } catch (error) {
        console.log(error);
        dispatch(error(error));
    }
};
export const myProfileAsync = () => async (dispatch, getState) => {
    try {
    const {data} = await axios.get("/myprofile")
        console.log(data);
        dispatch(myprofile(data));
    } catch (error) {
        console.log(error);
        dispatch(error(error));
    }
};
export const isLoggedInAsync = () => async (dispatch, getState) => {
    try {
    const {data} = await axios.get("/isLoggedin")
        console.log(data);
        dispatch(isLoggedIn(data));
    } catch (error) {
        console.log(error);
        dispatch(error(error));
    }
};
export const logoutAsync = () => async (dispatch, getState) => {
    try {
    const {data} = await axios.get("/logout")
        console.log(data);
        dispatch(logout());
    } catch (error) {
        console.log(error);
        dispatch(error(error));
    }
};
export const registerAsync = (dets) => async (dispatch, getState) => {
    console.log(dets);
    try {
    const {data} = await axios.post("/register" , dets)
        console.log(data);
        dispatch(register(data));
    } catch (error) {
        console.log(error);
        dispatch(error(error));
    }
};


export default userSlice.reducer;