import { createMachine } from "xstate";

const TrainingMachine = createMachine({
  id: "training",
  initial: "UPLOAD_VIDEO",
  on: {
    RESET: ".UPLOAD_VIDEO",
  },
  states: {
    UPLOAD_VIDEO: {
      on: {
        NEXT: "SELECT_DESCRIPTORS",
      },
    },
    SELECT_DESCRIPTORS: {
      on: {
        BACK: "UPLOAD_VIDEO",
        NEXT: "EDIT_HYPERPARAMETERS",
      },
    },
    EDIT_HYPERPARAMETERS: {
      on: {
        BACK: "SELECT_DESCRIPTORS",
        NEXT: "SELECT_DESCRIPTOR_RESULTS",
      },
    },
    SELECT_DESCRIPTOR_RESULTS: {
      on: {
        BACK: "EDIT_HYPERPARAMETERS",
        NEXT: "SELECT_CLUSTERING",
      },
    },
    SELECT_CLUSTERING: {
      on: {
        BACK: "SELECT_DESCRIPTOR_RESULTS",
        NEXT: "EDIT_CLUSTER_PARAMS",
      },
    },
    EDIT_CLUSTER_PARAMS: {
      on: {
        BACK: "SELECT_CLUSTERING",
        NEXT: "SELECT_CLUSTERING_RESULTS",
      },
    },
    SELECT_CLUSTERING_RESULTS: {
      on: {
        BACK: "EDIT_CLUSTER_PARAMS",
        NEXT: "EDIT_NEURAL_NETWORK_PARAMS",
      },
    },
    EDIT_NEURAL_NETWORK_PARAMS: {
      on: {
        BACK: "SELECT_CLUSTERING_RESULTS",
        NEXT: "EDIT_NEURAL_NETWORK_LAYERS",
      },
    },
    EDIT_NEURAL_NETWORK_LAYERS: {
      on: {
        BACK: "EDIT_NEURAL_NETWORK_PARAMS",
        NEXT: "NEURAL_NETWORK_RESULTS",
      },
    },
    NEURAL_NETWORK_RESULTS: {
      on: {
        BACK: "EDIT_NEURAL_NETWORK_LAYERS",
      },
    },
  },
});

export default TrainingMachine;
