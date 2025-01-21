import { createSlice } from "@reduxjs/toolkit";

//Utils
import { convertToReadableDate } from '../utils/dateUtils';

//Services
import trainingService from '../services/trainingExperience'


const traininingSlice = createSlice({
  name: "training",
  initialState: {
    createdAt: convertToReadableDate(Date.now()),
    video: null,
    descriptors: [],
    descriptorsResults: [],
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
    setDescriptorsResults(state, action) {
      return { ...state, descriptorsResults: action.payload };
    },
    selectResultDescriptor(state, action) {
      const name = action.payload;

      const changedResults = state.descriptorsResults.map(
        (result) =>
          result.name === name
            ? { ...result, checked: !result.checked } // Cambia el valor de "checked"
            : result // Si no coincide, no hace cambios
      );

      return {
        ...state,
        descriptorsResults: changedResults,
      };
    },
  },
});

export const {
  setVideo,
  setDescriptors,
  selectDescriptor,
  setHyperparameters,
  updateHyperparameter,
  setDescriptorsResults,
  selectResultDescriptor,

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

// deprecated en el futuro
export const initializeDescriptorsResult = () => {
  return async dispatch => {
      const results = await trainingService.getResults()

      const descriptorResults = results.map((result) => ({
        name: result.name,
        image: result.resultImage,
        checked: false,
      }));

      dispatch(setDescriptorsResults(descriptorResults))
  }
}
// 

export default traininingSlice.reducer;
