import { combineReducers } from "redux";
import drawerReducer from "./drawer";
import currencyReducer from "./exchanges";
import errorReducer from "./error";

export default combineReducers({
  drawer: drawerReducer,
  currency: currencyReducer,
  error: errorReducer,
});
