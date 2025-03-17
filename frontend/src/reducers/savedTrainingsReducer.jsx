import { createSlice } from "@reduxjs/toolkit";

//Services
import savedTrainingServices from "../services/savedTraning";

const savedTrainingSlice = createSlice({
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
  savedTrainingSlice.actions;
export default savedTrainingSlice.reducer;

export const initializeSavedTrainings = (token) => {
  return async (dispatch) => {
    const experiences = await savedTrainingServices.getAll(token);

    const transformedExperiences = experiences.map((exp) => ({
      id: exp._id, // Copia el valor de _id a id
      name: exp.name,
      date: exp.date,
    }));

    dispatch(setExperiences(transformedExperiences));
  };
};

export const saveTraining = (token, newExperience) => {
  return async (dispatch) => {
    const createdTraining = await savedTrainingServices.save(
      token,
      newExperience
    );

    const newTraining = {
      id: createdTraining.id,
      name: newExperience.name,
      date: newExperience.date,
    };

    dispatch(appendExperience(newTraining));
  };
};

export const removeTraining = (token, experienceId) => {
  return (dispatch) => {
    savedTrainingServices
      .remove(token, experienceId)
      .then(() => dispatch(deleteExperience(experienceId)));
  };
};
