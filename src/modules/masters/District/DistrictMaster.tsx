// DistrictMaster.tsx — WITH BETTER STATE HANDLING

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { toast } from "react-toastify";

import DataTable, { createCol } from "../../../components/dataTable";

import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getStateDropdown,
} from "./district.api";

import type {
  StateDropdown,
  DistrictData,
} from "./district.types";

import type { PageProps } from "../../../routes/indexRouter";

interface District extends DistrictData {
  State_Name?: string;
}

const emptyDistrict: District = {
  District_Id: 0,
  District_Name: "",
  State_Id: 0,
  State_Name: "",
};

const DistrictMaster: React.ComponentType<PageProps> = ({
  loadingOn,
  loadingOff,
}) => {
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [filteredList, setFilteredList] = useState<District[]>([]);
  const [states, setStates] = useState<StateDropdown[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [districtObj, setDistrictObj] = useState<District>(emptyDistrict);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [dialog, setDialog] = useState({
    createDialog: false,
    deleteDialog: false,
  });

  /** Load district list */
  const loadDistricts = async () => {
    try {
      const list = await getDistricts(loadingOn, loadingOff);
      setDistrictList(list || []);
      setFilteredList(list || []);
    } catch (error) {
      console.error(error)
      toast.error("Failed to load districts");
      setDistrictList([]);
      setFilteredList([]);
    }
  };

  /** Load state dropdown + district list */
  useEffect(() => {
    (async () => {
      try {
        const st = await getStateDropdown(loadingOn, loadingOff);
        // Ensure states is always a flat array
        const flatStates = Array.isArray(st) ? st : [];
        setStates(flatStates);
        console.log("States loaded:", flatStates);
        
        await loadDistricts();
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load initial data");
      }
    })();
  }, []);

  /** Search filter */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(districtList);
      return;
    }

    const s = searchTerm.toLowerCase();
    setFilteredList(
      districtList.filter(
        (d) =>
          d.District_Name.toLowerCase().includes(s) ||
          d.State_Name?.toLowerCase().includes(s) ||
          getStateName(d.State_Id).toLowerCase().includes(s)
      )
    );
  }, [searchTerm, districtList, states]);

  /** Function to get State Name from State_Id */
  const getStateName = (stateId: number): string => {
    if (!states || states.length === 0) return "Loading...";
    
    const state = states.find(s => s.State_Id === stateId);
    return state ? state.State_Name : `State ${stateId}`;
  };

  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setSelectedId(null);
    setDistrictObj(emptyDistrict);
  };

  /** Create */
  const handleCreate = () => {
    setDistrictObj(emptyDistrict);
    setSelectedId(null);
    setDialog({ ...dialog, createDialog: true });
  };

  /** Edit */
  const handleEdit = (row: District) => {
    setSelectedId(row.District_Id);
    setDistrictObj({
      District_Id: row.District_Id,
      District_Name: row.District_Name,
      State_Id: row.State_Id,
      State_Name: row.State_Name || getStateName(row.State_Id),
    });
    setDialog({ ...dialog, createDialog: true });
  };

  /** Delete Click */
  const handleDelete = (row: District) => {
    setSelectedId(row.District_Id);
    setDistrictObj(row);
    setDialog({ ...dialog, deleteDialog: true });
  };

  /** Save (Create or Update) */
  const saveDistrict = async () => {
    if (!districtObj.District_Name.trim()) {
      toast.warn("District Name is required");
      return;
    }
    if (!districtObj.State_Id) {
      toast.warn("State is required");
      return;
    }

    try {
      let ok = false;

      if (selectedId) {
        ok = await updateDistrict(
          {
            District_Id: selectedId,
            District_Name: districtObj.District_Name.trim(),
            State_Id: districtObj.State_Id,
          },
          loadingOn,
          loadingOff
        );
      } else {
        ok = await createDistrict(
          {
            District_Name: districtObj.District_Name.trim(),
            State_Id: districtObj.State_Id,
          },
          loadingOn,
          loadingOff
        );
      }

      if (ok) {
        toast.success(`District ${selectedId ? "updated" : "created"} successfully`);
        closeDialog();
        await loadDistricts();
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to save district");
    }
  };

  /** Confirm delete */
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const ok = await deleteDistrict(
        selectedId,
        loadingOn,
        loadingOff
      );

      if (ok) {
        toast.success("District deleted successfully");
        closeDialog();
        await loadDistricts();
      }
    } catch (error) {
       console.error(error)
      toast.error("Failed to delete district");
    }
  };

  return (
    <>
      {/* Search + Add Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          
        }}
      >
        <TextField
          size="small"
          placeholder="Search District or State..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            
          }}
          sx={{ width: 280 }}
        />

        <Button variant="contained" onClick={handleCreate}>
          Add District
        </Button>
      </div>

      <DataTable
        title="District Master"
        EnableSerialNumber
        dataArray={filteredList}
        columns={[
          createCol("District_Name", "string", "District Name"),
          {
            isVisible: 1,
            ColumnHeader: "State Name",
            align: "left",
            isCustomCell: true,
            Cell: ({ row }: { row: District }) => (
              <span>{getStateName(row.State_Id)}</span>
            ),
          },
          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: District }) => (
              <>
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => handleEdit(row)}
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>

                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => handleDelete(row)}
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {/* Create / Edit Dialog */}
      <Dialog 
        open={dialog.createDialog} 
        onClose={closeDialog} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedId ? "Edit District" : "Create District"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            select
            margin="dense"
            label="State"
            value={districtObj.State_Id || ""}
            onChange={(e) =>
              setDistrictObj({
                ...districtObj,
                State_Id: Number(e.target.value),
              })
            }
            required
          >
            <MenuItem value="">
              <em>Select State</em>
            </MenuItem>
            {states.map((s) => (
              <MenuItem key={s.State_Id} value={s.State_Id}>
                {s.State_Name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="District Name"
            value={districtObj.District_Name}
            onChange={(e) =>
              setDistrictObj({
                ...districtObj,
                District_Name: e.target.value,
              })
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                saveDistrict();
              }
            }}
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveDistrict}>
            {selectedId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog 
        open={dialog.deleteDialog} 
        onClose={closeDialog} 
        fullWidth 
        maxWidth="xs"
      >
        <DialogTitle>Delete District</DialogTitle>

        <DialogContent>
          Are you sure you want to delete: <b>{districtObj.District_Name}</b>?
          <br />
          <small>State: {getStateName(districtObj.State_Id)}</small>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>

          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DistrictMaster;