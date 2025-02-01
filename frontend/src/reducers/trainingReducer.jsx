import { createSlice } from "@reduxjs/toolkit";

//Utils
import { convertToReadableDate } from "../utils/dateUtils";

//Services
import trainingService from "../services/trainingExperience";

const traininingSlice = createSlice({
  name: "training",
  initialState: {
    name: "Nuevo entrenamiento",
    createdAt: convertToReadableDate(Date.now()),
    video: null,
    descriptors: [],
    descriptorsResults: [],
    clustering: [],
    clusteringResults: [],
    neuralNetworkLayers: [],
    layersTemplate: null,
    trainingResult: null,
  },
  reducers: {
    // 0
    setName(state, action) {
      return { ...state, name: action.payload };
    },
    // 1
    setVideo(state, action) {
      return { ...state, video: action.payload };
    },
    // 2
    setDescriptors(state, action) {
      const descriptorsParams = action.payload;
      return {
        ...state,
        descriptors: descriptorsParams,
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
    // 3
    setHyperparameters(state, action) {
      const defaultValues = action.payload;

      const updatedDescriptors = state.descriptors.map((descriptor) => {
        const defaultDescriptor = defaultValues.find(
          (defaultDesc) => defaultDesc.name === descriptor.name
        );

        if (!defaultDescriptor) return descriptor;

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
    // 4
    setDescriptorsResults(state, action) {
      return { ...state, descriptorsResults: action.payload };
    },
    selectDescriptorResult(state, action) {
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
    // 5
    setClusteringParams(state, action) {
      const clusteringParams = action.payload;
      return {
        ...state,
        clustering: clusteringParams,
      };
    },
    updateClusteringParam(state, action) {
      const { clusteringName, parameterName, newValue } = action.payload;

      const updatedClustering = state.clustering.map((cluster) => {
        if (cluster.name === clusteringName) {
          const updatedParameter = cluster.parameters?.map((param) => {
            if (param.paramName === parameterName) {
              return { ...param, value: newValue };
            }

            return param;
          });

          return { ...cluster, parameters: updatedParameter };
        }
        return cluster;
      });

      return { ...state, clustering: updatedClustering };
    },
    // 6
    setClusteringResults(state, action) {
      return { ...state, clusteringResults: action.payload };
    },
    selectClusteringResult(state, action) {
      const name = action.payload;

      const changedResults = state.clusteringResults.map((result) =>
        result.name === name ? { ...result, checked: !result.checked } : result
      );

      return {
        ...state,
        clusteringResults: changedResults,
      };
    },
    // 7
    setNeuralNetworkLayers(state, action) {
      const neuralNetwork = action.payload;
      return {
        ...state,
        neuralNetworkLayers: neuralNetwork,
      };
    },
    setTemplateLayers(state, action) {
      const neuralNetworkLayer = action.payload;
      return {
        ...state,
        layersTemplate: neuralNetworkLayer,
      };
    },
    setTrainingResult(state, action) {
      const result = action.payload;
      return {
        ...state,
        trainingResult: result,
      };
    },
  },
});

export const {
  setName, //0
  setVideo, //1
  setDescriptors, //2
  selectDescriptor,
  setHyperparameters, //3
  updateHyperparameter,
  setDescriptorsResults, //4
  selectDescriptorResult,
  setClusteringParams, //5
  updateClusteringParam,
  setClusteringResults, //6
  selectClusteringResult,
  setNeuralNetworkLayers, //7
  setTemplateLayers,
  setTrainingResult, //8
} = traininingSlice.actions;

// 1.
export const initializeVideo = (file) => {
  const validTypes = ["video/avi"]; // Tipo MIME para archivos .avi

  if (!validTypes.includes(file.type)) {
    throw new Error("Solo se permite cargar archivos .avi");
  }

  return (dispatch) => {
    dispatch(setVideo(file));
  };
};

// 2.
export const initializeDescriptors = () => {
  return (dispatch, getState) => {
    const defaultValuesDescriptors = getState().defaultValues.descriptors;

    const descriptors = defaultValuesDescriptors.map((descriptor) => ({
      name: descriptor.name,
      checked: false,
      hyperparameters: descriptor.params,
    }));

    dispatch(setDescriptors(descriptors));
  };
};

// 3.
export const resetHyperparameters = () => {
  return (dispatch, getState) => {
    const defaultValuesDescriptors = getState().defaultValues.descriptors;

    dispatch(setHyperparameters(defaultValuesDescriptors));
  };
};

// 4. deprecated en el futuro
export const initializeDescriptorsResult = () => {
  return async (dispatch) => {
    const results = await trainingService.getDescriptorsResults();

    const descriptorResults = results.map((result) => ({
      name: result.name,
      image: result.resultImage,
      checked: false,
    }));

    dispatch(setDescriptorsResults(descriptorResults));
  };
};
//

// 5.
export const initializeClustering = () => {
  return (dispatch, getState) => {
    const defaultValuesClustering = getState().defaultValues.clustering;

    const clusteringParams = defaultValuesClustering.map((cluster) => ({
      name: cluster.name,
      parameters: cluster.params,
    }));

    dispatch(setClusteringParams(clusteringParams));
  };
};

// 6. deprecated en el futuro
export const initializeClusteringResult = () => {
  return async (dispatch) => {
    const results = await trainingService.getClusteringResults();

    const clusteringResults = results.map((result) => ({
      name: result.name,
      image: result.resultImage,
      checked: false,
    }));

    dispatch(setClusteringResults(clusteringResults));
  };
};
//

// 7.
export const initializeNeuralNetwork = () => {
  return (dispatch, getState) => {
    const defaultValuesNeuralNetwork = getState().defaultValues.neuralNetwork;
    const arrayNeuralNetworkLayers = [defaultValuesNeuralNetwork];

    dispatch(setNeuralNetworkLayers(arrayNeuralNetworkLayers));
    dispatch(setTemplateLayers(defaultValuesNeuralNetwork));
  };
};

// 8. deprecated en el futuro
export const initializeTrainingResult = () => {
  return async (dispatch) => {
    const result = await trainingService.getTrainingResults();
    
    const trainingResult = {
      image: result,
    };
    
    dispatch(setTrainingResult(trainingResult));
  };
};
//
export default traininingSlice.reducer;
