import { configureStore, Store } from '@reduxjs/toolkit';
// import logger from 'redux-logger';
import { persistStore, Persistor } from 'redux-persist';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { persistedReducer, RootState } from './rootReducer';

const middlewares: Array<ThunkMiddleware<RootState>> = [thunk];

// if (process.env.NODE_ENV !== 'production') {
//   middlewares.push(logger);
// }

export const store: Store<RootState> = configureStore({
  reducer: persistedReducer,
  middleware: middlewares,
});

export const persistor: Persistor = persistStore(store);
