import React, { createContext, useState } from "react";

export const DrawerWidthContext = createContext();

export function DrawerWidthProvider(props) {
  const [isCollapsed, setCollapsed] = useState(false);
  const changeDrawerWidth = () => setCollapsed(!isCollapsed);
  return (
    <DrawerWidthContext.Provider value={{ isCollapsed, changeDrawerWidth }}>
      {props.children}
    </DrawerWidthContext.Provider>
  );
}