import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState:{
    roomId: null,
    messageId: null,
  },
  reducers: {
    enterRoom: (state,action)=>{
      state.roomId = action.payload.roomId;
    },
    getMessageId: (state,action)=>{
      state.messageId = action.payload.messageId;
    }
  },
  
});

export const { enterRoom, getMessageId } = appSlice.actions;

export const selectRoomId = (state) => state.app.roomId;
export const selectMessageId = (state) => state.app.messageId;

export default appSlice.reducer;
