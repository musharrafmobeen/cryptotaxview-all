import { combineReducers } from "redux";
import pageSubNavBar from "./pageSubNavBar";
import errorReducer from "./error";

export default combineReducers({
  pageSubNavBar: pageSubNavBar,
  error: errorReducer,
});
