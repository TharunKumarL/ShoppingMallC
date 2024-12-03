import { configureStore } from '@reduxjs/toolkit';
import shopsReducer from './reducers/shopReducer';

const store = configureStore({
  reducer: {
    shops: shopsReducer,
  },
});

export default store;
