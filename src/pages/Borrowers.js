import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import DataTable from "../components/DataTable";
import api from "../api/api";

const Borrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    creditLimit: "",
    mobile: "",
  });

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const res = await api.get("/borrowers");
      setBorrowers(res.data);
    } catch (error) {
      console.error("Error fetching borrowers:", error);
    }
  };

  const handleAddBorrower = async () => {
    try {
      const res = await api.post("/borrowers", newBorrower);
      setBorrowers((prev) => [...prev, res.data]);
      setNewBorrower({ name: "", creditLimit: "", mobile: "" });
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding borrower:", error);
    }
  };

  const handleEdit = (updated) => {
    setBorrowers((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  };

  // Open delete confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/borrowers/${selectedId}`);
      setBorrowers((prev) => prev.filter((b) => b.id !== selectedId));
    } catch (error) {
      console.error(error);
    }
    setOpenDialog(false);
  };

  const filteredBorrowers = borrowers.filter((b) =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Search + Add */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", mb: 3 }}>
        <TextField
          label="Search Borrowers"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px", backgroundColor: "white", borderRadius: "8px" }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1976d2", textTransform: "none", px: 3 }}
          onClick={() => setOpenModal(true)}
        >
          Add Borrower
        </Button>
      </Box>

      {/* DataTable */}
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <DataTable
          title="Borrowers"
          data={filteredBorrowers}
          columns={[
            { field: "id", headerName: "ID" },
            { field: "name", headerName: "Name" },
            { field: "creditLimit", headerName: "Credit Limit" },
            { field: "mobile", headerName: "Mobile" },
          ]}
          onEdit={handleEdit}
          onDelete={handleOpenDialog} // IMPORTANT: use dialog
        />
      </Box>

      {/* Add Borrower Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 550, bgcolor: "background.paper", borderRadius: "10px", boxShadow: 24, p: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Add New Borrower</Typography>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={newBorrower.name} onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })} />
          <TextField label="Credit Limit" fullWidth sx={{ mb: 2 }} value={newBorrower.creditLimit} onChange={(e) => setNewBorrower({ ...newBorrower, creditLimit: e.target.value })} />
          <TextField label="Mobile" fullWidth sx={{ mb: 2 }} value={newBorrower.mobile} onChange={(e) => setNewBorrower({ ...newBorrower, mobile: e.target.value })} />
          <Button variant="contained" fullWidth sx={{ backgroundColor: "#1976d2" }} onClick={handleAddBorrower}>Add Borrower</Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this borrower?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Borrowers;
