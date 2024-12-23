/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const currentExperienceSlice = createSlice({
    name: "currentExperience",
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

export const { voteAnecdote, appendAnecdote, setAnecdotes } = currentExperienceSlice.actions
export default currentExperienceSlice.reducer