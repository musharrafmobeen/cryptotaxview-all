import { ListItem, Menu, MenuItem } from "@mui/material";
import React from "react";

function MenuItemCard(props) {
  const { menuItems, menuAnchor, setMenuAnchor } = props;

  const renderMenuItems = () => {
    const list = menuItems.map((item, index) => (
      <MenuItem key={index}>
        <ListItem onClick={item.onClick}>{item.text}</ListItem>
      </MenuItem>
    ));
    return list;
  };

  return (
    <div>
      <Menu
        anchorEl={menuAnchor}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        {renderMenuItems()}
      </Menu>
    </div>
  );
}

export default MenuItemCard;
