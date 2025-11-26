import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ for logout redirect

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Borrowers", icon: <PeopleIcon />, path: "/dashboard/borrowers" },
    { text: "Products", icon: <ShoppingCartIcon />, path: "/dashboard/products" },
    { text: "Transactions", icon: <SwapHorizIcon />, path: "/dashboard/transactions" },
  ];

  // ✅ Logout Function
 const handleLogout = () => {
  localStorage.clear();
  window.location.assign("/");
};



  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          backgroundColor: "#1e293b",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start", // ✅ menu sticks to top now
          borderRight: "none",
          paddingTop: 2, // ✅ small spacing from top
        },
      }}
    >
      {/* Logo / App Title */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            textShadow: "0 0 10px rgba(59,130,246,0.5)",
          }}
        >
          Lending Management System
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              margin: "6px 15px",
              borderRadius: "10px",
              alignItems: "flex-start", // ✅ icon moves to top alignment
              backgroundColor:
                location.pathname === item.path ? "rgba(255,255,255,0.15)" : "transparent",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40, mt: "4px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiTypography-root": {
                  fontFamily: "Poppins",
                  fontSize: "15px",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Logout Button (Now Functional ✅) */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout} // ✅ Logout works now
          sx={{
            borderRadius: "10px",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              "& .MuiTypography-root": {
                fontFamily: "Poppins",
                fontSize: "15px",
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
