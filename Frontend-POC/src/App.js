// import logo from "./logo.svg";
import "./App.css";
// import axios from "axios";
import { DrawerWidthProvider } from "./contexts/DrawerWidthContext";
import PageContent from "./components/helpers/PageContent";
import DashboardContentPane from "./components/helpers/DashboardContentPane";
import SideDrawer from "./components/views/SideDrawer";
import { Route, Switch } from "react-router-dom";
import TransactionsTable from "./components/views/TransactionsTable";
import WalletsTable from "./components/views/WalletsTable";
import OrdersTable from "./components/views/OrdersTable";
import DepositWithdrawlTable from "./components/views/DepositWithdrawlTable";
import Testing from "./components/Testing";

function App() {
  return (
    <div>
      {/* <Testing /> */}
      <DrawerWidthProvider>
        <Switch>
          <Route
            path="/"
            render={() => (
              <PageContent color={"#E5E5E5"}>
                <SideDrawer />
                <Route
                  exact
                  path="/transactions"
                  render={() => (
                    <DashboardContentPane color={"#E5E5E5"}>
                      {" "}
                      <TransactionsTable />
                    </DashboardContentPane>
                  )}
                />
                <Route
                  exact
                  path="/wallets"
                  render={() => (
                    <DashboardContentPane color={"#E5E5E5"}>
                      {" "}
                      <WalletsTable />
                    </DashboardContentPane>
                  )}
                />
                <Route
                  exact
                  path="/orders"
                  render={() => (
                    <DashboardContentPane color={"#E5E5E5"}>
                      {" "}
                      <OrdersTable />
                    </DashboardContentPane>
                  )}
                />
                <Route
                  exact
                  path="/deposit-withdrawl"
                  render={() => (
                    <DashboardContentPane color={"#E5E5E5"}>
                      {" "}
                      <DepositWithdrawlTable />
                    </DashboardContentPane>
                  )}
                />
              </PageContent>
            )}
          />
        </Switch>
      </DrawerWidthProvider>
    </div>
  );
}

export default App;
