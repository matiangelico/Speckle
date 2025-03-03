import defaultValuesServices from "../services/defaultValues";

import { createSlice } from "@reduxjs/toolkit";

const defaultValuesSlice = createSlice({
  name: "defaultValues",
  initialState: null,
  reducers: {
    setDefaultValues(state, action) {
      return action.payload;
    },
    updateDefaultValue(state, action) {
      const valueChanged = action.payload;
      return state.map((value) =>
        value.id === valueChanged.id ? valueChanged : value
      );
    },
  },
});

export const { setDefaultValues, updateDefaultValue } =
  defaultValuesSlice.actions;

export const selectDefaultValues = (state) => state.defaultValues || [];

export const initializeDefaultValues =
  (token) => async (dispatch, getState) => {
    const currentState = getState().defaultValues;

    if (currentState !== null) {
      return currentState;
    }

    const defaultValues = await defaultValuesServices.getAll(token);
    dispatch(setDefaultValues(defaultValues));
    return defaultValues;
  };

export default defaultValuesSlice.reducer;
