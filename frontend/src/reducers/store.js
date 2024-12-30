import { configureStore } from "@reduxjs/toolkit";

import defaultValuesReducer from "./defaultValuesReducer";
// import experienceReducer from "./experienceReducer";
import notificationReducer from "./notificationReducer";

const store = configureStore({
  reducer: {
    defaultValues: defaultValuesReducer,
    notification: notificationReducer,
    // experiences: experienceReducer,
  },
});

console.log(store.getState());

export default store;
