import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import categorySlice from "./slices/categorySlice";
import filterSlice from "./slices/filterSlice";
import eventSlice from "./slices/eventSlice";
import orderSlice from "./slices/orderSlice";
import appSlice from "./slices/appSlice";

const rootReducer = combineReducers({
  appKey: appSlice,
  userKey: userSlice,
  categoryKey: categorySlice,
  filterKey: filterSlice,
  eventKey: eventSlice,
  orderKey: orderSlice,
});

const store = configureStore({
  reducer: rootReducer
})

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;