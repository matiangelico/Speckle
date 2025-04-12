import { createSlice } from "@reduxjs/toolkit";

// Services
import defaultValuesServices from "../services/defaultValues";

const defaultValuesSlice = createSlice({
  name: "defaultValues",
  initialState: {
    defaultValues: null,
    loading: false,
  },
  reducers: {
    setDefaultValues(state, action) {
      state.defaultValues = action.payload;
    },
    updateDefaultValue(state, action) {
      const valueChanged = action.payload;
      state.defaultValues = state.defaultValues.map((value) =>
        value.id === valueChanged.id ? valueChanged : value
      );
    },
    setLoadingDefaultValues(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setDefaultValues, updateDefaultValue, setLoadingDefaultValues } =
  defaultValuesSlice.actions;

export const selectDefaultValues = (state) =>
  state.defaultValues.defaultValues || [];
export const selectLoadingDefaultValues = (state) =>
  state.defaultValues.loading;

export const initializeDefaultValues =
  (token) => async (dispatch, getState) => {
    const currentState = getState().defaultValues.defaultValues;
    const isLoading = getState().defaultValues.loading;

    if (currentState !== null || isLoading) {
      return currentState;
    }

    dispatch(setLoadingDefaultValues(true));

    try {
      const defaultValues = await defaultValuesServices.getAll(token);
      dispatch(setDefaultValues(defaultValues));
      return defaultValues;
    } catch (error) {
      console.error("Error loading default values:", error);
      throw error;
    } finally {
      dispatch(setLoadingDefaultValues(false));
    }
  };

export default defaultValuesSlice.reducer;
