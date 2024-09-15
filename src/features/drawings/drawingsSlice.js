import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDrawings: [],
};

export const drawingsSlice = createSlice({
  name: "drawings",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } =
  drawingsSlice.actions;

export default drawingsSlice.reducer;
