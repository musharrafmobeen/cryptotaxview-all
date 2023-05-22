import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TableHead,
  Tooltip,
} from "@mui/material";
import styles from "../../resources/styles/views-styles/ProfessionalUsersStyles";
import { withStyles } from "@mui/styles";
import BigButtonCard from "../helpers/BigButtonCard";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import AddClientDialog from "../professional-components/AddClientDialog";
import axios from "axios";
import configData from "../../config.json";

import { getPlatformImageByName } from "../../services/platform-integration-data";
import {
  getClients,
  postQuickInvites,
  sendReferralEmail,
} from "../../store/professionalUsers/professionalUsers";
import IntegrationsIcon from "../../resources/design-icons/welcome-card-icons/connect.svg";
import TransactionsIcon from "../../resources/design-icons/welcome-card-icons/transaction.svg";
import ReportsIcon from "../../resources/design-icons/welcome-card-icons/report.svg";
import HoldingsIcon from "../../resources/design-icons/welcome-card-icons/holdings.svg";
import { useNavigate } from "react-router-dom";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
import { formatShortDate } from "../../services/date-formatter";
import Notifications from "../helpers/Notifications";

function ProfessionalUsers(props) {
  const { classes } = props;
  const baseUrl = configData.url.baseURL;
  const professionalUsers = useSelector(
    (state) => state.entities.professionalUsers.users
  );
  const isRefreshClients = useSelector(
    (state) => state.entities.professionalUsers.isRefreshClients
  );
  const professionalUsersState = useSelector(
    (state) => state.entities.professionalUsers
  );
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [importedFile, setFImportedFile] = useState(null);
  const [isSuccessImportClient, setIsSuccessImportClient] = useState(false);
  const [sendReferralEmailDetails, setSendReferralEmailDetails] = useState({});

  // const [coinsMetadata, setCoinsMetadata] = useState([]);
  // const [randomCoin, setRandomCoin] = useState({});

  const [isOpenAvailableCredit, setIsOpenAvailableCredit] = useState(false);
  // const [vouchershistory, setVouchersHistory] = useState({});
  const [allVouchershistory, setAllVouchersHistory] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const statuses = {
    1: "Invitation not sent",
    2: "User Activation Pending",
    3: "Active",
  };
  const handelSuccessImportClose = () => {
    setIsSuccessImportClient(false);
  };
  const handleAddDialogYes = (quickInvitees) => {
    setIsAddClientModalOpen(false);
    if (importedFile) {
      let formData = new FormData();
      let token = "bearer " + localStorage.getItem("token");
      formData.append("file", importedFile);

      axios
        .post(`${baseUrl}/users/multiple-invitation`, formData, {
          headers: { authorization: token },
        })
        .then((res) => {
          setIsSuccessImportClient(true);
          setFImportedFile(null);
        })
        .catch((err) => {
          console.log(err);
          setFImportedFile(null);
        });
    }
    if (quickInvitees.length) {
      dispatch(postQuickInvites(quickInvitees));
    }
  };

  useEffect(() => {
    dispatch(getClients());
    // axios
    //   .get(
    //     "https://api.nomics.com/v1/currencies/ticker?key=7d821c586855f346a933a90d34b4f9af2fa22591"
    //   )
    //   .then((res) => {
    //     setCoinsMetadata(res.data);
    //     setRandomCoin(
    //       res.data[Math.floor(res.data.length - 1 * Math.random())]
    //     );
    //     console.log(res.data[Math.floor(res.data.length - 1 * Math.random())]);
    //   });
    // axios
    //   .get(baseUrl + "/vouchersHistory/vouchers/2022-2023", {
    //     headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
    //   })
    //   .then((res) => {
    //     setVouchersHistory(res.data);
    //   })
    //   .catch(() => {
    //     setVouchersHistory({ available: 0, total: 0 });
    //   });

    axios
      .get(baseUrl + "/ledgers", {
        headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setAllVouchersHistory(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isRefreshClients) {
      dispatch(getClients());
    }
  }, [isRefreshClients]);
  return (
    <div className={classes.root}>
      <Notifications
        open={isSuccessImportClient}
        onClose={handelSuccessImportClose}
        message={"Invites have been send to clients successfully!"}
      />
      <Notifications
        open={professionalUsersState.isErrorPostingQuickInvitees}
        message={"Email already exists"}
      />

      <div className={classes.BigButtonsContainer}>
        <BigButtonCard
          icon="AddClient.svg"
          backgroundColor="#0074CB"
          backgroundColorHover="#3486c3"
          headerText="Add Client"
          headerTextColor="white"
          bodyText={"Total Clients : " + professionalUsers.length}
          bodyTextColor="white"
          handleClick={() => {
            setIsAddClientModalOpen(true);
          }}
        />
        <BigButtonCard
          icon="clients.svg"
          backgroundColor="#10a575"
          backgroundColorHover="#10a575"
          headerText="Credits History"
          headerTextColor="white"
          bodyText={
            "Total available credits : " +
            (allVouchershistory[0]?.balance
              ? allVouchershistory[0]?.balance
              : "-")
          }
          bodyTextColor="white"
          handleClick={() => {
            setIsOpenAvailableCredit(true);
          }}
        />
        {/* <BigButtonCard
          icon="clients.svg"
          backgroundColor="#10a575"
          backgroundColorHover="#10a575"
          headerText={randomCoin.currency}
          headerTextColor="white"
          bodyText={roundNumberDecimal(Number(randomCoin.price), 3) + " USD"}
          bodyTextColor="white"
        /> */}
      </div>

      <Paper className={classes.content} elevation={0}>
        <Table className={classes.table}>
          <TableRow className={classes.tableRow}>
            <TableCell></TableCell>
            {/* <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell> */}
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Quick links</TableCell>
            <TableCell>No. of Transactions</TableCell>
            {/* <TableCell>Portfolio Value</TableCell> */}
            <TableCell>Data Feeds</TableCell>
            <TableCell>Managed By</TableCell>
          </TableRow>
          <TableBody>
            {professionalUsers.map((user) => (
              <TableRow className={classes.tableRowData}>
                <TableCell className={classes.alignCenter}>
                  <Avatar src={"image-url-here"} alt={user.firstName} />
                </TableCell>{" "}
                {/* <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell> */}
                <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                <TableCell
                  className={
                    user.status === 1
                      ? classes.statusActivate
                      : classes.statusActive
                  }
                  onClick={() => {
                    if (user.status === 1) setSendReferralEmailDetails(user);
                  }}
                >
                  {statuses[user.status]}
                </TableCell>{" "}
                <TableCell align="center">
                  <Tooltip title={"Holdings"} arrow>
                    <img
                      src={HoldingsIcon}
                      alt={"H"}
                      className={classes.quickLinksIcons}
                      onClick={() => {
                        navigate(`/holdings/${user.firstName}/${user.email}`);
                        localStorage.setItem(
                          "navRoute",
                          `holdings/${user.firstName}/${user.email}`
                        );
                        // dispatch(
                        //   changeSubNavBar(
                        //     `holdings/${user.firstName}/${user.email}`
                        //   )
                        // );
                        dispatch(changeSubNavBar(`holdings`));
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={"Integrations"} arrow>
                    <img
                      src={IntegrationsIcon}
                      alt={"integrations-icon"}
                      className={classes.quickLinksIcons}
                      onClick={() => {
                        navigate(
                          `/integrations/${user.firstName}/${user.email}`
                        );
                        localStorage.setItem(
                          "navRoute",
                          `integrations/${user.firstName}/${user.email}`
                        );
                        dispatch(changeSubNavBar(`integrations`));
                        // dispatch(
                        //   changeSubNavBar(
                        //     `integrations/${user.firstName}/${user.email}`
                        //   )
                        // );
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={"Transactions"} arrow>
                    <img
                      src={TransactionsIcon}
                      alt={"transactions-icon"}
                      className={classes.quickLinksIcons}
                      onClick={() => {
                        navigate(
                          `/transactions/${user.firstName}/${user.email}`
                        );
                        localStorage.setItem(
                          "navRoute",
                          `transactions/${user.firstName}/${user.email}`
                        );
                        dispatch(changeSubNavBar(`transactions`));
                        // dispatch(
                        //   changeSubNavBar(
                        //     `transactions/${user.firstName}/${user.email}`
                        //   )
                        // );
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={"Reports"} arrow>
                    <img
                      src={ReportsIcon}
                      alt={"reports-icon"}
                      className={classes.quickLinksIcons}
                      onClick={() => {
                        navigate(`/reports/${user.firstName}/${user.email}`);
                        localStorage.setItem(
                          "navRoute",
                          `reports/${user.firstName}/${user.email}`
                        );
                        dispatch(
                          changeSubNavBar(
                            `reports/${user.firstName}/${user.email}`
                          )
                        );
                        dispatch(changeSubNavBar(`reports`));
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {user?.transactionCount > 0 ? user?.transactionCount : "-"}
                </TableCell>
                {/* <TableCell>
                  <div className={classes.italics}>Not Available</div>
                </TableCell> */}
                <TableCell>
                  {user?.exchanges.length > 0
                    ? user.exchanges.map((feed) => {
                        return (
                          <img
                            className={classes.platformIcon}
                            src={getPlatformImageByName(feed)}
                            alt={feed}
                          />
                        );
                      })
                    : "-"}
                </TableCell>
                <TableCell>{user.managedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AddClientDialog
        openAlert={isAddClientModalOpen}
        handleCancel={() => {
          setIsAddClientModalOpen(false);
        }}
        handleYes={handleAddDialogYes}
        browsedFile={importedFile}
        setBrowsedFile={setFImportedFile}
      />
      <Dialog open={Object.keys(sendReferralEmailDetails).length}>
        <DialogTitle>Send Referral Email?</DialogTitle>
        <DialogContent>
          Do you want to send email to {sendReferralEmailDetails.firstName} on{" "}
          {sendReferralEmailDetails.email}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSendReferralEmailDetails({});
            }}
            className={classes.btnCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              dispatch(sendReferralEmail(sendReferralEmailDetails.email));
              setSendReferralEmailDetails({});
            }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isOpenAvailableCredit}>
        <DialogTitle>Available Credit</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableCell>S No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Debit/Credit</TableCell>
              <TableCell>Balance</TableCell>
            </TableHead>
            <TableBody>
              {allVouchershistory.map((voucher, idx) => {
                return (
                  <TableRow>
                    <TableCell>{+idx + 1}</TableCell>

                    <TableCell>
                      {formatShortDate(new Date(+voucher.date))}
                    </TableCell>
                    <TableCell>
                      {voucher.user === null
                        ? "Payment Credits"
                        : voucher.user?.email}
                    </TableCell>
                    <TableCell>
                      {voucher.credit ? "+" + voucher.credit : "-1"}
                    </TableCell>
                    <TableCell>{voucher.balance}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsOpenAvailableCredit(false);
            }}
            className={classes.btnCancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default withStyles(styles)(ProfessionalUsers);
