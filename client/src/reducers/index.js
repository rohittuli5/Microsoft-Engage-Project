import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

// combines the authReducer and errorReducer
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});