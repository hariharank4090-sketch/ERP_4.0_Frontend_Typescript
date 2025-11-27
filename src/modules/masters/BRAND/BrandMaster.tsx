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
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./brand.api";

import type {
  BrandData,
  BrandCreateInput,
  BrandUpdateInput,
} from "./brand.types";

import { initialState as emptyBrand } from "./brand.types";
import type { PageProps } from "../../../routes/indexRouter";

const BrandPage: React.ComponentType<PageProps> = ({
  loadingOn,
  loadingOff,
}) => {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<BrandData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandObj, setBrandObj] = useState<BrandCreateInput>(emptyBrand);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialog, setDialog] = useState({
    createDialog: false,
    deleteDialog: false,
  });

  /** Fetch Brands List */
  const fetchBrandList = async () => {
    const list = await getBrands(loadingOn, loadingOff);
    setBrands(list);
    setFilteredBrands(list);
  };

  useEffect(() => {
    fetchBrandList();
  }, []);

  /** SEARCH FILTER */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBrands(brands);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = brands.filter((b) =>
      b.Brand_Name.toLowerCase().includes(term)
    );

    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  /** Close all dialogs */
  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setSelectedId(null);
    setBrandObj(emptyBrand);
  };

  /** Edit */
  const handleEdit = (row: BrandData) => {
    setSelectedId(row.Brand_Id);
    setBrandObj({
      Brand_Name: row.Brand_Name,
      Pro_T_Id: row.Pro_T_Id, // Keep the existing Pro_T_Id
    });
    setDialog({ ...dialog, createDialog: true });
  };

  /** Delete click */
  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDialog({ ...dialog, deleteDialog: true });
  };

  /** Save / Update */
  const saveBrand = async () => {
    if (!brandObj.Brand_Name.trim()) {
      toast.warn("Enter Brand Name");
      return;
    }

    const payload = { 
      Brand_Name: brandObj.Brand_Name.trim(),
      Pro_T_Id: brandObj.Pro_T_Id // Include Pro_T_Id with default value
    };
    
    let success = false;

    if (selectedId) {
      success = await updateBrand(
        selectedId,
        payload as BrandUpdateInput,
        loadingOn,
        loadingOff
      );
    } else {
      success = await createBrand(
        payload as BrandCreateInput,
        loadingOn,
        loadingOff
      );
    }

    if (success) {
      closeDialog();
      fetchBrandList();
    }
  };

  /** Delete Confirm */
  const deleteBrandConfirm = async () => {
    if (!selectedId) return;

    const success = await deleteBrand(selectedId, loadingOn, loadingOff);

    if (success) {
      closeDialog();
      fetchBrandList();
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
          placeholder="Search Brand..."
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
            setBrandObj(emptyBrand);
            setSelectedId(null);
            setDialog({ ...dialog, createDialog: true });
          }}
          sx={{ background: "#6C5DD3", color: "#fff" }}
        >
          Add Brand
        </Button>
      </div>

      <DataTable
        title="Brand Master"
        EnableSerialNumber
        dataArray={filteredBrands}
        columns={[
          createCol("Brand_Name", "string", "Brand Name"),
          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: BrandData }) => (
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
                  onClick={() => handleDelete(row.Brand_Id)}
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
          {selectedId ? "Edit Brand" : "Create Brand"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Brand Name"
            value={brandObj.Brand_Name}
            onChange={(e) =>
              setBrandObj({ ...brandObj, Brand_Name: e.target.value })
            }
            placeholder="Enter brand name"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!brandObj.Brand_Name.trim()}
            onClick={saveBrand}
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
        <DialogTitle>Delete Brand</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this brand?
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteBrandConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BrandPage;