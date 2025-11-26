import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import api from "../api/api";
import api2 from "../api/api2";
import DataTable from "../components/DataTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    borrower_id: "",
    product_id: "",
    amount: "",
    charges: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchBorrowers();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api2.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchBorrowers = async () => {
    try {
      const res = await api.get("/borrowers");
      setBorrowers(res.data);
    } catch (error) {
      console.error("Error fetching borrowers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpenModal = (transaction = null) => {
    setEditingTransaction(transaction);
    if (transaction) {
      setFormData({
        borrower_id: transaction.borrower_id || "",
        product_id: transaction.product_id || "",
        amount: transaction.amount || "",
        charges: transaction.charges || "",
      });
    } else {
      setFormData({ borrower_id: "", product_id: "", amount: "", charges: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    setOpenModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      !formData.borrower_id ||
      !formData.product_id ||
      !formData.amount ||
      !formData.charges
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingTransaction) {
        const res = await api2.put(
          `/transactions/${editingTransaction.id}`,
          formData
        );
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingTransaction.id ? res.data : t))
        );
      } else {
        const res = await api2.post("/transactions", formData);
        setTransactions((prev) => [...prev, res.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api2.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const displayData = transactions.map((t) => {
    const borrower = borrowers.find((b) => b.id === t.borrower_id);
    const product = products.find((p) => p.id === t.product_id);
    return {
      id: t.id,
      borrower: borrower ? borrower.name : `Borrower ${t.borrower_id}`,
      product: product ? product.name : `Product ${t.product_id}`,
      amount: t.amount,
      charges: t.charges,
      borrower_id: t.borrower_id,
      product_id: t.product_id,
    };
  });

  const filteredData = displayData.filter(
    (t) =>
      t.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery) ||
      t.charges.toString().includes(searchQuery)
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Search + Add */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          mb: 3,
        }}
      >
        <TextField
          label="Search Transactions"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "300px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        />
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: "#1976d2", 
            textTransform: "none",
            px: 3
          }}
          onClick={() => handleOpenModal()}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <DataTable
          title="Transactions"
          data={filteredData}
          columns={[
            { field: "id", headerName: "ID" },
            { field: "borrower", headerName: "Borrower" },
            { field: "product", headerName: "Product" },
            { field: "amount", headerName: "Amount" },
            { field: "charges", headerName: "Charges" },
          ]}
          onEdit={(row) => handleOpenModal(row)}
          onDelete={(id) => handleDelete(id)}
        />
      </Box>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>
          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Borrower"
            name="borrower_id"
            value={formData.borrower_id}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {borrowers.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Product"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Charges"
            name="charges"
            type="number"
            value={formData.charges}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;