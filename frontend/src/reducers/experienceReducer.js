/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const experienceSlice = createSlice({
    name: "experiences",
    initialState: null,
    reducers: {
        clearExperience(state, action) {
          return null
        },
        setExperience(state, action) {
          console.log(action.payload);
          
          return null
        },

    }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = experienceSlice.actions
export default experienceSlice.reducer