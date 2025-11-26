import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://691342b9f34a2ff1170b4eca.mockapi.io/roles");
      const users = await res.json();

      const user = users.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password
      );

      if (user) {
        navigate("/dashboard"); // ✅ redirect after success
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to left, #0a23432d, #092c36ff)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: "5px",
          width: "100%",
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Lending Management System
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Please log in to continue
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1, fontWeight: "bold" }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
