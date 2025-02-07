import { configureStore } from "@reduxjs/toolkit";

import defaultValuesReducer from "./defaultValuesReducer";
// import experienceReducer from "./experienceReducer";
import trainingReducer from "./trainingReducer";
import notificationReducer from "./notificationReducer";
import confirmationAlert from "./alertReducer.jsx"
import loaderReducer from './loaderReducer';

const store = configureStore({
  reducer: {
    defaultValues: defaultValuesReducer,
    // experiences: experienceReducer,
    training: trainingReducer,
    notification: notificationReducer,
    confirmationAlert: confirmationAlert,
    loader: loaderReducer,
  },
  // Deshabilitar la validación de serialización
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

console.log(store.getState());

export default store;
