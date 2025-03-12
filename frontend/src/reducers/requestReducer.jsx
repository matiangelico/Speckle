import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Services
import savedTrainingService from "../services/savedTraning";
import requestServices from "../services/request";
import trainingService from "../services/training";

// Redux
import { initializeDefaultValues } from "./defaultValuesReducer";

// Estado inicial de training
export const initialRequestState = {
  id: null,
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

      const selectedDescriptorIds = savedTraining.selectedDescriptors.map(
        (desc) => desc.id
      );

      return {
        ...state,
        id: savedTraining._id,
        name: savedTraining.name,
        createdAt: savedTraining.date,
        oldVideo: savedTraining.video,
        descriptors: state.descriptors.map((descriptor) => ({
          ...descriptor,
          checked: selectedDescriptorIds.includes(descriptor.id), // Marcar como checked si está en selectedDescriptors
        })),
      };
    },
    setNewVideo(state, action) {
      return { ...state, newVideo: action.payload };
    },
    setDescriptors(state, action) {
      return { ...state, descriptors: action.payload };
    },
    setDescriptorsResults(state, action) {
      state.descriptorsResults = action.payload;
    },
    setRequestResult(state, action) {
      state.requestResult = action.payload;
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
  updateHyperparameter,
  setDescriptorsResults,
  setRequestResult,
} = requestSlice.actions;

export default requestSlice.reducer;

// 1.
export const getVideoData = (token, videoFile) => {
  return async (dispatch, getState) => {
    const oldVideo = getState().request.oldVideo;

    const result = await trainingService.getVideoDimensions(token, videoFile);

    if (!result?.width || !result?.height) {
      throw new Error("Error: Dimensiones del video no disponibles");
    }

    if (result.width != oldVideo.width || result.height != oldVideo.height) {
      throw new Error(
        `Las dimensiones de ambos videos deben coincidir. Las dimensiones del video insertado son ${result.width}x${result.height}.`
      );
    }

    const videoWithDimensions = {
      file: videoFile,
      width: result?.width || null,
      height: result?.height || null,
      frames: result?.frames || null,
    };

    dispatch(setNewVideo(videoWithDimensions));
  };
};

// 0.
export const initializeSavedTraining = (token, id) => {
  return async (dispatch) => {
    const training = await savedTrainingService.getTraining(token, id);

    // dispatch(resetRequest());
    dispatch(setTraining(training));
  };
};

// 4.
export const initializeDescriptorsResult = (token) => {
  return async (dispatch, getState) => {
    const videoFile = await getState().request.newVideo.file;
    const filtered = await getState().request.descriptors.filter(
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

// 10.
export const initializeRequestResult = (token) => {
  return async (dispatch, getState) => {
    const trainingId = await getState().request.id;
    const videoFile = await getState().request.newVideo.file;

    const result = await requestServices.getExperiencePrediction(
      token,
      videoFile,
      trainingId
    );

    console.log(result);

    const trainingResult = {
      image: result.prediction_image.imagen,
    };

    dispatch(setRequestResult(trainingResult));
  };
};
