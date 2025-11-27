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
  getProductGroups,
  createProductGroup,
  updateProductGroup,
  deleteProductGroup,
} from "./Product.api";

import type {
  ProductGroupData,
  ProductGroupCreateInput,
  ProductGroupUpdateInput,
} from "./product.types";

import { initialState as emptyProductGroup } from "./product.types";
import type { PageProps } from "../../../routes/indexRouter";

const ProductGroupPage: React.FC<PageProps> = ({ loadingOn, loadingOff }) => {
  const [productGroups, setProductGroups] = useState<ProductGroupData[]>([]);
  const [filteredProductGroups, setFilteredProductGroups] = useState<ProductGroupData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [productGroupObj, setProductGroupObj] =
    useState<ProductGroupCreateInput>(emptyProductGroup);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialog, setDialog] = useState({
    createDialog: false,
    deleteDialog: false,
  });

  /** ------------------------------
   ** Load List
   ** ------------------------------ */
  const fetchProductGroupList = async () => {
    const list = await getProductGroups(loadingOn, loadingOff);
    setProductGroups(list);
    setFilteredProductGroups(list);
  };

  useEffect(() => {
    fetchProductGroupList();
  }, []);

  /** ------------------------------
   ** Search Filter
   ** ------------------------------ */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProductGroups(productGroups);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = productGroups.filter((pg) =>
      pg.Pro_Group.toLowerCase().includes(lower)
    );

    setFilteredProductGroups(filtered);
  }, [searchTerm, productGroups]);

  /** Close All Dialogs */
  const closeDialog = () => {
    setDialog({ createDialog: false, deleteDialog: false });
    setSelectedId(null);
    setProductGroupObj(emptyProductGroup);
  };

  /** Edit */
  const handleEdit = (row: ProductGroupData) => {
    setSelectedId(row.Pro_Group_Id);
    setProductGroupObj({ Pro_Group: row.Pro_Group });
    setDialog({ ...dialog, createDialog: true });
  };

  /** Delete Click */
  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDialog({ ...dialog, deleteDialog: true });
  };

  /** Save */
  const saveProductGroup = async () => {
    if (!productGroupObj.Pro_Group.trim()) {
      toast.warn("Enter Product Group Name");
      return;
    }

    const payload = {
      Pro_Group: productGroupObj.Pro_Group.trim(),
    };

    let success = false;

    if (selectedId) {
      success = await updateProductGroup(
        selectedId,
        payload as ProductGroupUpdateInput,
        loadingOn,
        loadingOff
      );
    } else {
      success = await createProductGroup(
        payload as ProductGroupCreateInput,
        loadingOn,
        loadingOff
      );
    }

    if (success) {
      closeDialog();
      fetchProductGroupList();
    }
  };

  /** Delete Confirm */
  const deleteProductGroupConfirm = async () => {
    if (!selectedId) return;

    const success = await deleteProductGroup(selectedId, loadingOn, loadingOff);

    if (success) {
      closeDialog();
      fetchProductGroupList();
    }
  };

  return (
    <>
      {/* SEARCH + ADD */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <TextField
          size="small"
          placeholder="Search Product Group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
          }}
          sx={{ width: 280 }}
        />

        <Button
          variant="contained"
          onClick={() => {
            setSelectedId(null);
            setProductGroupObj(emptyProductGroup);
            setDialog({ ...dialog, createDialog: true });
          }}
          sx={{ background: "#6C5DD3", color: "#fff" }}
        >
          Add Product Group
        </Button>
      </div>

      {/* TABLE */}
      <DataTable
        title="Product Group Master"
        EnableSerialNumber
        dataArray={filteredProductGroups}
        columns={[
          createCol("Pro_Group", "string", "Product Group"),
          {
            isVisible: 1,
            ColumnHeader: "Actions",
            align: "center",
            isCustomCell: true,
            Cell: ({ row }: { row: ProductGroupData }) => (
              <>
                <IconButton onClick={() => handleEdit(row)} size="small" color="primary">
                  <Edit />
                </IconButton>

                <IconButton
                  onClick={() => handleDelete(row.Pro_Group_Id)}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </>
            ),
          },
        ]}
      />

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={dialog.createDialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedId ? "Edit Product Group" : "Create Product Group"}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Product Group Name"
            value={productGroupObj.Pro_Group}
            onChange={(e) =>
              setProductGroupObj({ ...productGroupObj, Pro_Group: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" disabled={!productGroupObj.Pro_Group.trim()} onClick={saveProductGroup}>
            {selectedId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={dialog.deleteDialog} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Product Group</DialogTitle>

        <DialogContent>Are you sure you want to delete this product group?</DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteProductGroupConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductGroupPage;
