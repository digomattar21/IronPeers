import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/appSlice';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);
const store = configureStore({
  reducer: {
    app: appReducer,
  },
  enhancer:{
    composeEnhancers
  }
  
});

export default store;

