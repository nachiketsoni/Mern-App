import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./User/userReducer";

export const store = configureStore({
    reducer: { user: UserSlice },
});