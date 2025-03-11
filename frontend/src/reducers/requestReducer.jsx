import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Services
import savedTrainingService from "../services/savedTraning";
import trainingService from "../services/training";

// Redux
import { initializeDefaultValues } from "./defaultValuesReducer";

// Estado inicial de training
export const initialRequestState = {
  name: " ",
  createdAt: null,
  oldVideo: null,
  newVideo: null,
  descriptors: [],
  descriptorsResults: [],
  requestResult: null,
  status: "idle", // Para el estado de carga
  error: null,
};

// Thunk que inicializa el training basado en los defaultValues
export const initializeRequestAsync = createAsyncThunk(
  "request/initializeRequestAsync",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const defaultValues = await dispatch(initializeDefaultValues(token));

      if (defaultValues?.descriptors) {
        const descriptors = defaultValues.descriptors.map((descriptor) => ({
          id: descriptor.id,
          name: descriptor.name,
          checked: false,
          hyperparameters: descriptor.params,
        }));
        dispatch(setDescriptors(descriptors));
      }

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: initialRequestState,
  reducers: {
    resetRequest: () => initialRequestState,
    setTraining(state, action) {
      const savedTraining = action.payload;

      return {
        ...state,
        name: savedTraining.name,
        createdAt: savedTraining.date,
        oldVideo: savedTraining.video,
      };
    },
    setNewVideo(state, action) {
      return { ...state, newVideo: action.payload };
    },
    setDescriptors(state, action) {
      return { ...state, descriptors: action.payload };
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
      const { parameterName, newValue } = action.payload;
      state.neuralNetworkParams = state.neuralNetworkParams.map((param) =>
        param.name === parameterName ? { ...param, value: newValue } : param
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
      .addCase(initializeRequestAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initializeRequestAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(initializeRequestAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  resetRequest,
  setTraining,
  setNewVideo,
  setDescriptors,
  selectDescriptor,
  selectAllDescriptors,
  deselectAllDescriptors,
  setHyperparameters,
  updateHyperparameter,
  setDescriptorsResults,
  selectDescriptorResult,
  setTrainingResult,
} = requestSlice.actions;

export default requestSlice.reducer;

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

    console.log("videoWithDimensions", videoWithDimensions);
    

    dispatch(setNewVideo(videoWithDimensions));
  };
};

export const initializeSavedTraining = (token, id) => {
  return async (dispatch) => {
    const training = await savedTrainingService.getTraining(token, id);
    console.log(training);
    dispatch(setTraining(training));
  };
};
