// AreaMaster.page.tsx

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
  getAreas, 
  createArea, 
  updateArea, 
  deleteArea,
  getDistrictDropdown 
} from "./area.api";

import type { 
  AreaData, 
  DistrictDropdown 
} from "./area.types";

import type { PageProps } from "../../../routes/indexRouter";

interface Area extends AreaData {
  District_Name?: string;
}

const emptyArea: Area = {
  Area_Id: 0,
  Area_Name: "",
  District_Id: 0,
  District_Name: "",
};

const AreaMaster: React.ComponentType<PageProps> = ({
  loadingOn,
  loadingOff,
}) => {
  const [areaList, setAreaList] = useState<Area[]>([]);
  const [filteredList, setFilteredList] = useState<Area[]>([]);
  const [districts, setDistricts] = useState<DistrictDropdown[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [areaObj, setAreaObj] = useState<Area>(emptyArea);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [dialog, setDialog] = useState({
    createDialog: false,
    deleteDialog: false,
  });

  /** Load area list */
  const loadAreas = async () => {
    try {
      const list = await getAreas(loadingOn, loadingOff);
      setAreaList(list || []);
      setFilteredList(list || []);
    } catch  {
      toast.error("Failed to load areas");
      setAreaList([]);
      setFilteredList([]);
    }
  };

  /** Load district dropdown + area list */
  useEffect(() => {
    (async () => {
      try {
        const districtData = await getDistrictDropdown(loadingOn, loadingOff);
        // Ensure districts is always a flat array
        const flatDistricts = Array.isArray(districtData) ? districtData : [];
        setDistricts(flatDistricts);
        console.log("Districts loaded:", flatDistricts);
        
        await loadAreas();
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load initial data");
      }
    })();
  }, []);

  /** Search filter */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(areaList);
      return;
    }

    const s = searchTerm.toLowerCase();
    setFilteredList(
      areaList.filter(
        (a) =>
          a.Area_Name.toLowerCase().includes(s) ||
          a.District_Name?.toLowerCase().includes(s) ||
          getDistrictName(a.District_Id).toLowerCase().includes(s)
      )
    );
  }, [searchTerm, areaList, districts]);

  /** Function to get District Name from District_Id */
  const getDistrictName = (districtId: number): string => {
    if (!districts || districts.length === 0) return "Loading...";
    
    const district = districts.find(d => d.District_Id === districtId);
    return district ? district.District_Name : `District ${districtId}`;
  };

  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setSelectedId(null);
    setAreaObj(emptyArea);
  };

  /** Create */
  const handleCreate = () => {
    setAreaObj(emptyArea);
    setSelectedId(null);
    setDialog({ ...dialog, createDialog: true });
  };

  /** Edit */
  const handleEdit = (row: Area) => {
    setSelectedId(row.Area_Id);
    setAreaObj({
      Area_Id: row.Area_Id,
      Area_Name: row.Area_Name,
      District_Id: row.District_Id,
      District_Name: row.District_Name || getDistrictName(row.District_Id),
    });
    setDialog({ ...dialog, createDialog: true });
  };

  /** Delete Click */
  const handleDelete = (row: Area) => {
    setSelectedId(row.Area_Id);
    setAreaObj(row);
    setDialog({ ...dialog, deleteDialog: true });
  };

  /** Save (Create or Update) */
  const saveArea = async () => {
    if (!areaObj.Area_Name.trim()) {
      toast.warn("Area Name is required");
      return;
    }
    if (!areaObj.District_Id) {
      toast.warn("District is required");
      return;
    }

    try {
      let ok = false;

      if (selectedId) {
        ok = await updateArea(
          {
            Area_Id: selectedId,
            Area_Name: areaObj.Area_Name.trim(),
            District_Id: areaObj.District_Id,
          },
          loadingOn,
          loadingOff
        );
      } else {
        ok = await createArea(
          {
            Area_Name: areaObj.Area_Name.trim(),
            District_Id: areaObj.District_Id,
          },
          loadingOn,
          loadingOff
        );
      }

      if (ok) {
        toast.success(`Area ${selectedId ? "updated" : "created"} successfully`);
        closeDialog();
        await loadAreas();
      }
    } catch  {
      toast.error("Failed to save area");
    }
  };

  /** Confirm delete */
  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const ok = await deleteArea(
        selectedId,
        loadingOn,
        loadingOff
      );

      if (ok) {
        toast.success("Area deleted successfully");
        closeDialog();
        await loadAreas();
      }
    } catch  {
      toast.error("Failed to delete area");
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
          placeholder="Search Area or District..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ width: 280 }}
        />

        

        <Button variant="contained" onClick={handleCreate}>
                  Create Area
                </Button>
      </div>

      <DataTable
        title="Area Management"
        EnableSerialNumber
        dataArray={filteredList}
        columns={[
          createCol("Area_Name", "string", "Area Name"),
          {
            isVisible: 1,
            ColumnHeader: "District Name",
            align: "left",
            isCustomCell: true,
            Cell: ({ row }: { row: Area }) => (
              <span>{getDistrictName(row.District_Id)}</span>
            ),
          },
          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: Area }) => (
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
          {selectedId ? "Edit Area" : "Create Area"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            select
            margin="dense"
            label="District"
            value={areaObj.District_Id || ""}
            onChange={(e) =>
              setAreaObj({
                ...areaObj,
                District_Id: Number(e.target.value),
              })
            }
            required
          >
            <MenuItem value="">
              <em>Select District</em>
            </MenuItem>
            {districts.map((d) => (
              <MenuItem key={d.District_Id} value={d.District_Id}>
                {d.District_Name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="Area Name"
            value={areaObj.Area_Name}
            onChange={(e) =>
              setAreaObj({
                ...areaObj,
                Area_Name: e.target.value,
              })
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                saveArea();
              }
            }}
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveArea}>
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
        <DialogTitle>Delete Area</DialogTitle>

        <DialogContent>
          Are you sure you want to delete: <b>{areaObj.Area_Name}</b>?
          <br />
          <small>District: {getDistrictName(areaObj.District_Id)}</small>
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

export default AreaMaster;