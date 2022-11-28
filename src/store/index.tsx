import { configureStore, combineReducers } from '@reduxjs/toolkit';
import playlist from './playlist';
import user from './user';

const store = configureStore({
    reducer: combineReducers({
        playlist,
        user
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;