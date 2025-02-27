import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import { BrowserRouter } from "react-router-dom";
import {
  Mainnet,
  DAppProvider,
  Rinkeby,
  useEtherBalance,
  useEthers,
  Config,
} from "@usedapp/core";

const config = {
  readOnlyChainId: Rinkeby.chainId,
};

const store = configureStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <DAppProvider config={config}>
          <App />
        </DAppProvider>
      </React.StrictMode>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
