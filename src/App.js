import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Borrowers from "./pages/Borrowers";
import { Box } from "@mui/material";

import Products from "./pages/Products";
import Transactions from "./pages/Transactions";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route shows the Login page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard and its nested pages */}
        <Route
  path="/dashboard/*"
  element={
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f8fafc",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="borrowers" element={<Borrowers />} />
          <Route path="products" element={<Products />} />
          <Route path="transactions" element={<Transactions />} />
        </Routes>
      </Box>
    </Box>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;
