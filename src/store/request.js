import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_URL;

export const getPost = createAsyncThunk(
  'request/getPost',
  async ({ name }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(BASE_URL, { name });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);