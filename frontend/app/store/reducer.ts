import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./auth/auth.slice";
import AdminLayoutReducer from "./admin/layout/layout.slice";
// import AdminOrderReducer from "./admin/order/order.slice";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  // whitelist: ["user"],
};

const adminLayoutPersistConfig = {
  key: "adminLayout",
  storage: storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthReducer),
  adminLayout: persistReducer(adminLayoutPersistConfig, AdminLayoutReducer),
  //   adminOrder: AdminOrderReducer,
});

export default rootReducer;
