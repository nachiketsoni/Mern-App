import { createSlice } from "@reduxjs/toolkit";
import axios from "../../../AxiosConfig/axios";

const initialState = {
    user : {},
    isLoggedIn : false,
    error : ""
};

export const userSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        err: (state, action) => {
            state.user = {};
            state.error = action.payload;
        },
        login: (state, action) => {
            state.user = action.payload;
            state.error = ""
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = {};
            state.error = ""
            state.isLoggedIn = false;

        },
        register: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.error = ""

        },
        myprofile: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.error = ""


        },
        isLoggedIn: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.error = ""
        },
    },
});

// Action creators are generated for each case reducer function
export const { login , logout, register , myprofile,isLoggedIn, err  } = userSlice.actions;

export const loginAsync = (dets) => async (dispatch, getState) => {
    try {
    const {data} = await axios.post("/login", dets)
        dispatch(login(data)); 
         
    } catch (error) {
        console.log(error.response.data.message);
        dispatch(err(error.response.data.message));
    }
};
export const myProfileAsync = () => async (dispatch, getState) => {
    try {
    const {data} = await axios.get("/myprofile")
        console.log(data);
        if(data.status === "success"){
            dispatch(myprofile(data));
            }else{
                dispatch(err(data.response.data.message));
            }
    } catch (error) {
        console.log(error.response.data.message);
        dispatch(err(error.response.data.message));
    }
};
export const isLoggedInAsync = () => async (dispatch, getState) => {
    try {

        const {data} = await axios.get("/isLoggedin")

        console.log(data);
        dispatch(isLoggedIn(data));
      
    } catch (error) {
        console.log(error);
        try{
            dispatch(err(String(error.response.data.message)));

        }catch{
            dispatch(err(String(error)));
        }
    }
};
export const logoutAsync = () => async (dispatch, getState) => {
    try {
    const {data} = await axios.get("/logout")
        console.log(data);
        if(data.status === "success"){
        
            dispatch(logout());
            }else{
                dispatch(err(data.response.data.message));
            }
    } catch (error) {
        console.log(error.response.data.message);
        dispatch(err(error.response.data.message));
    }
};
export const registerAsync = (dets) => async (dispatch, getState) => {
    console.log(dets);
    try {
    const {data} = await axios.post("/register" , dets)
        console.log(data);
        if(data.status === "success"){
           
            dispatch(register(data));
            }else{
                dispatch(err(data.response.data.message));
            }
    } catch (error) {
        console.log(error.response.data.message);
        dispatch(err(error.response.data.message));
    }
};


export default userSlice.reducer;