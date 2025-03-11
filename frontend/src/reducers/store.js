import { configureStore } from "@reduxjs/toolkit";

import defaultValuesReducer from "./defaultValuesReducer";
import savedTrainingsReducer from "./savedTrainingsReducer";
import trainingReducer from "./trainingReducer";
import requestReducer from "./requestReducer";
import notificationReducer from "./notificationReducer";
import confirmationAlert from "./alertReducer";

const store = configureStore({
  reducer: {
    defaultValues: defaultValuesReducer,
    savedTrainings: savedTrainingsReducer,
    training: trainingReducer,
    request: requestReducer,
    notification: notificationReducer,
    confirmationAlert: confirmationAlert,
  },
  // Deshabilitar la validación de serialización
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
