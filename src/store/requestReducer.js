import { createSlice } from '@reduxjs/toolkit'
import { getPost } from './request'


const initialState = {
  data: [],
  error: null,
  isLoading: false,
}

const requestSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getPost.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getPost.fulfilled, (state, {payload}) => {
      state.data = payload
      state.isLoading = false
    })
    .addCase(getPost.rejected, (state, {payload}) => {
      state.isLoading = false
      state.error = payload
    })
  }
})

export default requestSlice