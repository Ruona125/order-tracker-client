import { combineReducers, Reducer } from "redux";
import { persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/es/storage";
import { userReducer, UserState, UserAction } from "./User/userReducer";

// Define the type for the root state
export interface RootState {
  user: UserState;
  // Add other state slices here if you have more reducers
}

// Define the type for the root action
export type RootAction = UserAction;
// You can include other action types from different reducers here

// Create the persisted configuration
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: storage,
};

// Define the type for the root reducer
export type RootReducer = Reducer<RootState, RootAction>;

const rootReducer: RootReducer = combineReducers<RootState>({
  user: userReducer,
  // Add other reducers here if you have more slices in the state
});

// Create the persisted reducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);
