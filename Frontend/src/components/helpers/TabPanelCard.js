import React from "react";

function TabPanelCard(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {value === index && (
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default TabPanelCard;
