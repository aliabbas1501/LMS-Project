import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import api from "../api/api"; // ✅ same api instance used in other pages
import api2 from "../api/api2";

const Dashboard = () => {
  const [stats, setStats] = useState({
    borrowers: 0,
    products: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch counts from MockAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [borrowersRes, productsRes, transactionsRes] = await Promise.all([
          api.get("/borrowers"),
          api.get("/products"),
          api2.get("/transactions"),
        ]);

        setStats({
          borrowers: borrowersRes.data.length,
          products: productsRes.data.length,
          transactions: transactionsRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: "35px",
        marginRight: "270px",
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "700", color: "#1e293b", mb: 4 }}
        >
       Welcome Back, Ali
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {[
            {
              title: "Total Borrowers",
              value: stats.borrowers,
              color: "linear-gradient(135deg, #42a5f5, #1e88e5)",
            },
            {
              title: "Total Products",
              value: stats.products,
              color: "linear-gradient(135deg, #66bb6a, #388e3c)",
            },
            {
              title: "Total Transactions",
              value: stats.transactions,
              color: "linear-gradient(135deg, #ffa726, #f57c00)",
            },
          ].map((card, index) => (
              <Grid
      size={{ xs: 12, sm: 6, md: 4 }}
      key={index}
      sx={{ display: "flex" }} // ✅ ensures equal height
    >
              
              <Paper
        sx={{
          flexGrow: 1, // ✅ makes each card fill its grid cell evenly
          padding: "25px",
          borderRadius: "16px",
          textAlign: "center",
          background: card.color,
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-5px)" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // centers content vertically
        }}
      >
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "700", mt: 1 }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
