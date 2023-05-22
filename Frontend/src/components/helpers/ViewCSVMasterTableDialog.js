import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Typography,
  Tab,
  Tabs,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { exchangesData } from "../../services/platform-integration-data";
import styles from "../../resources/styles/helpers-styles/AddCSVMasterTableDialogStyles";

function ViewCSVMasterTableDialog(props) {
  const { classes } = props;
  const { openAlert, handleCancel, handleYes, data } = props;
  const [exchange, setExchange] = useState("");
  const [csvMultipleRowToColMapping, setCsvMultipleRowToColMapping] =
    useState(false);
  const [navValue, setNavValue] = useState("csvColMapping");

  const [colMappingDateTime, setColMappingDateTime] = useState("");
  const [colMappingPrice, setColMappingPrice] = useState("");
  const [colMappingSide, setColMappingSide] = useState("");
  const [colMappingCost, setColMappingCost] = useState("");
  const [colMappingAmount, setColMappingAmount] = useState("");
  const [colMappingFee, setColMappingFee] = useState("");
  const [colMappingSymbol, setColMappingSymbol] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);

  const [csvColSplitResult, setCsvColSplitResult] = useState([]);
  const [csvSplitStart, setCsvSplitStart] = useState("");
  const [csvSplitEnd, setCsvSplitEnd] = useState("");

  const [csvColJoinResult, setCsvColJoinResult] = useState([]);
  const [colLeft, setColLeft] = useState("");
  const [colRight, setColRight] = useState("");
  const [joinChar, setJoinChar] = useState("");
  const [resultCol, setResultCol] = useState("");

  const [csvColFormulaResult, setCsvColFormulaResult] = useState({});
  const [csvColFormulaArrayResult, setCsvColFormulaArrayResult] = useState([]);
  const [formula, setFormula] = useState("");
  const [resultColFormula, setResultColFormula] = useState("");

  useEffect(() => {
    for (let i = 0; i < Object.keys(csvColFormulaResult).length; i++) {
      setCsvColFormulaArrayResult([
        ...csvColFormulaArrayResult,
        {
          formula: Object.keys(csvColFormulaResult)[i],
          resultColumn: Object.values(csvColFormulaResult)[i],
        },
      ]);
    }
  }, [csvColFormulaResult]);

  useEffect(() => {
    setCsvColFormulaResult(data?.csvFormulas);
    setCsvColJoinResult(data?.csvColumnJoinMapping);
    setCsvColSplitResult(data?.csvSplitIdentifiers);
  }, []);
  const renderCSVColMapping = () => {
    return (
      <div className={classes.formRow}>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>System Column</label>
          <label className={classes.labelShort}>CSV Column</label>
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Date Time</label>
          <input
            type={"text"}
            value={colMappingDateTime}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingDateTime(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Price</label>
          <input
            type={"text"}
            value={colMappingPrice}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingPrice(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Side</label>
          <input
            type={"text"}
            value={colMappingSide}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingSide(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Cost</label>
          <input
            type={"text"}
            value={colMappingCost}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingCost(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Amount</label>
          <input
            type={"text"}
            value={colMappingAmount}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingAmount(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Fee</label>
          <input
            type={"text"}
            value={colMappingFee}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingFee(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Symbol</label>
          <input
            type={"text"}
            value={colMappingSymbol}
            className={classes.inputShort}
            onChange={(e) => {
              setColMappingSymbol(e.target.value);
            }}
            disabled
          />
        </div>
      </div>
    );
  };

  const renderCSVSplitMapping = () => {
    return (
      <>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Start</label>
          <input
            value={csvSplitStart}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setCsvSplitStart(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>End</label>
          <input
            disabled
            value={csvSplitEnd}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setCsvSplitEnd(e.target.value);
            }}
          />
        </div>

        <div className={classes.formRow}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/No</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvColSplitResult?.map((res, idx) => (
                <TableRow>
                  <TableCell>{+idx + 1}</TableCell>
                  <TableCell>{res.start}</TableCell>
                  <TableCell>{res.end}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  const renderCSVColJoinMapping = () => {
    return (
      <>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Column Left</label>
          <input
            value={colLeft}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setColLeft(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Column Right</label>
          <input
            value={colRight}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setColRight(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Join by Char</label>
          <input
            value={joinChar}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setJoinChar(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Result Col</label>
          <input
            disabled
            value={resultCol}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setResultCol(e.target.value);
            }}
          />
        </div>

        <div className={classes.formRow}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/No</TableCell>
                <TableCell>Column Left</TableCell>
                <TableCell>Column Right</TableCell>
                <TableCell>Join Char</TableCell>
                <TableCell>Result Column</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvColJoinResult?.map((res, idx) => (
                <TableRow>
                  <TableCell>{+idx + 1}</TableCell>
                  <TableCell>{res.colLeft}</TableCell>
                  <TableCell>{res.colRight}</TableCell>
                  <TableCell>{res.joinChar}</TableCell>
                  <TableCell>{res.resultCol}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  const renderCSVColFormulaMapping = () => {
    return (
      <>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Formula</label>
          <input
            value={formula}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setFormula(e.target.value);
            }}
            disabled
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Result Column</label>
          <input
            disabled
            value={resultColFormula}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setResultColFormula(e.target.value);
            }}
          />
        </div>

        <div className={classes.formRow}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/No</TableCell>
                <TableCell>Formula</TableCell>
                <TableCell>Result Column</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvColFormulaArrayResult?.map((res, idx) => (
                <TableRow>
                  <TableCell>{+idx + 1}</TableCell>
                  <TableCell>{res.formula}</TableCell>
                  <TableCell>{res.resultColumn}</TableCell>

                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  const renderNavigationPills = () => {
    return (
      <Tabs
        value={navValue}
        onChange={(e, newValue) => {
          setNavValue(newValue);
        }}
        aria-label="Nav Bar"
        className={classes.Tabs}
      >
        <Tab
          className={`${
            navValue === "csvColMapping"
              ? classes.navItemActive
              : classes.navItem
          }`}
          value="csvColMapping"
          label="Direct"
        />
        <Tab
          className={`${
            navValue === "csvSplitMapping"
              ? classes.navItemActive
              : classes.navItem
          }`}
          value="csvSplitMapping"
          label="Split"
        />
        <Tab
          className={`${
            navValue === "csvColJoinMapping"
              ? classes.navItemActive
              : classes.navItem
          }`}
          value="csvColJoinMapping"
          label="Join"
        />
        <Tab
          className={`${
            navValue === "csvColFormulaMapping"
              ? classes.navItemActive
              : classes.navItem
          }`}
          value="csvColFormulaMapping"
          label="Formula"
        />
      </Tabs>
    );
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openAlert}
        TransitionComponent={Slide}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>Add new CSV Master Table</div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography className={classes.dialogContent}>
            <div className={classes.errorContainer}>
              {errorMessages.map((msg) => {
                return <div className={classes.errorMessages}>{msg}</div>;
              })}
            </div>
            <form>
              <div className={classes.formRow}>
                <label className={classes.label}>Exchange</label>
                <select
                  value={exchange}
                  className={classes.input}
                  onChange={(e) => {
                    setExchange(e.target.value);
                  }}
                  disabled
                >
                  <option defaultChecked value={null}>
                    Select
                  </option>
                  {exchangesData.map((exchangeData) => {
                    return (
                      <option
                        value={exchangeData.name}
                        className={classes.capitalize}
                      >
                        {exchangeData.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>
                  CSV Multiple Row to Col Mapping Required?
                </label>
                <input
                  disabled
                  type={"checkbox"}
                  value={csvMultipleRowToColMapping}
                  className={classes.inputCheckbox}
                  onChange={(e) => {
                    setCsvMultipleRowToColMapping(e.target.value);
                  }}
                />
              </div>
              <div className={classes.formRow}>
                <label className={classes.label}>CSV Column Mappings</label>
                {renderNavigationPills()}
                {navValue === "csvColMapping" ? renderCSVColMapping() : <></>}
                {navValue === "csvSplitMapping" ? (
                  renderCSVSplitMapping()
                ) : (
                  <></>
                )}
                {navValue === "csvColJoinMapping" ? (
                  renderCSVColJoinMapping()
                ) : (
                  <></>
                )}
                {navValue === "csvColFormulaMapping" ? (
                  renderCSVColFormulaMapping()
                ) : (
                  <></>
                )}
              </div>
            </form>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} className={classes.btnCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(ViewCSVMasterTableDialog);
