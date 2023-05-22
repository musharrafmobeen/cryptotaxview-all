import {
  Paper,
  TextField,
  Typography,
  Box,
  Button,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import styles from "../../resources/styles/helpers-styles/ProfilePage";
import { withStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { saveProfileChange } from "../../store/auth/auth";
import { saveEmailChange } from "../../store/auth/auth";
import { resetProfileSave } from "../../store/auth/auth";
import { resetEmailSave } from "../../store/auth/auth";
import { resetEmailSaveError } from "../../store/auth/auth";

import { resetProfileSaveError } from "../../store/auth/auth";
import axios from "axios";
import configData from "../../config.json";
import { formatDateTransactionsTable } from "../../services/date-formatter";

function ProfilePage(props) {
  const originalFirstName = useSelector(
    (state) => state.auth.user.profile.firstName
  );
  const originalLastName = useSelector(
    (state) => state.auth.user.profile.lastName
  );
  const errorMessageProfileSave = useSelector(
    (state) => state.auth.errorMessageProfileSave
  );
  const isErrorProfileSave = useSelector(
    (state) => state.auth.isErrorProfileSave
  );
  const isErrorEmailSave = useSelector((state) => state.auth.isErrorEmailSave);
  const errorMessageEmailSave = useSelector(
    (state) => state.auth.errorMessageEmailSave
  );
  const emailSave = useSelector((state) => state.auth.emailSave);
  const profileSave = useSelector((state) => state.auth.profileSave);

  const originalEmail = useSelector((state) => state.auth.user.email);
  const profileId = useSelector((state) => state.auth.user.profile.id);
  const handelEmailOpen = () => {
    setEmailOpen(true);
  };
  const [invoices, setInvoices] = useState([]);
  const [firstName, setFirstName] = useState(originalFirstName);
  const [lastName, setLastName] = useState(originalLastName);
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState(originalEmail);
  const [updateEmail, setUpdateEmail] = useState(originalEmail);
  const [account, setAccount] = useState(true);
  const [openEmail, setEmailOpen] = useState(false);

  const dispatch = useDispatch();

  const { classes } = props;
  const handelEmailClose = () => {
    setEmailOpen(false);
  };

  const handelSubmit = () => {
    dispatch(saveProfileChange(firstName, lastName, profileId));
  };
  const handelEmialUpdate = () => {
    dispatch(saveEmailChange(email, password, updateEmail));
    setEmailOpen(false);
  };
  const handelSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(resetProfileSave());
    dispatch(resetEmailSave());
    dispatch(resetEmailSaveError());
    dispatch(resetProfileSaveError());
  };
  useEffect(() => {
    axios
      .get(configData.url.baseURL + "/invoice/user", {
        headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setInvoices(res.data);
      });
  }, []);
  return (
    <div className={classes.body}>
      <Container className={classes.container}>
        <Grid container sx={{ marginTop: "80px" }}>
          <Grid item xs={3}>
            <Box className={classes.nav}>
              <Typography
                className={account ? classes.activeLink : classes.link}
                onClick={() => setAccount(true)}
              >
                My account
              </Typography>
              <Typography
                className={account ? classes.link : classes.activeLink}
                onClick={() => setAccount(false)}
              >
                Invoices
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={9}>
            <Box
              sx={{
                width: {
                  xs: "85%",
                  sm: "75%",
                  md: "75%",
                  lg: "75%",
                  xl: "65%",
                },
              }}
            >
              {account ? (
                <Paper className={classes.paper}>
                  <form className={classes.form}>
                    <Typography
                      variant="h5"
                      sx={{
                        paddingBottom: "17px",
                      }}
                    >
                      Profile settings
                    </Typography>
                    <TextField
                      required
                      size="small"
                      label="First Name"
                      value={firstName}
                      variant="outlined"
                      onChange={(e) => setFirstName(e.target.value)}
                      className={classes.input}
                    />
                    <TextField
                      required
                      size="small"
                      value={lastName}
                      variant="outlined"
                      label="Last Name"
                      onChange={(e) => setLastName(e.target.value)}
                      className={classes.input}
                    />
                    {/* <span
                      className={classes.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </span> */}
                    <Box>
                      <Button onClick={handelEmailOpen}>Change email</Button>
                      <Button>Change password</Button>
                    </Box>
                    <Box className={classes.buttons}>
                      <Button variant="contained" onClick={handelSubmit}>
                        Save
                      </Button>
                    </Box>
                  </form>
                </Paper>
              ) : (
                <Paper className={classes.paper} style={{ width: "950px" }}>
                  <Table>
                    <TableHead>
                      <TableCell>S/No.</TableCell>
                      <TableCell>Date of Invoice</TableCell>
                      <TableCell>Mode of Payment</TableCell>
                      <TableCell>Charged On</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Invoice Amount</TableCell>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice, idx) => {
                        return (
                          <TableRow>
                            <TableCell>{+idx + 1}</TableCell>
                            <TableCell>
                              {formatDateTransactionsTable(
                                invoice.dateOfInvoice
                              )}
                            </TableCell>
                            <TableCell>{invoice.mode.toUpperCase()}</TableCell>
                            <TableCell>
                              {formatDateTransactionsTable(invoice.chargedOn)}
                            </TableCell>
                            <TableCell>
                              {formatDateTransactionsTable(invoice.expiryDate)}
                            </TableCell>
                            <TableCell>{invoice.invoiceAmount / 100}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              )}
              <Dialog open={openEmail} onClose={handelEmailClose}>
                <DialogTitle>Change email</DialogTitle>
                <DialogContent>
                  <form className={classes.form}>
                    <TextField
                      sx={{ marginTop: "7px" }}
                      required
                      size="small"
                      value={password}
                      label="Password"
                      variant="outlined"
                      onChange={(e) => setPassword(e.target.value)}
                      className={classes.input}
                    />
                    {/* <span
                      className={classes.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </span> */}
                    <TextField
                      required
                      size="small"
                      value={email}
                      label="Email"
                      variant="outlined"
                      onChange={(e) => setEmail(e.target.value)}
                      className={classes.input}
                    />
                    <TextField
                      required
                      size="small"
                      value={updateEmail}
                      label="Update Email"
                      variant="outlined"
                      onChange={(e) => setUpdateEmail(e.target.value)}
                      className={classes.input}
                    />
                    <DialogActions
                      sx={{
                        justifyContent: "space-between",
                        padding: "0",
                      }}
                    >
                      {password ? (
                        <Button variant="contained" onClick={handelEmialUpdate}>
                          Save
                        </Button>
                      ) : (
                        <Button
                          disabled
                          variant="contained"
                          onClick={handelEmialUpdate}
                        >
                          Save
                        </Button>
                      )}
                      <Button variant="contained" onClick={handelEmailClose}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
              {/* <Dialog open={openPassword} onClose={handelPasswordClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                  <form className={classes.form}>
                    <TextField
                      sx={{ marginTop: "7px" }}
                      required
                      size="small"
                      value={password}
                      label="Password"
                      variant="outlined"
                      onChange={(e) => setPassword(e.target.value)}
                      className={classes.input}
                    />
                    <span
                      className={classes.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </span>
                    <TextField
                      required
                      size="small"
                      value={email}
                      label="Email"
                      variant="outlined"
                      onChange={(e) => setEmail(e.target.value)}
                      className={classes.input}
                    />
                    <TextField
                      required
                      size="small"
                      value={updateEmail}
                      label="Update Email"
                      variant="outlined"
                      onChange={(e) => setUpdateEmail(e.target.value)}
                      className={classes.input}
                    />
                    <DialogActions
                      sx={{
                        justifyContent: "space-between",
                        padding: "0",
                      }}
                    >
                      <Button variant="contained" onClick={handelEmialUpdate}>
                        Save
                      </Button>
                      <Button variant="contained" onClick={handelEmailClose}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog> */}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={profileSave}
        autoHideDuration={6000}
        onClose={handelSnackbarClose}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          Update Successfull
        </Alert>
        {/* <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handelSnackbarClose}
        > */}
        {/* <CloseIcon fontSize="small" /> */}
        {/* </IconButton> */}
      </Snackbar>
      <Snackbar
        open={emailSave}
        autoHideDuration={6000}
        onClose={handelSnackbarClose}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          Email Updated
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorProfileSave}
        autoHideDuration={6000}
        onClose={handelSnackbarClose}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          {errorMessageProfileSave?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorEmailSave}
        autoHideDuration={6000}
        onClose={handelSnackbarClose}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "large",
          }}
        >
          {errorMessageEmailSave?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default withStyles(styles)(ProfilePage);
