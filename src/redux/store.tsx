import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import storage from "redux-persist/lib/storage";
import { persistReducer, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
  persistStore} from "redux-persist";
import authReducer from './features/auth/authSlice'

const persistConfig = {
  key: 'auth',
  storage
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares({
    serializableCheck: {
      ignoredActions: [FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER]
    }
  }).concat(baseApi.middleware)
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
