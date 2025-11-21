import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import DataTable, { createCol } from "../../../components/dataTable";
import type { PageProps } from "../../../routes/indexRouter";
import type { UnitData, UnitCreateInput, UnitUpdateInput } from "./types";
import { getUnits, createUnit, updateUnit, deleteUnit } from "./api";
import { initialState } from "./variables";

const UomMaster: React.ComponentType<PageProps> = ({
    loadingOff, loadingOn
}) => { const [uoms, setUoms] = useState<UnitData[]>([]);
  const [unit, setUnit] = useState<UnitCreateInput>(initialState);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialog, setDialog] = useState({ createDialog: false, deleteDialog: false });

  /* Load Units */
  const fetchUomList = async () => {
    try {
      const data = await getUnits(loadingOn, loadingOff);
      setUoms(data || []);
    } catch (error) {
      console.error("Load UOM Error:", error);
    }
  };

  useEffect(() => {
    fetchUomList();
  }, []);

  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setUnit(initialState);
    setSelectedId(null);
  };


  const handleEdit = (row: UnitData) => {
    setSelectedId(row.Unit_Id);
    setUnit({
      Units: row.Units,
    });
    setDialog((p) => ({ ...p, createDialog: true }));
  };

  
  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDialog((p) => ({ ...p, deleteDialog: true }));
  };


  const saveUnit = async () => {
    if (!unit.Units.trim()) {
      toast.warn("Enter Units");
      return;
    }

    const isEdit = selectedId !== null;

    try {
      let success: boolean;

      if (isEdit) {
        const updateBody: UnitUpdateInput = {
          Units: unit.Units.trim(),
          Alter_By: 1,
        };
        success = await updateUnit(selectedId, updateBody, loadingOn, loadingOff); 
      } else {
        const createBody: UnitCreateInput = {
          Units: unit.Units.trim(),
          Created_By: 1 
        };
        success = await createUnit(createBody, loadingOn, loadingOff);
      }

      if (success) {
        closeDialog();
        fetchUomList();
      }
    } catch (e: unknown) {
      console.error("Save Unit Error:", e);
    }
  };


  const deleteUnitConfirm = async () => {
    if (!selectedId) return;

    try {
      const success = await deleteUnit(selectedId, loadingOn, loadingOff); 
      if (success) {
        closeDialog();
        fetchUomList();
      }
    } catch (e: unknown) {
      console.error("Delete Unit Error:", e);
    }
  };

  return (
    <>
      <DataTable
        title="UOM Master"
        EnableSerialNumber
        dataArray={uoms}
        columns={[
          createCol("Unit_Id", "string", "Unit Id"),
          createCol("Units", "string", "Units"),
          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: UnitData }) => (
              <>
                <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
                  <Edit />
                </IconButton>
                <IconButton color="error" size="small" onClick={() => handleDelete(row.Unit_Id)}>
                  <Delete />
                </IconButton>
              </>
            ),
          },
        ]}
        ButtonArea={
          <Button
            variant="contained"
            onClick={() => {
              setUnit(initialState);
              setSelectedId(null);
              setDialog((p) => ({ ...p, createDialog: true }));
            }}
          >
            Add UOM
          </Button>
        }
      />

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.createDialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedId ? "Edit UOM" : "Create UOM"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Units"
            value={unit.Units}
            onChange={(e) => setUnit({ ...unit, Units: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && saveUnit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" disabled={!unit.Units.trim()} onClick={saveUnit}>
            {selectedId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialog.deleteDialog} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete UOM</DialogTitle>
        <DialogContent>Are you sure you want to delete this Unit of Measure?</DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={deleteUnitConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UomMaster;