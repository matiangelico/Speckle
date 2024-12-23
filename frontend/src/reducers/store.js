import { configureStore } from "@reduxjs/toolkit";
import currentExperienceReducer from "./currentExperienceReducer";
import experienceReducer from "./experienceReducer";

const store = configureStore({
  reducer: {
    experiences: experienceReducer,
    currentExperience: currentExperienceReducer,
  },
});

console.log(store.getState());

export default store;
