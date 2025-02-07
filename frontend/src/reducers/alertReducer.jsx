import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  title: 'Confirmar acción',
  message: '¿Estás seguro que deseas realizar esta acción?',
  onConfirm: null,
  onCancel: null,
};

const confirmationAlertSlice = createSlice({
  name: 'confirmationAlert',
  initialState,
  reducers: {
    showConfirmationAlert: (state, action) => {
      const { title, message, onConfirm, onCancel } = action.payload;
      state.isOpen = true;
      state.title = title || initialState.title;
      state.message = message || initialState.message;
      state.onConfirm = onConfirm || null;
      state.onCancel = onCancel || null;
    },
    hideConfirmationAlert: (state) => {
      state.isOpen = false;
      state.title = initialState.title;
      state.message = initialState.message;
      state.onConfirm = null;
      state.onCancel = null;
    },
  },
});

export const { showConfirmationAlert, hideConfirmationAlert } = confirmationAlertSlice.actions;
export default confirmationAlertSlice.reducer;

export const showConfirmationAlertAsync = ({ title, message }) => (dispatch) => {
  return new Promise((resolve) => {
    const onConfirm = () => {
      resolve(true);
      dispatch(hideConfirmationAlert());
    };

    const onCancel = () => {
      resolve(false);
      dispatch(hideConfirmationAlert());
    };

    dispatch(showConfirmationAlert({ title, message, onConfirm, onCancel }));
  });
};

