import { createMachine, assign } from "xstate";

const TrainingMachine = createMachine({
  id: "training",
  initial: "UPLOAD_VIDEO",
  context: {
    // createdAt: Date.now(),
    video: null,
    descriptors: [],
    hyperparameters: {},
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
        NEXT: "SELECT_RESULTS",
        BACK: "UPLOAD_VIDEO",
        UPDATE_CONTEXT: {
          actions: assign({
            descriptors: ({ event }) => event.data.descriptors,
          }),
        },
      },
    },
    SELECT_RESULTS: {
      on: {
        BACK: "UPLOAD_VIDEO",
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
