import { createSlice } from "@reduxjs/toolkit";

//Utils
import { convertToReadableDate } from "../utils/dateUtils";

//Services
import trainingService from "../services/trainingExperience";

export const initialTrainingState = {
  name: "Nuevo entrenamiento",
  createdAt: convertToReadableDate(Date.now()),
  video: null,
  descriptors: [],
  descriptorsResults: [],
  clustering: [],
  clusteringResults: [],
  neuralNetworkParams: [],
  neuralNetworkLayers: [],
  layersTemplate: null,
  trainingResult: null,
};

const traininingSlice = createSlice({
  name: "training",
  initialState: initialTrainingState,
  reducers: {
    // 0
    resetTraining: () => initialTrainingState,
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
    selectAllDescriptors(state) {
      const updatedDescriptors = state.descriptors.map((descriptor) => ({
        ...descriptor,
        checked: true, // Selecciona el descriptor
      }));

      return {
        ...state,
        descriptors: updatedDescriptors,
      };
    },
    deselectAllDescriptors(state) {
      const updatedDescriptors = state.descriptors.map((descriptor) => ({
        ...descriptor,
        checked: false, // Deselecciona el descriptor
      }));

      return {
        ...state,
        descriptors: updatedDescriptors,
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
    setClustering(state, action) {
      const clusteringParams = action.payload;
      return {
        ...state,
        clustering: clusteringParams,
      };
    },
    selectClustering(state, action) {
      const name = action.payload;

      const changedClustering = state.clustering.map(
        (cluster) =>
          cluster.name === name
            ? { ...cluster, checked: !cluster.checked } // Cambia el valor de "checked"
            : cluster // Si no coincide, no hace cambios
      );

      return {
        ...state,
        clustering: changedClustering,
      };
    },
    selectAllClustering(state) {
      const updatedClusterings = state.clustering.map((cluster) => ({
        ...cluster,
        checked: true,
      }));

      return {
        ...state,
        clustering: updatedClusterings,
      };
    },
    deselectAllClustering(state) {
      const updatedClusterings = state.clustering.map((cluster) => ({
        ...cluster,
        checked: false,
      }));

      return {
        ...state,
        clustering: updatedClusterings,
      };
    },
    // 6
    setClusteringParams(state, action) {
      const defaultValues = action.payload;

      const updatedClustering = state.clustering.map((cluster) => {
        const defaultCluster = defaultValues.find(
          (defaultCl) => defaultCl.name === cluster.name
        );

        if (!defaultCluster) return cluster;

        const updatedParameters = cluster.parameters.map((param) => {
          const defaultParam = defaultCluster.params.find(
            (defParam) => defParam.paramName === param.paramName
          );

          if (defaultParam && param.value !== defaultParam.value) {
            return { ...param, value: defaultParam.value };
          }
          return param;
        });

        return { ...cluster, parameters: updatedParameters };
      });

      return { ...state, clustering: updatedClustering };
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
    // 7
    setClusteringResults(state, action) {
      return { ...state, clusteringResults: action.payload };
    },
    selectClusteringResult(state, action) {
      const name = action.payload;

      const changedResults = state.clusteringResults.map((result) => ({
        ...result,
        checked: result.name === name,
      }));

      return {
        ...state,
        clusteringResults: changedResults,
      };
    },
    setNeuralNetworkParams(state, action) {
      const neuralNetworkParams = action.payload;
      return {
        ...state,
        neuralNetworkParams: neuralNetworkParams,
      };
    },
    updateNeuralNetworkParams(state, action) {
      const { parameterName, newValue } = action.payload;

      const updatedParams = state.neuralNetworkParams.map((param) => {
        if (param.name === parameterName) {
          return { ...param, value: newValue };
        } else {
          return param;
        }
      });

      return { ...state, neuralNetworkParams: updatedParams };
    },

    // 9
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
    // 10
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
  resetTraining, //0
  setName,
  setVideo, //1
  setDescriptors, //2
  selectDescriptor,
  selectAllDescriptors,
  deselectAllDescriptors,
  setHyperparameters, //3
  updateHyperparameter,
  setDescriptorsResults, //4
  selectDescriptorResult,
  setClustering, //5
  selectClustering,
  selectAllClustering,
  deselectAllClustering,
  setClusteringParams, //6
  updateClusteringParam,
  setClusteringResults, //7
  selectClusteringResult,
  setNeuralNetworkParams, //8
  updateNeuralNetworkParams,
  setNeuralNetworkLayers, //9
  setTemplateLayers,
  setTrainingResult, //10
} = traininingSlice.actions;

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
      checked: false,
      parameters: cluster.params,
    }));

    dispatch(setClustering(clusteringParams));
  };
};

// 6.
export const resetClusteringParams = () => {
  return (dispatch, getState) => {
    const defaultValuesClustering = getState().defaultValues.clustering;

    dispatch(setClusteringParams(defaultValuesClustering));
  };
};

// 7. deprecated en el futuro
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

// 8.
export const initializeNeuralNetworkParams = () => {
  return (dispatch, getState) => {
    const defaultValuesNeuralNetworkParams =
      getState().defaultValues.neuralNetworkParams;

    dispatch(setNeuralNetworkParams(defaultValuesNeuralNetworkParams));
  };
};

// 9.
export const initializeNeuralNetworkLayers = () => {
  return (dispatch, getState) => {
    const arrayNeuralNetworkLayers =
      getState().defaultValues.neuralNetworkLayers;
    const neuralNetworkLayerTemplate = arrayNeuralNetworkLayers.at(-1);

    dispatch(setNeuralNetworkLayers(arrayNeuralNetworkLayers));
    dispatch(setTemplateLayers(neuralNetworkLayerTemplate));
  };
};

// 10. deprecated en el futuro
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
