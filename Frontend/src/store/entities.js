import { combineReducers } from "redux";
import holdingsReducer from "./holdings/holdings";
import transactionReducer from "./transactions/transactions";
import exchangesReducer from "./exchanges/exchanges";
import reportsReducer from "./reports/reports";
import csvMasterTableReducer from "./csvMasterTable/csvMasterTable";
import professionalUsersReducer from "./professionalUsers/professionalUsers";
export default combineReducers({
  holdings: holdingsReducer,
  transactions: transactionReducer,
  exchanges: exchangesReducer,
  reports: reportsReducer,
  csvMasterTableData: csvMasterTableReducer,
  professionalUsers: professionalUsersReducer,
});
