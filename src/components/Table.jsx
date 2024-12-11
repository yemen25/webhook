import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const columns = React.useMemo(
    () => [
      { field: "TITLE", headerName: "Title", width: 200 },
      { field: "CURRENCY", headerName: "Currency", width: 150 },
      { field: "STAGE", headerName: "Stage", width: 150 },
      { field: "OPPORTUNITY", headerName: "Opportunity", width: 150 },
      { field: "TYPE", headerName: "Type", width: 150 },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  const getData = async () => {
    try {
      const response = await axios.get(
        "https://b24-vhllhk.bitrix24.com/rest/1/w87hywenqphcvbe7/crm.deal.list.json?FILTER[%3EDATE_CREATE]=2019-01-01"
      );

      const apiData = response.data.result;

      const formattedData = apiData.map((item) => ({
        id: item.ID,
        TITLE: item.TITLE || "Untitled",
        CURRENCY: item.CURRENCY_ID || "N/A",
        STAGE: item.STAGE_ID || "N/A",
        OPPORTUNITY: item.OPPORTUNITY || "N/A",
        TYPE: item.TYPE_ID || "N/A",
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        "https://b24-vhllhk.bitrix24.com/rest/1/w87hywenqphcvbe7/crm.deal.delete.json",
        { ID: id }
      );

      if (response.data.result) {
        getData(); 
      } else {
        console.error("Delete failed", response.data);
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleInputChange = debounce((key, value) => {
    setEditRow((prev) => ({ ...prev, [key]: value }));
  }, 100);

  const handleSave = async () => {
    try {
      // Prepare the fields object with only the relevant keys
      const fields = {
        TITLE: editRow.TITLE,
        CURRENCY_ID: editRow.CURRENCY,
        STAGE_ID: editRow.STAGE,
        OPPORTUNITY: editRow.OPPORTUNITY,
        TYPE_ID: editRow.TYPE,
      };

      // Send the update request
      await axios.post(
        "https://b24-vhllhk.bitrix24.com/rest/1/w87hywenqphcvbe7/crm.deal.update.json",
        {
          ID: editRow.id, // Ensure 'id' is passed here, not 'ID'
          fields: fields,
        }
      );

      getData();
      setOpen(false);
      setEditRow(null);
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box sx={{ width: "100%" }} className="container">
      <Box sx={{ width: "90%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-lead")}
          >
            Add Lead
          </Button>
        </Box>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogContent>
            {editRow &&
              Object.keys(editRow).map((key) => (
                <TextField
                  key={key}
                  margin="dense"
                  label={key}
                  type="text"
                  fullWidth
                  value={editRow[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DataTable;
