import { createSlice } from "@reduxjs/toolkit";

const traininingSlice = createSlice({
  name: "training",
  initialState: {
    createdAt: Date.now(),
    video: null,
    descriptors: [],
  },
  reducers: {
    setVideo(state, action) {
      return { ...state, video: action.payload };
    },
    setDescriptors(state, action) {
      const descriptors = action.payload;
      return {
        ...state,
        descriptors,
      };
    },
    updateDescriptors(state, action) {
      const name = action.payload;
      console.log(name);
      
      const changedDescriptors = state.descriptors.map(
        (descriptor) =>
          descriptor.name === name
            ? { ...descriptor, checked: !descriptor.checked } // Cambia el valor de "checked"
            : descriptor // Si no coincide, no hace cambios
      );

      return {
        ...state,
        descriptors: changedDescriptors, // Aquí estamos devolviendo "descriptors" actualizado
      };
    },
    setHyperparameters(state, action) {
      return { ...state, hyperparameters: action.payload };
    },
    updateHyperparameters(state, action) {
      const hyperparameters = action.payload;
      return {
        ...state,
        hyperparameters,
      };
    },
  },
});

export const {
  setDescriptors,
  setVideo,
  updateDescriptors,
  setHyperparameters,
  updateHyperparameters,
} = traininingSlice.actions;

export const initializeVideo = (file) => {
  const validTypes = ["video/avi"]; // Tipo MIME para archivos .avi

  if (!validTypes.includes(file.type)) {
    throw new Error("Solo se permite cargar archivos .avi");
  }

  return (dispatch) => {
    dispatch(setVideo(file));
  };
};

export const initializeDescriptors = () => {
  return (dispatch, getState) => {
    const defaultValues = getState().defaultValues;
    
    const descriptors = defaultValues.map((descriptor) => ({
      name: descriptor.name,
      checked: false,
      hyperparameters: descriptor.params,
    }));

    dispatch(setDescriptors(descriptors));
  };
};

export const selectDescriptor = (descriptorChanged) => {
  return (dispatch) => {
    dispatch(updateDescriptors(descriptorChanged));
  };
};

export default traininingSlice.reducer;
