// import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../resources/styles/views-styles/AdminCSVMasterCRUDStyles";
import {
  deleteCSVMasterTableData,
  getCSVMasterTableData,
  patchCSVMasterTableData,
  postCSVMasterTableData,
} from "../../store/csvMasterTable/csvMasterTable";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import loadingImage from "../../resources/design-images/AJ_rocket.gif";
import AddCSVMasterTableDialog from "../helpers/AddCSVMasterTableDialog";
import AlertMessageDialog from "../helpers/AlertMessageDialog";
import EditCSVMasterTableDialog from "../helpers/EditCSVMasterTableDialog";
import Notifications from "../helpers/Notifications";
function AdminCSVMasterCRUD(props) {
  const { classes } = props;
  const dispatch = useDispatch();
  const csvMasterTable = useSelector(
    (state) => state.entities.csvMasterTableData
  );
  const [idToProcess, setIdToProcess] = useState("");
  const [dataToProcess, setDataToProcess] = useState({});
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  useEffect(() => {
    dispatch(getCSVMasterTableData());
  }, []);
  useEffect(() => {
    if (csvMasterTable?.isRefreshNeeded) dispatch(getCSVMasterTableData());
  }, [csvMasterTable?.isRefreshNeeded]);
  const handleAddDialogCancel = () => {
    setIsOpenAddDialog(false);
  };
  const handleDeleteAlertClose = () => {
    setIsOpenDeleteDialog(false);
  };
  const handleDeleteYes = () => {
    setIsOpenDeleteDialog(false);
    dispatch(deleteCSVMasterTableData(idToProcess));
  };
  const handleEditDialogCancel = () => {
    setIsOpenEditDialog(false);
  };
  const handleEditDialogSubmit = (
    exchange,
    csvMapping,
    csvColSplitResult,
    csvColJoinResult,
    csvColFormulaResult,
    csvMultipleRowToColMapping
  ) => {
    setIsOpenEditDialog(false);
    dispatch(
      patchCSVMasterTableData({
        name: exchange,
        csvColumnMapping: csvMapping,
        csvSplitIdentifiers: csvColSplitResult,
        csvColumnJoinMapping: csvColJoinResult,
        csvFormulas: csvColFormulaResult,
        csvRowToColTransformationRequired: csvMultipleRowToColMapping,
      })
    );
  };
  const handleAddDialogSubmit = (
    exchange,
    csvMapping,
    csvColSplitResult,
    csvColJoinResult,
    csvColFormulaResult,
    csvMultipleRowToColMapping
  ) => {
    setIsOpenAddDialog(false);
    dispatch(
      postCSVMasterTableData({
        name: exchange,
        csvColumnMapping: csvMapping,
        csvSplitIdentifiers: csvColSplitResult,
        csvColumnJoinMapping: csvColJoinResult,
        csvFormulas: csvColFormulaResult,
        csvRowToColTransformationRequired: csvMultipleRowToColMapping,
      })
    );
  };

  const renderHoldings = (data) => {
    const list = data.map((exchange, idx) => (
      <TableRow key={idx} component={Paper} className={classes.dataRow}>
        <TableCell className={classes.capitalize} align="center">
          {exchange.name}{" "}
        </TableCell>
        <TableCell align="center">
          <span
            className={classes.actionButton}
            onClick={(e) => {
              setIsOpenEditDialog(true);

              setDataToProcess(exchange);
            }}
          >
            Edit
          </span>{" "}
          <span
            className={classes.actionButtonDelete}
            onClick={(e) => {
              setIsOpenDeleteDialog(true);
              setIdToProcess(exchange.id);
            }}
          >
            Delete
          </span>
        </TableCell>
      </TableRow>
    ));
    return list;
  };
  return (
    <div className={classes.root}>
      <Notifications
        open={csvMasterTable?.isAddingSuccess}
        message={"Exchange has been added successfully!"}
        type="success"
      />

      <Notifications
        open={csvMasterTable?.isDeletingSuccess}
        message={"Exchange has been deleted successfully!"}
        type="success"
      />

      <Paper className={classes.paper} elevation={0}>
        <div className={classes.paperHead}>
          <div className={classes.heading}>
            <h1>CSV Master CRUD</h1>
          </div>
          <div className={classes.actionButtonsContainer}>
            <button
              className={classes.btnAddHead}
              onClick={(e) => {
                setIsOpenAddDialog(true);
              }}
            >
              <h3>+ Add CSV Master Table</h3>
            </button>
          </div>
        </div>
        <Divider />
        <div className={classes.tableContainer}>
          <TableContainer
            classes={{ root: classes.customTableContainer }}
            className={classes.tableContainer}
          >
            <Table stickyHeader>
              <TableHead className={classes.tableHead}>
                <TableRow className={classes.headerRow}>
                  <TableCell align="center">Exchange</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {csvMasterTable.isLoading ? (
                  <TableRow>
                    <TableCell colspan={2}>
                      <div className={classes.loadingImage}>
                        <img
                          width="100px"
                          height="100px"
                          src={loadingImage}
                          alt="Loading"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}

                {csvMasterTable.data.length
                  ? renderHoldings(csvMasterTable.data)
                  : ""}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
      <AddCSVMasterTableDialog
        openAlert={isOpenAddDialog}
        handleCancel={handleAddDialogCancel}
        handleYes={handleAddDialogSubmit}
      />
      <EditCSVMasterTableDialog
        openAlert={isOpenEditDialog}
        handleCancel={handleEditDialogCancel}
        handleYes={handleEditDialogSubmit}
        data={dataToProcess}
      />
      <AlertMessageDialog
        openAlert={isOpenDeleteDialog}
        title={"Delete"}
        content={"Are you sure you want to delete this CSV Master Table?"}
        handleCancel={handleDeleteAlertClose}
        handleYes={handleDeleteYes}
        yesText={"Delete"}
      />
    </div>
  );
}

export default withStyles(styles)(AdminCSVMasterCRUD);
