import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./auth/auth.slice";
import AdminLayoutReducer from "./admin/layout/layout.slice";
import CreateSneakerFormReducer from "./admin/product/sneaker/create/create-sneaker.slice";
import UpdateSneakerFormReducer from "./admin/product/sneaker/update/update-sneaker.slice";
import CheckoutReducer from "./checkout/checkout.slice";
import { persistReducer } from "redux-persist";
import storage from "./storage";
import { sessionStorage } from "./storage";

const authPersistConfig = {
  key: "auth",
  storage: storage,
};

const adminLayoutPersistConfig = {
  key: "adminLayout",
  storage: storage,
};

const checkoutPersistConfig = {
  key: "checkout",
  storage: sessionStorage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthReducer),
  adminLayout: persistReducer(adminLayoutPersistConfig, AdminLayoutReducer),
  checkout: persistReducer(checkoutPersistConfig, CheckoutReducer),
  createSneakerForm: CreateSneakerFormReducer,
  updateSneakerForm: UpdateSneakerFormReducer,
});

export default rootReducer;
