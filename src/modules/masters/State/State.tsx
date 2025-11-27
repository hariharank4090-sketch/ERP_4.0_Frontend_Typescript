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
import { Edit, Delete, Search } from "@mui/icons-material";
import { toast } from "react-toastify";

import DataTable, { createCol } from "../../../components/dataTable";

import {
  getStates,
  createState,
  updateState,
  deleteState,
} from "./state.api";

import type {
  StateData,
  StateCreateInput,
  StateUpdateInput,
} from "./state.types";

import { initialState as emptyState } from "./state.types";
import type { PageProps } from "../../../routes/indexRouter";

const StatePage: React.ComponentType<PageProps> = ({
  loadingOn,
  loadingOff,
}) => {
  const [states, setStates] = useState<StateData[]>([]);
  const [filteredStates, setFilteredStates] = useState<StateData[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [stateObj, setStateObj] = useState<StateCreateInput>(emptyState);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [dialog, setDialog] = useState({
    createDialog: false,
    deleteDialog: false,
  });

  /** Fetch List */
  const fetchStateList = async () => {
    const list = await getStates(loadingOn, loadingOff);
    setStates(list);
    setFilteredStates(list);
  };

  useEffect(() => {
    fetchStateList();
  }, []);

  /** SEARCH FILTER */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStates(states);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = states.filter((s) =>
      s.State_Name.toLowerCase().includes(term)
    );

    setFilteredStates(filtered);
  }, [searchTerm, states]);

  /** Close all dialogs */
  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setSelectedId(null);
    setStateObj(emptyState);
  };

  /** Edit */
  const handleEdit = (row: StateData) => {
    setSelectedId(row.State_Id);
    setStateObj({
      State_Name: row.State_Name,
    });
    setDialog({ ...dialog, createDialog: true });
  };

  /** Delete click */
  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDialog({ ...dialog, deleteDialog: true });
  };

  /** Save / Update */
  const saveState = async () => {
    if (!stateObj.State_Name.trim()) {
      toast.warn("Enter State Name");
      return;
    }

    const payload = { State_Name: stateObj.State_Name.trim() };
    let success = false;

    if (selectedId) {
      success = await updateState(
        selectedId,
        payload as StateUpdateInput,
        loadingOn,
        loadingOff
      );
    } else {
      success = await createState(
        payload as StateCreateInput,
        loadingOn,
        loadingOff
      );
    }

    if (success) {
      closeDialog();
      fetchStateList();
    }
  };

  /** Delete Confirm */
  const deleteStateConfirm = async () => {
    if (!selectedId) return;

    const success = await deleteState(selectedId, loadingOn, loadingOff);

    if (success) {
      closeDialog();
      fetchStateList();
    }
  };

  return (
    <>
      {/* 🔍 SEARCH + ➕ ADD BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center",
          
        }}
      >
        {/* SEARCH INPUT */}
        <TextField
          size="small"
          placeholder="Search State..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
          }}
          sx={{ width: "280px" }}
        />

        {/* ADD BUTTON */}
        <Button
          variant="contained"
          onClick={() => {
            setStateObj(emptyState);
            setSelectedId(null);
            setDialog({ ...dialog, createDialog: true });
          }}
          sx={{ background: "#6C5DD3", color: "#fff" }}
        >
          Add State
        </Button>
      </div>

      <DataTable
        title="State Master"
        EnableSerialNumber
        dataArray={filteredStates}
        columns={[
          createCol("State_Name", "string", "State Name"),

          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: StateData }) => (
              <>
                <IconButton
                  onClick={() => handleEdit(row)}
                  color="primary"
                  size="small"
                >
                  <Edit />
                </IconButton>

                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(row.State_Id)}
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
          {selectedId ? "Edit State" : "Create State"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="State Name"
            value={stateObj.State_Name}
            onChange={(e) =>
              setStateObj({ State_Name: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!stateObj.State_Name.trim()}
            onClick={saveState}
          >
            {selectedId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={dialog.deleteDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete State</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this state?
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteStateConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StatePage;
