import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Pagination, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Button, CircularProgress
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const DataTable = ({ data = [], columns, onDelete, onEdit, title }) => {
   const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const [editData, setEditData] = useState(null);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // 🩹 Fix: Prevent crash if data is undefined
  if (!data) {
    return (
      <Paper sx={{ padding: 4, textAlign: "center" }}>
        <CircularProgress />
        <p>Loading {title}...</p>
      </Paper>
    );
  }

  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleEditClick = (row) => {
    setEditData(row);
  };

  const handleClose = () => {
    setEditData(null);
  };

  const handleSave = () => {
    onEdit(editData);
    handleClose();
  };

  return (
    <Paper sx={{   padding: 3,
    borderRadius: 3,
    boxShadow: 4,
    backgroundColor: "#fff",
    overflow: "hidden",}}>
      <h2 style={{ marginBottom: "10px", fontFamily: "Poppins", fontWeight: "600" }}>
        {title}
      </h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    transition: "0.2s ease",
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field}>{row[col.field]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(data.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Edit Modal */}
      <Dialog open={!!editData} onClose={handleClose}>
        <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {columns.map((col) => (
            <TextField
              key={col.field}
              label={col.headerName}
              value={editData ? editData[col.field] : ""}
              onChange={(e) =>
                setEditData({ ...editData, [col.field]: e.target.value })
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>


          
        </DialogActions>
      </Dialog>

    </Paper>
  );
};

export default DataTable;
