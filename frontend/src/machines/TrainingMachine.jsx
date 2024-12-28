import { createMachine, assign } from "xstate";

const TrainingMachine = createMachine({
  id: "training",
  initial: "UPLOAD_VIDEO",
  context: {
    createdAt: Date.now(),
    video: null,
    descriptors: [],
    hyperparameters: [],
  },
  states: {
    UPLOAD_VIDEO: {
      on: {
        NEXT: "SELECT_DESCRIPTORS",
        UPDATE_CONTEXT: {
          actions: assign({
            video: ({ event }) => event.data.video,
          }),
        },
      },
    },
    SELECT_DESCRIPTORS: {
      on: {
        BACK: "UPLOAD_VIDEO",
        NEXT: "EDIT_HYPERPARAMETERS",
        UPDATE_CONTEXT: {
          actions: assign({
            descriptors: ({ event }) => event.data.descriptors,
          }),
        },
      },
    },
    EDIT_HYPERPARAMETERS: {
      on: {
        BACK: "SELECT_DESCRIPTORS",
        NEXT: "SELECT_DESCRIPTOR_RESULTS",
        UPDATE_CONTEXT: {
          actions: assign({
            hyperparameters: ({ event }) => event.data.hyperparameters,
          }),
        },
      },
    },
    SELECT_DESCRIPTOR_RESULTS: {
      on: {
        BACK: "EDIT_HYPERPARAMETERS",
        NEXT: "EDIT_CLUSTER_PARAMS",
        UPDATE_CONTEXT: {
          actions: assign((context, event) => ({
            ...context,
            ...event.data,
          })),
        },
      },
    },
    EDIT_CLUSTER_PARAMS: {
      on: {
        BACK: "SELECT_DESCRIPTOR_RESULTS",
        NEXT: "SELECT_CLUSTERING_RESULTS",
        UPDATE_CONTEXT: {
          actions: assign((context, event) => ({
            ...context,
            ...event.data,
          })),
        },
      },
    },
    SELECT_CLUSTERING_RESULTS: {
      on: {
        BACK: "EDIT_CLUSTER_PARAMS",
        NEXT: "EDIT_NEURAL_NETWORK_PARAMS",
        UPDATE_CONTEXT: {
          actions: assign((context, event) => ({
            ...context,
            ...event.data,
          })),
        },
      },
    },
    EDIT_NEURAL_NETWORK_PARAMS: {
      on: {
        BACK: "SELECT_CLUSTERING_RESULTS",
        NEXT: "NEURAL_NETWORK_RESULTS",
        UPDATE_CONTEXT: {
          actions: assign((context, event) => ({
            ...context,
            ...event.data,
          })),
        },
      },
    },
    NEURAL_NETWORK_RESULTS: {
      on: {
        BACK: "EDIT_NEURAL_NETWORK_PARAMS",
        UPDATE_CONTEXT: {
          actions: assign((context, event) => ({
            ...context,
            ...event.data,
          })),
        },
      },
    },
  },
});

export default TrainingMachine;
