import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "../../../resources/styles/helpers-styles/integrations-modals/AlliedAddressesAddDialogStyles";
import axios from "axios";
import configData from "../../../config.json";
import { Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";

function AddIntegrationModal(props) {
  const { classes } = props;
  const { isOpen, handleClose } = props;
  const [alliedAddresses, setAlliedAddresses] = useState([]);

  const [alliedAddress, setAlliedAddress] = useState("");

  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);
  const path = window.location.pathname.split("/");
  const handleAddAlliedAddress = () => {
    if (isPersonalPlan)
      axios
        .post(
          configData.url.baseURL + "/alliedAccounts",
          {
            accountAddress: alliedAddress,
            active: true,
          },
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setAlliedAddresses([...alliedAddresses, res.data]);
          setAlliedAddress("");
        });
    else
      axios
        .post(
          configData.url.baseURL + "/alliedAccounts/" + path[path.length - 1],
          {
            accountAddress: alliedAddress,
            active: true,
          },
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setAlliedAddresses([...alliedAddresses, res.data]);
          setAlliedAddress("");
        });
  };

  const handleDeleteAlliedAddress = (id) => {
    axios
      .delete(
        configData.url.baseURL + "/alliedAccounts/" + id,

        {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setAlliedAddresses(
          alliedAddresses.filter((address) => address.id !== id)
        );
      });
  };

  useEffect(() => {
    if (isPersonalPlan)
      axios
        .get(configData.url.baseURL + "/alliedAccounts", {
          headers: { Authorization: `bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setAlliedAddresses(res.data);
        })
        .catch((e) => {});
    else
      axios
        .get(
          configData.url.baseURL +
            "/alliedAccounts/clients/" +
            path[path.length - 1],
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setAlliedAddresses(res.data);
        })
        .catch((e) => {});
  }, []);

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={isOpen}
        fullWidth
        // maxWidth="md"
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <h2 className={classes.dialogHeading}>Add Allied Addresses</h2>
            <CancelIcon className={classes.closeBtn} onClick={handleClose} />
          </div>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <div>
            <p className={classes.stackHeading}>Allied Accounts</p>
            {!alliedAddresses?.length ? (
              <div className={classes.error}>No Allied Accounts Associated</div>
            ) : (
              <></>
            )}
            {alliedAddresses?.map((address, idx) => {
              return (
                <div className={classes.addressContainer}>
                  <div className={classes.rowCount}>{Number(idx) + 1}.</div>
                  <div className={classes.address}>
                    {address.accountAddress}
                  </div>
                  <div style={{ cursor: "pointer" }}>
                    <Delete
                      color="error"
                      onClick={() => {
                        handleDeleteAlliedAddress(address.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className={classes.stackHeading} style={{ marginTop: "15px" }}>
            Add Allied Account
          </p>
          <div className={classes.inputContainer}>
            <input
              className={classes.input}
              placeholder="Allied Address"
              onChange={(e) => {
                setAlliedAddress(e.target.value);
              }}
              value={alliedAddress}
            />
            <div
              className={
                alliedAddress.length ? classes.submit : classes.submitDisabled
              }
              onClick={() => {
                if (alliedAddress.length) handleAddAlliedAddress();
              }}
            >
              Add
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AddIntegrationModal);
