import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./auth/auth.slice";
import AdminLayoutReducer from "./admin/layout/layout.slice";
import CreateSneakerFormReducer from "./admin/product/sneaker/create/create-sneaker.slice";
import UpdateSneakerFormReducer from "./admin/product/sneaker/update/update-sneaker.slice";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const authPersistConfig = {
  key: "auth",
  storage: storage,
};

const adminLayoutPersistConfig = {
  key: "adminLayout",
  storage: storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthReducer),
  adminLayout: persistReducer(adminLayoutPersistConfig, AdminLayoutReducer),
  createSneakerForm: CreateSneakerFormReducer,
  updateSneakerForm: UpdateSneakerFormReducer,
});

export default rootReducer;
