// import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../resources/styles/views-styles/PricingAndPlanStyles";
// import {
//   MASTER_PERSONAL_PLAN,
//   MASTER_PROFESSIONAL_PLAN,
// } from "../../services/pricingAndPlanService";
import PlanCard from "../helpers/PlanCard";
import configData from "../../config.json";
import { getFinancialYears } from "../../services/getFinancialYears";
import processingPayment from "../../resources/design-icons/plan-icons/processingPayment.gif";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

function PricingAndPlan(props) {
  const { classes } = props;
  const navigate = useNavigate();
  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const [selectedPlanType, setSelectedPlanType] = useState(
    `${isPersonalPlan ? "personal" : "professional"}`
  );

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isProcessingPaymentMsg, setIsProcessingPaymentMsg] = useState("");

  // const user = useSelector((state) => state.auth.user);

  const handleChangeSelection = (value) => {
    setSelectedPlan(value);
  };

  useEffect(() => {
    let currMonth = new Date().getMonth();
    let startYear =
      currMonth < 5 ? new Date().getFullYear() - 1 : new Date().getFullYear();
    let endYear =
      currMonth < 5 ? new Date().getFullYear() : new Date().getFullYear() + 1;

    setFinancialYear(startYear + "-" + endYear);
  }, []);

  useEffect(() => {
    axios
      .get(configData.url.baseURL + "/payment-plans/" + financialYear, {
        headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPlans(res.data);
        if (
          res.data.filter(
            (plan) => plan.type === selectedPlanType && plan.status === 1
          ).length
        ) {
          setSelectedPlan(
            res.data.filter(
              (plan) => plan.status === 1 && plan.type === selectedPlanType
            )[0]?.id
          );
        } else {
          setSelectedPlan(
            res.data.filter((plan) => plan.type === selectedPlanType)[0]?.id
          );
        }
      })
      .catch((e) => {});
  }, [financialYear]);

  return (
    <div className={classes.root}>
      {isProcessingPayment ? (
        <div className={classes.paymentContainer}>
          <div style={{ position: "absolute", top: "50px", color: "green" }}>
            Processing Payment {isProcessingPaymentMsg}
          </div>
          <div style={{ position: "absolute", top: "10px", color: "orange" }}>
            Please do not switch page!
          </div>
          <img
            className={classes.paymentImage}
            src={processingPayment}
            alt={"Processing Payment"}
          />
        </div>
      ) : (
        <></>
      )}
      <div className={classes.headerContent}>
        <div
          className={classes.homeBackBtn}
          onClick={() => {
            navigate("/home");
          }}
        >
          <ArrowBackIos /> Home
        </div>
      </div>
      <div className={classes.bodyContent}>
        <div className={classes.title}> Pricing & Plan</div>
        <div className={classes.titleDetails}>
          Simple pricing, No hidden fees, Advanced features for your Crypto Tax
          Calculation
        </div>
        <div className={classes.planContainer}>
          <div
            className={
              selectedPlanType === "personal"
                ? classes.personal
                : classes.personalAlt
            }
            onClick={() => {
              setSelectedPlanType("personal");
            }}
          >
            Personal
          </div>
          <div
            className={
              selectedPlanType === "professional"
                ? classes.professional
                : classes.professionalAlt
            }
            onClick={() => {
              setSelectedPlanType("professional");
            }}
          >
            Professional
          </div>
        </div>
        {selectedPlanType === "personal" ? (
          <div className={classes.financialYearRow}>
            <label className={classes.label}>Financial Year</label>
            <select
              value={financialYear}
              className={classes.select}
              onChange={(e) => setFinancialYear(e.target.value)}
            >
              <option disabled selected value={null}>
                Select Financial Year
              </option>
              {getFinancialYears().map((year) => {
                return <option value={year.value}>{year.label}</option>;
              })}
            </select>
          </div>
        ) : (
          <></>
        )}
        <div className={classes.plansContainer}>
          {selectedPlanType === "personal"
            ? plans
                .filter((plan) => plan.type === "personal")
                .map((plan) => {
                  return (
                    <PlanCard
                      name={plan.name}
                      amount={plan.price * 100}
                      plan={plan.info}
                      id={plan.id}
                      selected={selectedPlan}
                      changeSelection={handleChangeSelection}
                      financialYear={financialYear}
                      isHandlingPayment={(value, msg) => {
                        setIsProcessingPayment(value);
                        setIsProcessingPaymentMsg(msg);
                      }}
                      planStatus={
                        plan.info.title === "FREE"
                          ? "-"
                          : plan.status
                          ? "Active"
                          : "Activate"
                      }
                      selectedPlanType={selectedPlanType}
                    />
                  );
                })
            : plans
                .filter((plan) => plan.type === "professional")
                .map((plan) => {
                  return (
                    <PlanCard
                      name={plan.name}
                      amount={plan.price * 100}
                      plan={plan.info}
                      id={plan.id}
                      selected={selectedPlan}
                      changeSelection={handleChangeSelection}
                      financialYear={financialYear}
                      isHandlingPayment={(value, msg) => {
                        setIsProcessingPayment(value);
                        setIsProcessingPaymentMsg(msg);
                      }}
                      planStatus={
                        plan.info.title === "FREE"
                          ? "-"
                          : plan.status
                          ? "Active"
                          : "Activate"
                      }
                      selectedPlanType={selectedPlanType}
                    />
                  );
                })}
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(PricingAndPlan);
