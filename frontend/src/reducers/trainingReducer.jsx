import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Services
import trainingService from "../services/training";

// Redux
import { initializeDefaultValues } from "./defaultValuesReducer";

// Utils
import { convertToTimestamp } from "../utils/dateUtils";
import { readFileAndProcess } from "../utils/featureMatrix";

// Estado inicial de training
export const initialTrainingState = {
  name: "Nuevo entrenamiento",
  createdAt: convertToTimestamp(Date.now()),
  video: null,
  descriptors: [],
  descriptorsResults: [],
  clustering: [],
  clusteringJSON: null,
  numberOfSelectedDescriptors: 0,
  numberOfClusters: 0,
  clusteringResults: [],
  neuralNetworkParams: [],
  neuralNetworkLayers: [],
  layersTemplate: null,
  trainingResult: null,
  status: "idle", // Para el estado de carga
  error: null,
};

// Thunk que inicializa el training basado en los defaultValues
export const initializeTrainingAsync = createAsyncThunk(
  "training/initializeTrainingAsync",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      // Primero, carga los default values usando el token
      const defaultValues = await dispatch(initializeDefaultValues(token));

      // Inicializar descriptors a partir de defaultValues.descriptors
      if (defaultValues?.descriptors) {
        const descriptors = defaultValues.descriptors.map((descriptor) => ({
          id: descriptor.id,
          name: descriptor.name,
          checked: false,
          hyperparameters: descriptor.params,
        }));
        dispatch(setDescriptors(descriptors));
      }

      // Inicializar clustering a partir de defaultValues.clustering
      if (defaultValues?.clustering) {
        const clusteringParams = defaultValues.clustering.map((cluster) => ({
          id: cluster.id,
          name: cluster.name,
          checked: false,
          parameters: cluster.params,
        }));
        dispatch(setClustering(clusteringParams));
      }

      // Inicializar Neural Network Params
      if (defaultValues?.neuralNetworkParams) {
        dispatch(setNeuralNetworkParams(defaultValues.neuralNetworkParams));
      }

      // Inicializar Neural Network Layers
      if (defaultValues?.neuralNetworkLayers) {
        const layersArray = defaultValues.neuralNetworkLayers;
        const neuralNetworkLayerTemplate = layersArray.at(-1);
        dispatch(setNeuralNetworkLayers(layersArray));
        dispatch(setTemplateLayers(neuralNetworkLayerTemplate));
      }

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const trainingSlice = createSlice({
  name: "training",
  initialState: initialTrainingState,
  reducers: {
    resetTraining: () => initialTrainingState,
    setName(state, action) {
      return { ...state, name: action.payload };
    },
    setVideo(state, action) {
      return { ...state, video: action.payload };
    },
    setDescriptors(state, action) {
      return { ...state, descriptors: action.payload };
    },
    selectDescriptor(state, action) {
      const name = action.payload;
      state.descriptors = state.descriptors.map((descriptor) =>
        descriptor.name === name
          ? { ...descriptor, checked: !descriptor.checked }
          : descriptor
      );
    },
    selectAllDescriptors(state) {
      state.descriptors = state.descriptors.map((descriptor) => ({
        ...descriptor,
        checked: true,
      }));
    },
    deselectAllDescriptors(state) {
      state.descriptors = state.descriptors.map((descriptor) => ({
        ...descriptor,
        checked: false,
      }));
    },
    setHyperparameters(state, action) {
      const defaultValues = action.payload;
      state.descriptors = state.descriptors.map((descriptor) => {
        const defaultDescriptor = defaultValues.find(
          (defaultDesc) => defaultDesc.name === descriptor.name
        );
        if (!defaultDescriptor) return descriptor;
        const updatedHyperparameters = descriptor.hyperparameters.map(
          (param) => {
            const defaultParam = defaultDescriptor.params.find(
              (defaultParam) => defaultParam.paramName === param.paramName
            );
            return defaultParam && param.value !== defaultParam.value
              ? { ...param, value: defaultParam.value }
              : param;
          }
        );
        return { ...descriptor, hyperparameters: updatedHyperparameters };
      });
    },
    updateHyperparameter(state, action) {
      const { descriptorName, hyperparameterName, newValue } = action.payload;
      state.descriptors = state.descriptors.map((descriptor) => {
        if (descriptor.name === descriptorName) {
          const updatedHyperparameters = descriptor.hyperparameters.map(
            (param) =>
              param.paramName === hyperparameterName
                ? { ...param, value: newValue }
                : param
          );
          return { ...descriptor, hyperparameters: updatedHyperparameters };
        }
        return descriptor;
      });
    },
    setDescriptorsResults(state, action) {
      state.descriptorsResults = action.payload;
    },
    selectDescriptorResult(state, action) {
      const name = action.payload;
      state.descriptorsResults = state.descriptorsResults.map((result) =>
        result.name === name ? { ...result, checked: !result.checked } : result
      );
    },
    setClustering(state, action) {
      state.clustering = action.payload;
    },
    selectClustering(state, action) {
      const name = action.payload;
      state.clustering = state.clustering.map((cluster) =>
        cluster.name === name
          ? { ...cluster, checked: !cluster.checked }
          : cluster
      );
    },
    selectAllClustering(state) {
      state.clustering = state.clustering.map((cluster) => ({
        ...cluster,
        checked: true,
      }));
    },
    deselectAllClustering(state) {
      state.clustering = state.clustering.map((cluster) => ({
        ...cluster,
        checked: false,
      }));
    },
    setClusteringParams(state, action) {
      const defaultValues = action.payload;
      state.clustering = state.clustering.map((cluster) => {
        const defaultCluster = defaultValues.find(
          (defaultCl) => defaultCl.name === cluster.name
        );
        if (!defaultCluster) return cluster;
        const updatedParameters = cluster.parameters.map((param) => {
          const defaultParam = defaultCluster.params.find(
            (defParam) => defParam.paramName === param.paramName
          );
          return defaultParam && param.value !== defaultParam.value
            ? { ...param, value: defaultParam.value }
            : param;
        });
        return { ...cluster, parameters: updatedParameters };
      });
    },
    updateClusteringParam(state, action) {
      const { clusteringName, parameterName, newValue } = action.payload;
      state.clustering = state.clustering.map((cluster) => {
        if (cluster.name === clusteringName) {
          const updatedParameter = cluster.parameters.map((param) =>
            param.paramName === parameterName
              ? { ...param, value: newValue }
              : param
          );
          return { ...cluster, parameters: updatedParameter };
        }
        return cluster;
      });
    },
    setClusteringJSON(state, action) {
      return {
        ...state,
        clusteringJSON: action.payload,
      };
    },
    setNumberOfSelectedDescriptors(state, action) {
      return {
        ...state,
        numberOfSelectedDescriptors: action.payload,
      };
    },
    setNumberOfClusters(state, action) {
      return {
        ...state,
        numberOfClusters: action.payload,
      };
    },
    setClusteringResults(state, action) {
      state.clusteringResults = action.payload;
    },
    selectClusteringResult(state, action) {
      const name = action.payload;
      state.clusteringResults = state.clusteringResults.map((result) => ({
        ...result,
        checked: result.name === name,
      }));
    },
    setNeuralNetworkParams(state, action) {
      state.neuralNetworkParams = action.payload;
    },
    updateNeuralNetworkParams(state, action) {
      const { parameterId, newValue } = action.payload;
      state.neuralNetworkParams = state.neuralNetworkParams.map((param) =>
        param.id === parameterId ? { ...param, value: newValue } : param
      );
    },
    setNeuralNetworkLayers(state, action) {
      state.neuralNetworkLayers = action.payload;
    },
    setTemplateLayers(state, action) {
      state.layersTemplate = action.payload;
    },
    setTrainingResult(state, action) {
      state.trainingResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTrainingAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initializeTrainingAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(initializeTrainingAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetTraining,
  setName,
  setVideo,
  setDescriptors,
  selectDescriptor,
  selectAllDescriptors,
  deselectAllDescriptors,
  setHyperparameters,
  updateHyperparameter,
  setDescriptorsResults,
  selectDescriptorResult,
  setClustering,
  selectClustering,
  selectAllClustering,
  deselectAllClustering,
  setClusteringParams,
  updateClusteringParam,
  setClusteringJSON,
  setNumberOfSelectedDescriptors,
  setNumberOfClusters,
  setClusteringResults,
  selectClusteringResult,
  setNeuralNetworkParams,
  updateNeuralNetworkParams,
  setNeuralNetworkLayers,
  setTemplateLayers,
  setTrainingResult,
} = trainingSlice.actions;

// 1.
export const getVideoData = (token, videoFile) => {
  return async (dispatch) => {
    const result = await trainingService.getVideoDimensions(token, videoFile);

    const videoWithDimensions = {
      file: videoFile,
      width: result?.width || null,
      height: result?.height || null,
      frames: result?.frames || null,
    };

    dispatch(setVideo(videoWithDimensions));
  };
};

// 3.
export const resetHyperparameters = () => {
  return (dispatch, getState) => {
    const defaultValuesDescriptors = getState().defaultValues.defaultValues.descriptors;
    
    dispatch(setHyperparameters(defaultValuesDescriptors));
  };
};

// 4.
export const initializeDescriptorsResult = (token) => {
  return async (dispatch, getState) => {
    const videoFile = await getState().training.video.file;
    const filtered = await getState().training.descriptors.filter(
      (descriptor) => descriptor.checked
    );

    const selectedDescriptorsArray = filtered.map((descriptor) => ({
      id: descriptor.id,
      params: descriptor.hyperparameters || [],
    }));

    const selectedDescriptors = {
      selectedDescriptors: selectedDescriptorsArray,
    };

    const results = await trainingService.getDescriptorsResults(
      token,
      videoFile,
      selectedDescriptors
    );

    const descriptorResults = results.imagenes_descriptores.map((result) => {
      const matchedDescriptor = filtered.find(
        (descriptor) => descriptor.id === result.id_descriptor
      );

      return {
        name: matchedDescriptor ? matchedDescriptor.name : result.id, // Fallback en caso de no encontrar coincidencia
        id: result.id_descriptor,
        image: result.imagen_descriptor,
        checked: false,
      };
    });

    dispatch(setDescriptorsResults(descriptorResults));
  };
};

// 6.
export const resetClusteringParams = () => {
  return (dispatch, getState) => {
    const defaultValuesClustering = getState().defaultValues.defaultValues.clustering;

    dispatch(setClusteringParams(defaultValuesClustering));
  };
};

// 7.
export const initializeClusteringResult = (token) => {
  return async (dispatch, getState) => {
    const descriptorResults = await getState().training.descriptorsResults;
    const filteredDescriptors = getState().training.descriptorsResults.filter(
      (descriptor) => descriptor.checked
    );
    const filteredClustering = getState().training.clustering.filter(
      (cluster) => cluster.checked
    );
    const selectedDescriptors = filteredDescriptors.map(
      (descriptor) => descriptor.id
    );
    const video = getState().training.video;
    const videoDimension = {
      width: video.width,
      height: video.height,
    };

    const selectedClustering = filteredClustering.map((cluster) => ({
      id: cluster.id,
      params: cluster.parameters.map((param) => ({
        paramId: param.paramId,
        value: param.value.toString(),
      })),
    }));

    const results = await trainingService.getClusteringResults(
      token,
      selectedDescriptors,
      selectedClustering,
      videoDimension
    );

    const clusteringResults = results.imagenes_clustering.map((result) => {
      const matchedDescriptor = filteredClustering.find(
        (descriptor) => descriptor.id === result.id_clustering
      );

      return {
        name: matchedDescriptor ? matchedDescriptor.name : result.id_clustering,
        id: result.id_clustering,
        clusterCenters: result.nro_clusters || -1,
        image: result.imagen_clustering,
        checked: false,
      };
    });

    const chekedDescriptorsResults = descriptorResults.filter(
      (descriptor) => descriptor.checked
    );

    dispatch(setClusteringResults(clusteringResults));
    dispatch(setNumberOfSelectedDescriptors(chekedDescriptorsResults.length));
  };
};

export const getFeaturedMatrixData = (file) => {
  return async (dispatch) => {
    const result = await readFileAndProcess(file);

    dispatch(setClusteringJSON(file));
    dispatch(setNumberOfSelectedDescriptors(result.count));
    dispatch(setNumberOfClusters(result.maxClusteringValue));
  };
};

// 10.
export const initializeTrainingResult = (token) => {
  return async (dispatch, getState) => {
    const filteredClustering = getState().training.clusteringResults.filter(
      (cluster) => cluster.checked
    );
    const neuralNetworkLayers = getState().training.neuralNetworkLayers;
    const neuralNetworkParamsArray = getState().training.neuralNetworkParams;

    const neuralNetworkParams = neuralNetworkParamsArray.reduce(
      (acc, param) => {
        const key = param.id.toLowerCase();
        acc[key] =
          param.type === "number"
            ? Number(param.value)
            : param.value.toString();
        return acc;
      },
      {}
    );

    const selectedClustering =
      filteredClustering.length > 0 ? filteredClustering[0].id : "";

    const result = await trainingService.getTrainingResults(
      token,
      neuralNetworkLayers,
      neuralNetworkParams,
      selectedClustering
    );

    const trainingResult = {
      image: result.image_prediction,
    };

    dispatch(setTrainingResult(trainingResult));
  };
};

export const changeToJSONTrainingResult = (token) => {
  return async (dispatch, getState) => {
    const clusteringJSON = getState().training.clusteringJSON;
    const neuralNetworkLayers = getState().training.neuralNetworkLayers;
    const neuralNetworkParamsArray = getState().training.neuralNetworkParams;

    const neuralNetworkParams = neuralNetworkParamsArray.reduce(
      (acc, param) => {
        const key = param.id.toLowerCase();
        acc[key] =
          param.type === "number"
            ? Number(param.value)
            : param.value.toString();
        return acc;
      },
      {}
    );

    const neuralNetwork = {
      neuralNetworkLayers,
      neuralNetworkParams,
    };

    const result = await trainingService.getTrainingJSONResults(
      token,
      neuralNetwork,
      clusteringJSON
    );

    console.log("result", result);

    const trainingResult = {
      image: result.image_prediction,
    };

    dispatch(setTrainingResult(trainingResult));
  };
};

export default trainingSlice.reducer;
