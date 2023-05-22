import "./App.css";
import NavBar from "./components/helpers/NavBar";
import { ThemeProvider } from "@mui/styles";
import ContentPane from "./components/helpers/ContentPane";
import theme from "./resources/themes/themes";

import { Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import PersonalHome from "./components/views/PersonalHome";
// import PersonalTransactions from "./components/views/PersonalTransactions";
import PersonalIntegrations from "./components/views/PersonalIntegrations";
import PersonalReports from "./components/views/PersonalReports";
import SignIn from "./components/helpers/SignIn";
import SignUp from "./components/helpers/SignUp";
import ProfilePage from "./components/helpers/ProfilePage";
import AccountSettings from "./components/helpers/AccountSettings";

import { useDispatch, useSelector } from "react-redux";

import ProtectedRoute from "./components/helpers/ProtectedRoute";
import PersonalTransactionsRevamped from "./components/views/PersonalTransactionsRevamped";
import { socket, SocketContext } from "./contexts/socket";
import { changeSubNavBar } from "./store/ui/pageSubNavBar";
import { authenticateAlreadySignedInUser, setPlan } from "./store/auth/auth";
import ErrorPage from "./components/helpers/ErrorPage";
import ProtectedRouteAdmin from "./components/helpers/ProtectedRouteAdmin";
import AdminHome from "./components/views/AdminHome";
import AdminCSVMasterCRUD from "./components/views/AdminCSVMasterCRUD";
import ProfessionalUsers from "./components/views/ProfessionalUsers";
import SignUpViaReferral from "./components/helpers/SignUpViaReferral";
import PricingAndPlan from "./components/views/PricingAndPlan";

function App() {
  const user = useSelector((state) => state.auth.user);
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const loading = useSelector((state) => state.auth.loading);
  const isError = useSelector((state) => state.auth.isError);
  const token = localStorage.getItem("token");
  // const navRoute = localStorage.getItem("navRoute");
  const location = useLocation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  if (!Object.keys(user).length && token && !loading && !isError) {
    dispatch(authenticateAlreadySignedInUser(token));
    dispatch(changeSubNavBar(`${localStorage.getItem("navRoute") || "/home"}`));

    let plan = localStorage.getItem("plan");
    if (plan === "true") dispatch(setPlan(true));
    else dispatch(setPlan(false));
  }

  useEffect(() => {
    if (Object.keys(user).length) {
      socket.emit("subscribeToNotifications");
      console.log("subscribing");
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <div>
          {Object.keys(user).length ? (
            location.pathname !== "/" &&
            location.pathname !== "/signup" &&
            location.pathname !== "/signup/referral/" ? (
              <NavBar />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          <Routes>
            <Route
              path="/signup/referral/:firstName/:lastName/:email/:id/:userID/:firstName/:email"
              element={<SignUpViaReferral />}
            />
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {Object.keys(user).length ? (
              <>
                <Route element={<ProtectedRoute user={user} />}>
                  <Route
                    path="/home"
                    element={
                      <ContentPane>
                        {isPersonalPlan ? (
                          <PersonalHome />
                        ) : (
                          <ProfessionalUsers />
                        )}
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/holdings/:name/:email"
                    element={
                      <ContentPane>
                        <PersonalHome />
                      </ContentPane>
                    }
                  />

                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/account_settings"
                    element={<AccountSettings />}
                  />
                  <Route
                    path="/integrations"
                    element={
                      <ContentPane>
                        <PersonalIntegrations />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/integrations/:name/:email"
                    element={
                      <ContentPane>
                        <PersonalIntegrations />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <ContentPane>
                        <PersonalTransactionsRevamped />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/transactions/:name/:email"
                    element={
                      <ContentPane>
                        <PersonalTransactionsRevamped />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ContentPane>
                        <PersonalReports />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/reports/:name/:email"
                    element={
                      <ContentPane>
                        <PersonalReports />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/pricing-and-plan"
                    element={
                      <ContentPane>
                        <PricingAndPlan />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/pricing-and-plan/:name/:email"
                    element={
                      <ContentPane>
                        <PricingAndPlan />
                      </ContentPane>
                    }
                  />
                </Route>
                <Route element={<ProtectedRouteAdmin user={user} />}>
                  <Route
                    path="/admin-home"
                    element={
                      <ContentPane>
                        <AdminHome />
                      </ContentPane>
                    }
                  />
                  <Route
                    path="/admin-csv-master-crud"
                    element={
                      <ContentPane>
                        <AdminCSVMasterCRUD />
                      </ContentPane>
                    }
                  />
                </Route>
              </>
            ) : (
              <></>
            )}
            {!loading ? <Route path="*" element={<ErrorPage />} /> : <></>}
          </Routes>
        </div>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
