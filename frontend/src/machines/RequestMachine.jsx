import { createMachine } from "xstate";

const RequestMachine = createMachine({
  id: "request",
  initial: "TRAINING_SELECTED",
  on: {
    RESET: ".TRAINING_SELECTED",
  },
  states: {
    TRAINING_SELECTED: {
      on: {
        NEXT: "UPLOAD_VIDEO",
      },
    },
    UPLOAD_VIDEO: {
      on: {
        BACK: "TRAINING_SELECTED",
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
        NEXT: "NEURAL_NETWORK_RESULTS",
      },
    },
    NEURAL_NETWORK_RESULTS: {
      on: {
        BACK: "EDIT_HYPERPARAMETERS",
      },
    },
  },
});

export default RequestMachine;
