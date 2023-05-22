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
import styles from "../../resources/styles/helpers-styles/Forms";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser, signInUpByGoogle } from "../../store/auth/auth";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import googleIcon from "./../../resources/design-images/google-icon.svg";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";
import { resetAuthIsError } from "../../store/auth/auth";

import { useGoogleLogin } from "@react-oauth/google";

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const isErrorAuth = useSelector((state) => state.auth.isError);
  const isLoggedIn = useSelector((state) => state.auth.loggedIn);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => setTokenResponse(tokenResponse),
    flow: "implicit",
  });
  useEffect(() => {
    localStorage.setItem("plan", true);
    localStorage.setItem("navRoute", "home");
    dispatch(changeSubNavBar("home"));
  }, []);

  useEffect(() => {
    if (tokenResponse?.access_token.length) {
      dispatch(signInUpByGoogle(tokenResponse.access_token));
      localStorage.setItem("navRoute", "home");
    }
  }, [tokenResponse]);

  useEffect(() => {
    if (isLoggedIn && user.role.shortCode !== "SAU") navigate("/home");
    else if (isLoggedIn && user.role.shortCode === "SAU")
      navigate("/admin-home");
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      errorMessage.message === "Login Expired" &&
      errorMessage.statusCode === 419
    ) {
      localStorage.removeItem("token");
    }
  }, [isErrorAuth]);

  const handelSnackbarClose = () => {
    dispatch(resetAuthIsError());
  };

  const { classes } = props;

  const handelSubmit = (e) => {
    e.preventDefault();
    dispatch(authenticateUser(email, password));
    dispatch(changeSubNavBar("home"));
    localStorage.setItem("plan", true);
  };
  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(authenticateUser(email, password));
      localStorage.setItem("plan", true);
    }
  };

  return (
    <div className={classes.signInPage}>
      <div className={classes.ctvBigLogo} />
      <Snackbar
        open={isErrorAuth}
        autoHideDuration={6000}
        onClose={handelSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage.message}
        </Alert>
      </Snackbar>
      {/* <div className={classes.logoBackground}></div> */}
      <Box
        sx={{
          width: {
            xs: "85%",
            sm: "65%",
            md: "45%",
            lg: "40%",
            xl: "30%",
          },
        }}
        className={classes.grid}
      >
        <Paper className={classes.paper}>
          <form onSubmit={handelSubmit} className={classes.form}>
            <Box className={classes.Box}>
              <h1 className={classes.signInHeading}>Sign In</h1>
              <Typography className={classes.signInText}>
                Welcome to CryptoTaxView
              </Typography>
              <Typography className={classes.signInText}>
                Please login with your account information
              </Typography>

              <div
                className={classes.signInWithGoogleBtn}
                onClick={() => login()}
              >
                <img src={googleIcon} alt={"Google"} />
                Sign in with Google
              </div>
              <p className={classes.signInOr}>OR</p>
              <TextField
                // inputProps={{
                //   autocomplete: "new-username",
                //   form: {
                //     autocomplete: "off",
                //   },
                // }}
                id="signInEmail"
                className={classes.textfields}
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={_handleKeyDown}
              />
              <Box className={classes.eyeIconBox}>
                <TextField
                  // inputProps={{
                  //   autocomplete: "new-password",
                  //   form: {
                  //     autocomplete: "off",
                  //   },
                  // }}
                  id="signInPassword"
                  className={classes.textfields}
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
                id="btn-sign-in"
              >
                Sign In
              </Button>
              <Box className={classes.notAMember}>
                <p className={classes.notAMemberText}>Not a member? </p>
                <Link to="/signup" className={classes.signInAnchor}>
                  Sign up
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

export default withStyles(styles)(SignIn);
