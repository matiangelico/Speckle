import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    showNotification: (state, { payload: { content, type, timer } }) => {
      if (state) clearTimeout(state.duration);
      return { message: content, type, duration: timer };
    },
    clearNotification: () => null,
  },
});

export const createNotification = (content, type) => (dispatch) => {
  const timer = setTimeout(() => dispatch(clearNotification()), 5000);
  dispatch(showNotification({ content, type, timer }));
};

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
