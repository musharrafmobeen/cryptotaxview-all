import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name:"drawer",
    initialState:{
        selection:"",
    },
    reducers:{
        drawerSelectionChanged: (drawer, action) => {
            drawer.selection = action.payload;
        },
    },
});

export const {
    drawerSelectionChanged
} = slice.actions;

export default slice.reducer;