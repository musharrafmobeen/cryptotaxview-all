import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name:"error",
    initialState:{
        isError:false,
        errorMessage:"",
        statusCode:""
    },
    reducers:{
        errorOccured:(error, action) => {
            error.isError = true;
            error.errorMessage = action.payload.message;
            error.statusCode = action.payload.statusCode;
        },
        errorReset: (error, action) => {
            error.isError = false;
            error.errorMessage = "";
            error.statusCode = "";
        },
    },
});

export const {
    errorOccured,
    errorReset
} = slice.actions;

export default slice.reducer;