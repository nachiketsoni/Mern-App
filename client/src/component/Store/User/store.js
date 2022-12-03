import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./userReducer";

export const store = configureStore({
    reducer: { user: UserSlice },
});