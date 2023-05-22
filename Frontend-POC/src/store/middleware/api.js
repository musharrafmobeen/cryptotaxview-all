import * as actions from "../api";
import axios from "axios";
import { errorOccured, errorReset } from "../ui/error";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    dispatch(errorReset());
    const { url, method, data, onSuccess, onStart, onError, headers } =
      action.payload;
    if (onStart) dispatch({ type: onStart });
    next(action);
    try {
      const response = await axios.request({
        url,
        method,
        data,
        headers,
      });
      dispatch(actions.apiCallSuccess(response.data));
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (err) {
      let error;
      if (err.response) error = err.response.data;
      else
        error = {
          message: err.message,
          error: {
            statusCode: 408,
            status: "time out",
          },
        };
      dispatch(actions.apiCallFailed(error));
      if (onError) dispatch({ type: onError, payload: error });
      dispatch(
        errorOccured({
          message: error.message,
          // statusCode: error.error.statusCode
        })
      );
    }
  };

export default api;
