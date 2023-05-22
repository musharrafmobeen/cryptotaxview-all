import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/helpers/NavBar";
import { ThemeProvider } from "@mui/styles";
import ContentPane from "./components/helpers/ContentPane";
import theme from "./resources/themes/themes";
import { Route, Routes } from "react-router-dom";
import React from "react";
import PersonalHome from "./components/views/PersonalHome";
import PersonalTransactions from "./components/views/PersonalTransactions";
import PersoanlReports from "./components/views/PersoanlReports";
import PersonalIntegrations from "./components/views/PersonalIntegrations";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <NavBar />
        <ContentPane>
          {/* <PersonalHome /> */}
          {/* <PersonalTransactions /> */}
          <PersoanlReports />
          {/* <PersonalIntegrations /> */}
        </ContentPane>
      </div>
    </ThemeProvider>
  );
}

export default App;
