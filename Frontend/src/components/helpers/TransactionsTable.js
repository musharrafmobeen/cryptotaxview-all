import React, { useEffect, useState } from "react";
import { Checkbox, ListItemText, Divider, Menu } from "@mui/material";

import { roundNumberDecimal } from "../../services/roundNumberDecimal";

import "../../resources/styles/helpers-styles/TransactionTable.css";
import VertIcon from "@mui/icons-material/MoreVert";
import { Grid } from "@mui/material";
import TransactionSubComponent from "./TransactionsSubComponent";
import {
  formatDateTransactionsTable,
  formatRowDateTransactionsTable,
} from "../../services/date-formatter";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import {
  changeTransactionSide,
  changeTransactionSideProfessional,
  modifyOriginalTransactions,
} from "../../store/transactions/transactions";
import { useSelector } from "react-redux";
import {
  getCoinImageByName,
  getPlatformImageByName,
} from "../../services/platform-integration-data";
import { allowedSides, checkAllowedSide } from "../../services/getAllowedSides";

import { changeAllTransactionsState } from "../../store/transactions/transactions";

import EditTransactionDialog from "./EditTransactionDialog";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Tooltip from "@mui/material/Tooltip";
import AnnouncementIcon from "@mui/icons-material/Announcement";
// import { calculateAverageCostBasis } from "../../services/calculateAverageCostBasis";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function TransactionsTable({
  transactions,
  handleDeleteIds,
  // totalCount,
}) {
  const path = window.location.pathname.split("/");
  const handleRowSelection = (id, date) => {
    let reformedData = [];
    let reformedGroupedData = [];

    reformedData = originalData.map((data) => {
      if (data.id === id) {
        return { ...data, isOpen: !data.isOpen };
      }
      return data;
    });
    dispatch(modifyOriginalTransactions(reformedData));
    const dates = [];
    for (let i = 0; i < reformedData.length; i++) {
      const day = reformedData[i].datetime.split("T")[0];
      if (dates.filter((date) => date === day).length === 0) dates.push(day);
    }

    for (let i = 0; i < dates.length; i++) {
      let dateWiseObject = { date: "", data: [] };
      dateWiseObject.date = dates[i];
      dateWiseObject.data = reformedData.filter((data) =>
        data.datetime.includes(dates[i])
      );

      reformedGroupedData.push(dateWiseObject);
    }

    dispatch(changeAllTransactionsState(reformedGroupedData));
    // dispatch(handleCollapsableState(id,date))
    // console.log("object transformed", data);
  };
  const dispatch = useDispatch();

  const [idsToProcess, setIdsToProcess] = useState([]);
  const [groupingIDs, setGroupingIDs] = useState([]);

  const [editIdToProcess, setEditIdToProcess] = useState(null);
  const [selectedSide, setSelectedSide] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [sideMenuAnchor, setSideMenuAnchor] = useState(null);
  // const [isEditSideDialogOpen, setIsEditSideDialogOpen] = useState(false);

  const [trxData, setTrxData] = useState(null);

  const isPersonalPlan = useSelector((state) => state.auth.isPersonalPlan);

  const originalData = useSelector(
    (state) => state.entities.transactions.allTransactionsOriginal
  );

  const isCheckboxSelected = (id) => {
    return idsToProcess.includes(id);
  };

  const isGroupingCheckboxSelected = (id) => {
    return groupingIDs.includes(id);
  };

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
    // console.log(editIdToProcess);
  };
  const openMenuSide = (e) => {
    setSideMenuAnchor(e.currentTarget);
    // console.log(editIdToProcess);
  };

  const handleEditDialogCancel = () => {
    setIsEditDialogOpen(false);
  };
  const handleEditDialogYes = (rate) => {
    setIsEditDialogOpen(false);
    if (isPersonalPlan)
      dispatch(
        changeTransactionSide(editIdToProcess, { priceInAud: parseFloat(rate) })
      );
    else
      dispatch(
        changeTransactionSideProfessional(
          editIdToProcess,
          { priceInAud: parseFloat(rate) },
          path[path.length - 1]
        )
      );
  };

  const handleGroupingCheckbox = (data) => {
    const ids = data.map((d) => d.id);

    let filteredIDs = idsToProcess;
    for (const id of ids) {
      filteredIDs = filteredIDs.filter((idTP) => idTP !== id);
    }

    setIdsToProcess(filteredIDs);
    let idAlreadyPresent = false;
    for (let i = 0; i < idsToProcess.length; i++) {
      if (data.filter((d) => d.id === idsToProcess[i]).length) {
        idAlreadyPresent = true;
      }
    }

    if (!idAlreadyPresent) {
      const groupingIDs = [...idsToProcess];
      for (let i = 0; i < data.length; i++) {
        groupingIDs.push(data[i].id);
      }

      setIdsToProcess(groupingIDs);
    }
  };

  useEffect(() => {
    handleDeleteIds(idsToProcess);
  }, [idsToProcess]);

  return (
    <>
      <Grid container className="custom-container-full-width table-scrollable">
        {transactions.map((transaction) => {
          return (
            <Grid item xs={12}>
              <Grid item xs={12}>
                <div className="grouping-container">
                  <div className="grouping-checkbox-container">
                    <Checkbox
                      checked={isGroupingCheckboxSelected(transaction.date)}
                      onClick={(e) => {
                        handleGroupingCheckbox(transaction.data);
                        if (
                          groupingIDs.filter((id) => id === transaction.date)
                            .length
                        ) {
                          setGroupingIDs(
                            groupingIDs.filter((id) => id !== transaction.date)
                          );
                        } else {
                          setGroupingIDs([...groupingIDs, transaction.date]);
                        }
                      }}
                      // checked={isCheckboxSelected(trx.id)}
                      // id="table-row-checkbox"
                      // className="grouping-checkbox"
                      //   onClick={(e) => {
                      //     if (idsToProcess.filter((id) => id === trx.id).length) {
                      //       setIdsToProcess(
                      //         idsToProcess.filter((id) => id !== trx.id)
                      //       );
                      //     } else setIdsToProcess([...idsToProcess, trx.id]);
                      //   }
                      // }
                    />
                  </div>
                  <div className="table-date-heading">
                    <p>{formatDateTransactionsTable(transaction.date)} </p>
                  </div>
                  <div className="table-transaction-count">
                    <p> {transaction.data.length + " Transactions"}</p>
                  </div>
                </div>
              </Grid>
              <div className="table-group-row">
                <Grid item xs={12}>
                  {transaction.data.map((trx, id) => {
                    return (
                      <>
                        <div
                          className={`${
                            trx.isError
                              ? "table-row-error"
                              : id % 2 === 0
                              ? "table-row"
                              : "table-row-light"
                          }`}
                          onClick={(e) => {
                            // console.log(trx.id);
                            let target = e.target.id;
                            // console.log(e.target.id);

                            if (
                              target !== "table-row-checkbox" &&
                              target !== "table-row-details-container" &&
                              target !== "table-row-details-icon" &&
                              target !== "table-row-details-container-side" &&
                              target !==
                                "table-row-details-container-side-text" &&
                              target !== "table-row-details-container-side-icon"
                            )
                              handleRowSelection(trx.id, transaction.date);
                          }}
                        >
                          <div className="sub-grouping-container">
                            <Grid
                              container
                              className="custom-container-full-width"
                              display={"row"}
                              justifyContent={"flex-start"}
                              alignItems={"center"}
                            >
                              <Grid
                                item
                                container
                                md={2}
                                xs={6}
                                alignItems={"center"}
                              >
                                <Checkbox
                                  checked={isCheckboxSelected(trx.id)}
                                  id="table-row-checkbox"
                                  className="margin-left-short"
                                  onClick={(e) => {
                                    if (
                                      idsToProcess.filter((id) => id === trx.id)
                                        .length
                                    ) {
                                      setIdsToProcess(
                                        idsToProcess.filter(
                                          (id) => id !== trx.id
                                        )
                                      );
                                    } else
                                      setIdsToProcess([
                                        ...idsToProcess,
                                        trx.id,
                                      ]);
                                  }}
                                />
                                <img
                                  src={getPlatformImageByName(trx.exchange)}
                                  alt={trx.exchange}
                                  className="margin-left-short"
                                />
                                <span className="capitalize-text bold-text margin-left-short">
                                  {" "}
                                  {trx.exchange}
                                </span>{" "}
                                <span className="margin-left-short">
                                  {formatRowDateTransactionsTable(trx.datetime)}
                                </span>
                              </Grid>
                              <Grid item md={2} xs={6}>
                                <div
                                  className="side-custom"
                                  id="table-row-details-container-side"
                                  onClick={(e) => {
                                    setEditIdToProcess(trx.id);
                                    setSelectedSide(trx.side);
                                    setTrxData(trx);
                                    openMenuSide(e);
                                  }}
                                >
                                  <p
                                    className="capitalize-text bold-text"
                                    id="table-row-details-container-side-text"
                                  >
                                    {trx.side}
                                  </p>

                                  <KeyboardArrowDown id="table-row-details-container-side-icon" />
                                </div>
                              </Grid>
                              <Grid item md={2} xs={6}>
                                {trx.symbol.split("/").length > 1 ? (
                                  <div className="assets-container">
                                    <img
                                      className="crypto-icon"
                                      src={getCoinImageByName(
                                        trx.assetTraded.toLowerCase()
                                      )}
                                      width="40px"
                                      height="40px"
                                      alt={"icon"}
                                    />
                                    <div>
                                      <p className="capitalize-text bold-text">
                                        {" "}
                                        {checkAllowedSide(trx.side) === 1
                                          ? roundNumberDecimal(trx.cost, 3)
                                          : roundNumberDecimal(trx.amount, 3)}
                                        {" " + trx.assetTraded}
                                      </p>
                                      {checkAllowedSide(trx.side) === 2 ? (
                                        <p className="bold-text priceInAud">{` \r${roundNumberDecimal(
                                          trx?.fifoCGTDetail.boughtFor,
                                          1
                                        )} AUD`}</p>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </Grid>
                              <Grid item md={1} xs={6}>
                                {trx.symbol.split("/").length > 1 ? (
                                  <ArrowForwardSharpIcon />
                                ) : (
                                  <HandshakeIcon />
                                )}
                              </Grid>
                              <Grid item md={2} xs={6}>
                                <div className="assets-container">
                                  <img
                                    className="crypto-icon"
                                    src={getCoinImageByName(
                                      trx.assetReceived.toLowerCase()
                                    )}
                                    width="40px"
                                    height="40px"
                                    alt={"icon"}
                                  />

                                  <div>
                                    <p className="bold-text">
                                      {trx.symbol.split("/").length > 1
                                        ? checkAllowedSide(trx.side) === 2
                                          ? roundNumberDecimal(trx.cost, 3)
                                          : roundNumberDecimal(trx.amount, 3)
                                        : roundNumberDecimal(trx.amount, 3)}
                                      {" " + trx.assetReceived}
                                    </p>
                                    <p className="bold-text priceInAud">{` \r${roundNumberDecimal(
                                      Number(trx?.priceInAud) *
                                        Number(trx.amount),
                                      3
                                    )} AUD`}</p>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item md={1} xs={6}>
                                <p className="bold-text">
                                  {roundNumberDecimal(trx.fee.cost, 1) +
                                    " (" +
                                    roundNumberDecimal(
                                      trx.fee.cost / trx.cost,
                                      1
                                    ) +
                                    "%) Fee"}
                                </p>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                xs={6}
                                alignItems={"center"}
                                justifyContent={"center"}
                                display="flex"
                              >
                                <p
                                  className={`${
                                    trx.cgt.fifo > 0
                                      ? "cgt-gain"
                                      : trx.cgt.fifo === 0
                                      ? "cgt"
                                      : "cgt-loss"
                                  }`}
                                >
                                  {" "}
                                  {trx.cgt.fifo > 0
                                    ? "$ " +
                                      roundNumberDecimal(trx.cgt.fifo, 1) +
                                      " (Gain)"
                                    : trx.cgt.fifo === 0
                                    ? "$ " + trx.cgt.fifo + " (--)"
                                    : "$ " +
                                      roundNumberDecimal(trx.cgt.fifo, 1) +
                                      " (Loss)"}
                                </p>
                                {trx.isError ? (
                                  <Tooltip
                                    title={
                                      trx.priceInAud === 0
                                        ? "Possible Pricing Error, Edit Transaction for manual exchange rate!"
                                        : "Possible Holdings Error, Add Transaction! outbalance =  " +
                                          roundNumberDecimal(
                                            trx.balance.currentBalance,
                                            2
                                          )
                                    }
                                  >
                                    <AnnouncementIcon />
                                  </Tooltip>
                                ) : (
                                  <></>
                                )}
                              </Grid>
                              {/* <Grid item md={1} xs={6}>
                                
                              </Grid> */}
                            </Grid>
                          </div>
                          <div
                            id="table-row-details-container"
                            className="sub-grouping-verticon"
                            onClick={(e) => {
                              setEditIdToProcess(trx.id);
                              setSelectedSide(trx.side);
                              setTrxData(trx);
                              openMenu(e);
                            }}
                          >
                            <VertIcon id="table-row-details-icon" />
                          </div>
                        </div>

                        {trx.isOpen ? (
                          <div
                            className={
                              trx.isError
                                ? "sub-data-container-error"
                                : "sub-data-container"
                            }
                          >
                            <TransactionSubComponent data={trx} />
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
                </Grid>
              </div>
            </Grid>
          );
        })}
        <Menu
          anchorEl={menuAnchor}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={() => {
            setMenuAnchor(null);
          }}
          PaperProps={{
            style: {
              maxHeight: 350,
            },
          }}
        >
          {allowedSides(selectedSide)?.length > 0 ? (
            allowedSides(selectedSide)?.map((side) => {
              return (
                <>
                  <MenuItem
                    onClick={(e) => {
                      setMenuAnchor(null);
                      if (isPersonalPlan) {
                        dispatch(
                          changeTransactionSide(editIdToProcess, {
                            side: side.value,
                          })
                        );
                      } else
                        dispatch(
                          changeTransactionSideProfessional(
                            editIdToProcess,
                            {
                              side: side.value,
                            },
                            path[path.length - 1]
                          )
                        );
                    }}
                  >
                    <ListItemText
                      primary={
                        "Tag as " +
                        side.value[0].toUpperCase() +
                        side.value.slice(1)
                      }
                    />
                  </MenuItem>
                </>
              );
            })
          ) : (
            <></>
          )}
          <Divider />
          {/* {console.log("trx-data", trxData.priceInAud === 0)} */}
          {trxData?.isError && trxData?.priceInAud === 0 ? (
            <MenuItem
              onClick={(e) => {
                setMenuAnchor(null);
                setIsEditDialogOpen(!isEditDialogOpen);
              }}
            >
              <ListItemText primary={"Edit Exchange Rate"} />
            </MenuItem>
          ) : (
            <></>
          )}
        </Menu>
        <Menu
          anchorEl={sideMenuAnchor}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(sideMenuAnchor)}
          onClose={() => {
            setSideMenuAnchor(null);
          }}
          PaperProps={{
            style: {
              maxHeight: 350,
            },
          }}
        >
          {allowedSides(selectedSide)?.length > 0 ? (
            allowedSides(selectedSide)?.map((side) => {
              return (
                <>
                  <MenuItem
                    onClick={(e) => {
                      setMenuAnchor(null);
                      if (isPersonalPlan) {
                        dispatch(
                          changeTransactionSide(editIdToProcess, {
                            side: side.value,
                          })
                        );
                      } else
                        dispatch(
                          changeTransactionSideProfessional(
                            editIdToProcess,
                            {
                              side: side.value,
                            },
                            path[path.length - 1]
                          )
                        );
                    }}
                  >
                    <ListItemText
                      primary={
                        "Tag as " +
                        side.value[0].toUpperCase() +
                        side.value.slice(1)
                      }
                    />
                  </MenuItem>
                </>
              );
            })
          ) : (
            <></>
          )}
        </Menu>
      </Grid>
      <EditTransactionDialog
        openAlert={isEditDialogOpen}
        data={trxData}
        handleCancel={handleEditDialogCancel}
        handleYes={handleEditDialogYes}
      />
    </>
  );
}
