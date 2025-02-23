import { createAsyncThunk } from '@reduxjs/toolkit';
import emailjs from '@emailjs/browser';

const PUBLIC_KEY = 'UPmKT2fiuyOVizSyc';
emailjs.init(PUBLIC_KEY);

export const getPost = createAsyncThunk(
  'request/getPost',
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await emailjs.send(
        'service_m7wqfpn',
        'template_r2hxph9',
        {
          to_name: name,
          message: `${name} has accepted your Valentine's invitation!`,
          reply_to: import.meta.env.VITE_EMAIL
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);