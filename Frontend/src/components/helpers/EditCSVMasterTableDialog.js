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

function EditCSVMasterTableDialog(props) {
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
    let objCSVDirect = {};

    if (Object.keys(data).length) {
      for (let i = 0; i < Object.keys(data?.csvColumnMapping).length; i++) {
        const obj = {
          [Object.values(data?.csvColumnMapping)[i]]: Object.keys(
            data?.csvColumnMapping
          )[i],
        };

        objCSVDirect = { ...objCSVDirect, ...obj };
      }
    }

    setExchange(data?.name);
    setCsvMultipleRowToColMapping(data?.csvRowToColTransformationRequired);
    setColMappingDateTime(objCSVDirect?.datetime);
    setColMappingPrice(objCSVDirect?.price);
    setColMappingSide(objCSVDirect?.side);
    setColMappingCost(objCSVDirect?.cost);
    setColMappingAmount(objCSVDirect?.amount);
    setColMappingFee(objCSVDirect?.fee);
    setColMappingSymbol(objCSVDirect?.symbol);

    setCsvColSplitResult(data?.csvSplitIdentifiers);
    setCsvColJoinResult(data?.csvColumnJoinMapping);

    setCsvColFormulaResult(data?.csvFormulas);
  }, [data]);
  useEffect(() => {
    if (csvColFormulaResult)
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
  // useEffect(() => {
  //   setExchangeRate(data?.priceInAud);

  //   return () => {
  //     setExchangeRate(null);
  //   };
  // }, [data]);

  const handleSubmit = () => {
    // setTransactionErrorMessages([]);

    let localErrorMessages = [];

    if (exchange.length === 0)
      localErrorMessages.push("*Exchange cannot be empty");

    if (
      csvColSplitResult.length === 0 ||
      csvColJoinResult.length === 0 ||
      csvColFormulaResult.length === 0
    )
      localErrorMessages.push(
        "*Please fill at least one mapping cannot be empty"
      );

    setErrorMessages(errorMessages);

    let csvDirectMappingResult = {};
    if (colMappingDateTime !== "" && colMappingDateTime !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingDateTime]: "datetime",
      };
    if (colMappingPrice !== "" && colMappingPrice !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingPrice]: "price",
      };
    if (colMappingSide !== "" && colMappingSide !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingSide]: "side",
      };
    if (colMappingCost !== "" && colMappingCost !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingCost]: "cost",
      };
    if (colMappingAmount !== "" && colMappingAmount !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingAmount]: "amount",
      };
    if (colMappingFee !== "" && colMappingFee !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingFee]: "fee",
      };
    if (colMappingSymbol !== "" && colMappingSymbol !== undefined)
      csvDirectMappingResult = {
        ...csvDirectMappingResult,
        [colMappingSymbol]: "symbol",
      };

    if (errorMessages.length === 0) {
      if (exchange === "binance") {
        handleYes(
          exchange,
          csvDirectMappingResult,
          csvColSplitResult,
          csvColJoinResult,
          csvColFormulaResult,
          true
        );
      } else
        handleYes(
          exchange,
          csvDirectMappingResult,
          csvColSplitResult,
          csvColJoinResult,
          csvColFormulaResult,
          csvMultipleRowToColMapping
        );
      resetFields();
    }
  };

  const resetFields = () => {
    setExchange("");
    setCsvMultipleRowToColMapping(false);
    setColMappingDateTime("");
    setColMappingPrice("");
    setColMappingSide("");
    setColMappingCost("");
    setColMappingAmount("");
    setColMappingFee("");
    setColMappingSymbol("");
    setErrorMessages([]);
    setCsvColSplitResult([]);
    setCsvSplitStart("");
    setCsvSplitEnd("");
    setCsvColJoinResult("");
    setColLeft("");
    setColRight("");
    setJoinChar("");
    setJoinChar("");
    setCsvColFormulaResult({});
    setCsvColFormulaArrayResult([]);
    setFormula("");
    setResultColFormula("");
  };

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
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>End</label>
          <input
            value={csvSplitEnd}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setCsvSplitEnd(e.target.value);
            }}
          />
        </div>
        <div className={classes.formRowShort}>
          <Button
            onClick={(e) => {
              setCsvColSplitResult([
                ...csvColSplitResult,
                {
                  end: csvSplitEnd,
                  start: csvSplitStart,
                },
              ]);
              setCsvSplitStart("");
              setCsvSplitEnd("");
            }}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
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
                  <TableCell>
                    <span
                      className={classes.actionButton}
                      onClick={(e) => {
                        setCsvColSplitResult([
                          ...csvColSplitResult.slice(0, idx),
                          ...csvColSplitResult.slice(
                            idx + 1,
                            csvColSplitResult.length
                          ),
                        ]);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
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
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Result Col</label>
          <input
            value={resultCol}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setResultCol(e.target.value);
            }}
          />
        </div>
        <div className={classes.formRowShort}>
          <Button
            onClick={(e) => {
              setCsvColJoinResult([
                ...csvColJoinResult,
                {
                  colLeft,
                  colRight,
                  joinChar,
                  resultCol,
                },
              ]);
              setColLeft("");
              setColRight("");
              setJoinChar("");
              setResultCol("");
            }}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
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
                  <TableCell>
                    <span
                      className={classes.actionButton}
                      onClick={(e) => {
                        setCsvColJoinResult([
                          ...csvColJoinResult.slice(0, idx),
                          ...csvColJoinResult.slice(
                            idx + 1,
                            csvColJoinResult.length
                          ),
                        ]);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
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
          />
        </div>
        <div className={classes.formRowShort}>
          <label className={classes.labelShort}>Result Column</label>
          <input
            value={resultColFormula}
            type={"text"}
            className={classes.inputShort}
            onChange={(e) => {
              setResultColFormula(e.target.value);
            }}
          />
        </div>
        <div className={classes.formRowShort}>
          <Button
            onClick={(e) => {
              setCsvColFormulaResult({
                ...csvColFormulaResult,
                [formula]: resultColFormula,
              });
              formula("");
              resultColFormula("");
            }}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
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

                  <TableCell>
                    <span
                      className={classes.actionButton}
                      onClick={(e) => {
                        const { [res.formula]: ignore, ...rest } =
                          csvColFormulaResult;
                        setCsvColFormulaResult(rest);
                        setCsvColFormulaArrayResult([
                          ...csvColFormulaArrayResult.slice(0, idx),
                          ...csvColFormulaArrayResult.slice(
                            idx + 1,
                            csvColFormulaArrayResult.length
                          ),
                        ]);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
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
          <div className={classes.dialogTitle}>Edit CSV Master Table</div>
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
                  type={"checkbox"}
                  value={csvMultipleRowToColMapping}
                  className={classes.inputCheckbox}
                  onChange={(e) => {
                    setCsvMultipleRowToColMapping(!csvMultipleRowToColMapping);
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

          <Button
            onClick={(e) => {
              handleSubmit();
            }}
            classes={{ root: classes.btnYes }}
            className={classes.btnYes}
          >
            {"Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(EditCSVMasterTableDialog);
