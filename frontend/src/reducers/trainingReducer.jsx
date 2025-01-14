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
    selectDescriptor(state, action) {
      const name = action.payload;

      const changedDescriptors = state.descriptors.map(
        (descriptor) =>
          descriptor.name === name
            ? { ...descriptor, checked: !descriptor.checked } // Cambia el valor de "checked"
            : descriptor // Si no coincide, no hace cambios
      );

      return {
        ...state,
        descriptors: changedDescriptors,
      };
    },
    setHyperparameters(state, action) {
      const defaultValues = action.payload;
      
      console.log("defaultValues", defaultValues);

      const updatedDescriptors = state.descriptors.map((descriptor) => {
        const defaultDescriptor = defaultValues.find(
          (defaultDesc) => defaultDesc.name === descriptor.name
        );
        
        if (!defaultDescriptor) return descriptor;

        console.log("pasooo 1");

        const updatedHyperparameters = descriptor.hyperparameters.map(
          (param) => {
            const defaultParam = defaultDescriptor.params.find(
              (defaultParam) => defaultParam.paramName === param.paramName
            );

            if (defaultParam && param.value !== defaultParam.value) {
              return { ...param, value: defaultParam.value };
            }
            return param;
          }
        );

        return { ...descriptor, hyperparameters: updatedHyperparameters };
      });

      return { ...state, descriptors: updatedDescriptors };
    },
    updateHyperparameter(state, action) {
      const { descriptorName, hyperparameterName, newValue } = action.payload;

      const updatedDescriptors = state.descriptors.map((descriptor) => {
        if (descriptor.name === descriptorName) {
          const updatedHyperparameters = descriptor.hyperparameters?.map(
            (param) => {
              if (param.paramName === hyperparameterName) {
                return { ...param, value: newValue };
              }
              return param;
            }
          );

          return { ...descriptor, hyperparameters: updatedHyperparameters };
        }
        return descriptor;
      });

      return { ...state, descriptors: updatedDescriptors };
    },
  },
});

export const {
  setVideo,
  setDescriptors,
  selectDescriptor,
  setHyperparameters,
  updateHyperparameter,
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

export const resetHyperparameters = () => {
  return (dispatch, getState) => {
    const defaultValues = getState().defaultValues;

    dispatch(setHyperparameters(defaultValues));
  };
};

export default traininingSlice.reducer;
