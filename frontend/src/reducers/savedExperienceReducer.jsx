import { createSlice } from "@reduxjs/toolkit";

//Services
import savedExperiencesServices from "../services/savedExperiences";

const savedExperienceSlice = createSlice({
  name: "savedExperiences",
  initialState: null,
  reducers: {
    setExperiences(state, action) {
      const byDate = (b1, b2) => b2.date - b1.date;
      const experiences = action.payload.sort(byDate);
      return experiences;
    },
    appendExperience(state, action) {
      const byDate = (b1, b2) => b2.date - b1.date;
      state.push(action.payload);
      state.sort(byDate);
    },
    deleteExperience(state, action) {
      const byDate = (b1, b2) => b2.date - b1.date;

      const removedExperienceId = action.payload;
      const experiences = state
        .filter((e) => e.id !== removedExperienceId)
        .sort(byDate);

      return experiences;
    },
  },
});

export const { setExperiences, appendExperience, deleteExperience } =
  savedExperienceSlice.actions;
export default savedExperienceSlice.reducer;

export const initializeSavedExperiences = () => {
  return async (dispatch) => {
    const experiences = await savedExperiencesServices.getAll();
    dispatch(setExperiences(experiences));
  };
};

export const saveExperience = (newExperience) => {
  return async (dispatch) => {
    // const createdExperience = await savedExperiencesServices.create(
    //   newExperience
    // );

    const createdExperience = {
      id: "67a02a003198ffd6e93d0a8a",
      name: newExperience.name,
      date: newExperience.date,
    };

    dispatch(appendExperience(createdExperience));
  };
};

export const removeExperience = (experienceId) => {
  return (dispatch) => {
    // savedExperiencesServices
    //   .remove(experience)
    //   .then(() => dispatch(deleteExperience(experience)));
    dispatch(deleteExperience(experienceId));
  };
};
