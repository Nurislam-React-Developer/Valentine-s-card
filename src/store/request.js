import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;

export const getPost = createAsyncThunk(
	'request/getPost',
	async(_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(BASE_URL);
      return data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);