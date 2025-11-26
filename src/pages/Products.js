import React, { useState, useEffect } from "react";
import { 
  Box, TextField, Button, Modal, Typography, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from "@mui/material";
import DataTable from "../components/DataTable";
import api from "../api/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    tenure: "",
    charge_unit: "",
    charge_value: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await api.post("/products", newProduct);
      setProducts((prev) => [...prev, res.data]);
      setNewProduct({ name: "", tenure: "", charge_unit: "", charge_value: "" });
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEdit = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
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
      await api.delete(`/products/${selectedId}`);
      setProducts((prev) => prev.filter((p) => p.id !== selectedId));
    } catch (error) {
      console.error(error);
    }
    setOpenDialog(false);
  };

  // Filter only by name
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Search + Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", mb: 3 }}>
        <TextField
          label="Search Products"
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
          Add Product
        </Button>
      </Box>

      {/* DataTable */}
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <DataTable
          title="Products"
          data={filteredProducts}
          columns={[
            { field: "id", headerName: "ID" },
            { field: "name", headerName: "Name" },
            { field: "tenure", headerName: "Tenure (months)" },
            { field: "charge_unit", headerName: "Charge Unit" },
            { field: "charge_value", headerName: "Charge Value" },
          ]}
          onEdit={handleEdit}
          onDelete={handleOpenDialog} // triggers delete popup
        />
      </Box>

      {/* Add Product Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 550, bgcolor: "background.paper", borderRadius: "10px", boxShadow: 24, p: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Add New Product</Typography>
          <TextField label="Name" fullWidth sx={{ mb: 2 }} value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <TextField label="Tenure (months)" fullWidth sx={{ mb: 2 }} value={newProduct.tenure} onChange={(e) => setNewProduct({ ...newProduct, tenure: e.target.value })} />
          <TextField label="Charge Unit" fullWidth sx={{ mb: 2 }} value={newProduct.charge_unit} onChange={(e) => setNewProduct({ ...newProduct, charge_unit: e.target.value })} />
          <TextField label="Charge Value" fullWidth sx={{ mb: 2 }} value={newProduct.charge_value} onChange={(e) => setNewProduct({ ...newProduct, charge_value: e.target.value })} />
          <Button variant="contained" fullWidth sx={{ backgroundColor: "#1976d2" }} onClick={handleAddProduct}>Add Product</Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Products;
