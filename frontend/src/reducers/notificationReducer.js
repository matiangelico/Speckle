/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    showNotification(state, action) {
      if (state !== null) {
        clearTimeout(state.duration);
      }
      const notification = {
        message: action.payload.content,
        duration: action.payload.timer,
      };
      return notification;
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;

export const setNotification = (content, seconds) => {
  return async (dispatch) => {
    let timer = setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
    dispatch(showNotification({ content, timer }));
  };
};

export default notificationSlice.reducer;
