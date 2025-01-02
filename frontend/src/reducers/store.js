import { configureStore } from "@reduxjs/toolkit";

import defaultValuesReducer from "./defaultValuesReducer";
import trainingReducer from "./trainingReducer";
// import experienceReducer from "./experienceReducer";
import notificationReducer from "./notificationReducer";

const store = configureStore({
  reducer: {
    defaultValues: defaultValuesReducer,
    training: trainingReducer,
    notification: notificationReducer,
    // experiences: experienceReducer,
  },
  // Deshabilitar la validación de serialización
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

console.log(store.getState());

export default store;
