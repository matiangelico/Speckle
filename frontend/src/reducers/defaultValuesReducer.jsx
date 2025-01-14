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

export const initializeDefaultValues = () => {
  return async (dispatch) => {
    const defaultValues = await defaultValuesServices.getAll();
    dispatch(setDefaultValues(defaultValues));
  };
};

// TERMINAR ======
export const updatedDefaultValue = (defaultValue) => {
  return async (dispatch) => {
    const updatedValue = await defaultValuesSlice.update(
      defaultValue.id,
      defaultValue
    );
    dispatch(updateDefaultValue(updatedValue));
    // dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
  };
};
// ==========

export default defaultValuesSlice.reducer;
