import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { withStyles } from "@mui/styles";
import configData from "../../config.json";
import styles from "../../resources/styles/helpers-styles/Forms";
import { useDispatch, useSelector } from "react-redux";
import { registerUserViaReferral } from "../../store/auth/auth";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { patchReferrals } from "../../store/professionalUsers/professionalUsers";

function SignUpViaReferral(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setreEnterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [reEntershowPassword, setReEnterShowPassword] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [referrersFirstName, setReferrersFirstName] = useState("");
  const [referrersEmail, setReferrersEmail] = useState("");

  const [referralID, setReferralID] = useState("");
  const [clientID, setClientID] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = configData.role;

  useEffect(() => {
    localStorage.setItem("plan", true);
    localStorage.setItem("token", "");
    localStorage.setItem("loggedIn", false);
  }, []);

  const user = useSelector((state) => state.auth.user);
  const isErrorAuth = useSelector((state) => state.auth.isError);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);

  useEffect(() => {
    if (isLoggedIn && user.role.shortCode !== "SAU") navigate("/home");
  }, [isLoggedIn]);

  const handelSubmit = (e) => {
    e.preventDefault();
    dispatch(
      registerUserViaReferral(
        email,
        password,
        firstName,
        lastName,
        firstName,
        "+00000-0000000",
        role,
        reEnterPassword,
        referralID,
        clientID
      )
    );
    dispatch(patchReferrals(email));
  };
  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(
        registerUserViaReferral(
          email,
          password,
          firstName,
          lastName,
          "Username",
          "+00000-0000000",
          role,
          reEnterPassword,
          referralID,
          clientID
        )
      );
    }
    dispatch(patchReferrals(email));
  };

  useEffect(() => {
    localStorage.setItem("plan", true);
    localStorage.clear("token");
    localStorage.clear("loggedIn");
    const path = window.location.pathname.split("/");
    setReferrersEmail(path[path.length - 1]);
    setReferrersFirstName(path[path.length - 2].split("%")[0]);
    setClientID(path[path.length - 3]);
    setReferralID(path[path.length - 4]);
    setEmail(path[path.length - 5]);
    setLastName(path[path.length - 6]);
    setFirstName(path[path.length - 7]);
  }, []);

  const { classes } = props;

  // Object.keys(user).length && navigate("/");

  return (
    <div className={classes.signInPage}>
      <div className={classes.ctvBigLogo} />
      <Snackbar
        open={isErrorAuth}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          width: {
            xs: "80%",
            sm: "65%",
            md: "45%",
            lg: "40%",
            xl: "30%",
          },
        }}
        className={classes.grid}
      >
        <Paper
          className={classes.paper}
          sx={{
            height: {
              md: "71%",
              xl: "auto",
            },
          }}
        >
          <form onSubmit={handelSubmit} className={classes.form}>
            <Box className={classes.Box}>
              <h1 className={classes.signInHeading}>Sign Up</h1>
              <Typography className={classes.signInText}>
                Welcome to CryptoTaxView
              </Typography>
              <Typography className={classes.signInTextOnReferrals}>
                {referrersFirstName + " ( " + referrersEmail + " )"} has invited
                you to signup
              </Typography>
              <Typography className={classes.signInTextOnReferrals}>
                Create your account by filling the form below
              </Typography>

              <span style={{ marginBottom: "15px" }} />

              <Box className={classes.eyeIconBox}>
                <TextField
                  id="SignUpPassword"
                  className={classes.textfields}
                  inputProps={{
                    autocomplete: "new-password",
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  type={showPassword ? "password" : "text"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={_handleKeyDown}
                />
                <span
                  className={classes.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityIcon style={{ color: "#406980" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "#406980" }} />
                  )}
                </span>
              </Box>
              <Box className={classes.eyeIconBox}>
                <TextField
                  id="SignUpPasswordReEnter"
                  className={classes.textfields}
                  type={reEntershowPassword ? "password" : "text"}
                  placeholder="Re-enter Password"
                  required
                  value={reEnterPassword}
                  onChange={(e) => setreEnterPassword(e.target.value)}
                  onKeyDown={_handleKeyDown}
                />
                <span
                  className={classes.eyeButton}
                  onClick={() => setReEnterShowPassword(!reEntershowPassword)}
                >
                  {reEntershowPassword ? (
                    <VisibilityIcon style={{ color: "#406980" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "#406980" }} />
                  )}
                </span>
              </Box>
              <Box className={classes.checkForgotPart}>
                <div className={classes.rememberMeContainer}>
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={<Checkbox />}
                    label=""
                  />
                  <span className={classes.rememberMeText}> Remember Me</span>
                </div>
                <span className={classes.forgotPassword}>Forgot password?</span>
              </Box>
              <Button
                variant="contained"
                className={classes.signInButton}
                onClick={handelSubmit}
                id="btn-sign-up"
              >
                Sign Up
              </Button>
              <Box className={classes.notAMember}>
                <p className={classes.notAMemberText}>
                  Already have an account?{" "}
                </p>
                <Link to="/" className={classes.signInAnchor}>
                  Sign In
                </Link>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
      <p className={classes.copyright}>
        Copyright&nbsp;&copy;&nbsp;{new Date().getFullYear()} CryptoTaxView
      </p>
    </div>
  );
}

export default withStyles(styles)(SignUpViaReferral);
//873f2126-d2d3-4f7b-a897-f9ccfb7d5cd3
