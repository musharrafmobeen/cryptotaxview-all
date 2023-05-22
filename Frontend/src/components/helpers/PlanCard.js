import { makeStyles } from "@mui/styles";
import { getPlanIcon } from "../../services/importDynamicIcons";

import DoneIcon from "@mui/icons-material/Done";

import config from "../../config.json";

import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";
import axios from "axios";
import configData from "../../config.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticateAlreadySignedInUser } from "../../store/auth/auth";
import { IconButton, Snackbar } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { roundNumberDecimal } from "../../services/roundNumberDecimal";
import { changeSubNavBar } from "../../store/ui/pageSubNavBar";

function PlanCard(props) {
  const {
    plan,
    changeSelection,
    selected,
    id,
    name,
    amount,
    financialYear,
    isHandlingPayment,
    planStatus,
    selectedPlanType,
  } = props;

  const font = {
    fontFamily: "Roboto",
    letterSpacing: "0.5px",
  };

  const fontHeavy = {
    fontWeight: "800",
  };

  const fontSizeXLarge = {
    fontSize: "43px",
  };

  const fontSizeLarge = {
    fontSize: "25px",
  };

  // const fontSizeMedium = {
  //   fontSize: "18px",
  // };

  const fontSizeSmall = {
    fontSize: "12px",
  };

  const dynamicStyles = makeStyles({
    // headerText: {
    //   fontFamily: "Roboto",
    //   fontWeight: "900",
    //   fontSize: "35px",
    //   color: headerTextColor,
    // },
    container: {
      margin: "0px 5px 0px 5px",

      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
    },
    iconContainer: {
      position: "relative",
      top: "35px",
    },
    contentContainerInActive: {
      backgroundColor: plan.backgroundColorTile,
      width: "300px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      // color: "white",
      minHeight: "460px",
      border: `1px solid ${plan.borderColor}`,
      boxShadow: "-2px 7px 25px -11px rgba(0,0,0,0.75)",
    },
    contentContainerActive: {
      backgroundColor: plan.backgroundColorTileAlt,
      color: plan.colorAlt,
      width: "300px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",

      minHeight: "460px",
      border: `1px solid ${plan.borderColor}`,
      boxShadow: "-2px 7px 25px -11px rgba(0,0,0,0.75)",
    },
    title: {
      ...font,
      ...fontSizeLarge,

      marginTop: "60px",
    },
    price: {
      ...font,
      ...fontSizeXLarge,

      marginTop: "20px",
    },
    planFeaturesContainer: {
      width: "75%",
    },
    planFeatures: {
      ...font,
      ...fontSizeSmall,
      ...fontHeavy,

      marginTop: "35px",
    },
    featureContainer: {
      ...font,
      ...fontSizeSmall,

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: "10px",
    },
    featureText: {
      display: "flex",
      alignItems: "center",
    },
    featureValue: {
      ...fontHeavy,
    },
    description: {
      ...font,
      ...fontSizeSmall,

      lineHeight: "25px",
      marginTop: "40px",
      display: "flex",
      width: "70%",
    },
    buttonInActive: {
      ...font,
      border: `1px solid ${plan.borderColor}`,
      backgroundColor: plan.buttonSubmitColorBackground,
      color: plan.buttonSubmitColor,
      width: "99.5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "15px 0px 15px 0px",
      borderTop: "1px solid white",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      cursor: "pointer",
      boxShadow: "-2px 7px 25px -11px rgba(0,0,0,0.75)",
    },
    buttonActive: {
      ...font,
      border: `1px solid ${plan.borderColor}`,
      backgroundColor: plan.buttonSubmitColorBackgroundAlt,
      color: plan.buttonSubmitColorAlt,
      width: "99.5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "15px 0px 15px 0px",
      borderTop: "1px solid white",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      cursor: "pointer",
      boxShadow: "-2px 7px 25px -11px rgba(0,0,0,0.75)",
    },
  });

  const dynamicClasses = dynamicStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [handlingErrorPaymentMsg, setHandlingErrorPaymentMsg] = useState("");
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  // const handlePlanClick = async () => {
  //   const stripePromise = await loadStripe(config.stripeKey);
  // };
  const handleToken = (stripeData) => {
    isHandlingPayment(true, "");
    let token = "bearer " + localStorage.getItem("token");
    if (selectedPlanType === "personal")
      axios
        .post(
          `${configData.url.baseURL}/payments/`,
          {
            token: stripeData.id,
            paymentPlan: id,
            financialYear,
            type: selectedPlanType,
          },
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          isHandlingPayment(true, "Success");
          setTimeout(() => {
            isHandlingPayment(false, "");
            dispatch(
              authenticateAlreadySignedInUser(localStorage.getItem("token"))
            );
            localStorage.setItem("navRoute", "reports");
            if (isPersonalPlan) {
              navigate("/reports");
              dispatch(changeSubNavBar("reports"));
            } else if (window.location.href.split("/").length > 5) {
              navigate(
                `/reports/${
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 2
                  ]
                }/${
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 1
                  ]
                }`
              );
              dispatch(changeSubNavBar("reports"));
            } else {
              navigate(`/home`);
              dispatch(changeSubNavBar("home"));
            }
          }, 5000);
        })
        .catch((err) => {
          isHandlingPayment(false, err.response.data.message);
          setHandlingErrorPaymentMsg(err.response.data.message);
        });
    else
      axios
        .post(
          `${configData.url.baseURL}/payments/professional`,
          {
            token: stripeData.id,
            paymentPlan: id,
            type: selectedPlanType,
          },
          {
            headers: { authorization: token },
          }
        )
        .then((res) => {
          isHandlingPayment(true, "Success");
          setTimeout(() => {
            isHandlingPayment(false, "");
            dispatch(
              authenticateAlreadySignedInUser(localStorage.getItem("token"))
            );
            localStorage.setItem("navRoute", "reports");
            if (isPersonalPlan) {
              navigate("/reports");
              dispatch(changeSubNavBar("reports"));
            } else if (window.location.href.split("/").length > 5) {
              navigate(
                `/reports/${
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 2
                  ]
                }/${
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 1
                  ]
                }`
              );
              dispatch(changeSubNavBar("reports"));
            } else {
              navigate(`/home`);
              dispatch(changeSubNavBar("home"));
            }
          }, 5000);
        })
        .catch((err) => {
          isHandlingPayment(false, err.response.data.message);
          setHandlingErrorPaymentMsg(err.response.data.message);
        });
  };

  return (
    <div
      className={dynamicClasses.container}
      onClick={() => {
        changeSelection(id);
      }}
    >
      <Snackbar
        open={handlingErrorPaymentMsg.length > 0}
        onClose={() => {
          setHandlingErrorPaymentMsg("");
        }}
        message={handlingErrorPaymentMsg}
        action={
          <>
            <IconButton
              onClick={() => {
                setHandlingErrorPaymentMsg("");
              }}
              style={{ color: "white" }}
            >
              <CancelIcon />
            </IconButton>
          </>
        }
      />

      <div className={dynamicClasses.iconContainer}>
        <img alt={plan.icon} src={getPlanIcon(plan.icon)} />
      </div>
      <div
        className={
          id === selected
            ? dynamicClasses.contentContainerActive
            : dynamicClasses.contentContainerInActive
        }
      >
        <div className={dynamicClasses.title}>{plan.title}</div>
        <div className={dynamicClasses.price}>
          {plan.priceCurrency}
          {roundNumberDecimal(Number(plan.priceValue), 4)}
        </div>
        <div className={dynamicClasses.planFeaturesContainer}>
          <div className={dynamicClasses.planFeatures}>Plan Features</div>
          {plan.planFeatures.map((plan) => {
            return (
              <div className={dynamicClasses.featureContainer}>
                <div className={dynamicClasses.featureText}>
                  <DoneIcon color="success" style={{ marginRight: "5px" }} />
                  {plan.text}
                </div>
                <div className={dynamicClasses.featureValue}>{plan.value}</div>
              </div>
            );
          })}
        </div>
        <div className={dynamicClasses.description}>{plan.description}</div>
      </div>
      {/* <div
        className={
          plan.id === selected
            ? dynamicClasses.buttonActive
            : dynamicClasses.buttonInActive
        }
        onClick={() => {
          handlePlanClick();
        }}
      >
        {plan.buttonSubmitText}
        <StripeCheckout
          stripeKey={config.stripeKey}
          token={handleToken}
          name="buy"
        ></StripeCheckout>
      </div> */}
      <div style={{ width: "100%" }}>
        <StripeCheckout
          stripeKey={config.stripeKey}
          token={handleToken}
          name={name}
          currency="AUD"
          amount={amount}
          image={configData["cloud-hosted-ctv-logo-url"]}
        >
          <div
            className={
              id === selected
                ? dynamicClasses.buttonActive
                : dynamicClasses.buttonInActive
            }
          >
            {planStatus}
          </div>
        </StripeCheckout>
      </div>
    </div>
  );
}
export default PlanCard;
