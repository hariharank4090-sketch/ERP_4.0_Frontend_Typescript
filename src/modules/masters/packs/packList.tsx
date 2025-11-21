import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button } from "@mui/material";
import { toast } from "react-toastify";
import { Edit } from "@mui/icons-material";
import type { PageProps } from "../../../routes/indexRouter";
import type { Pack } from "../types";
import { createPack, getPacks, updatePack } from "./api";
import DataTable, { createCol } from "../../../components/dataTable";
import { toNumber } from "../../../utils/helper";

const initialPackState: Pack = {
    Pack_Id: 0,
    Pack: "",
};

const PackList: React.ComponentType<PageProps> = ({
    loadingOff, loadingOn
}) => {
    const [packs, setPacks] = useState<Pack[]>([]);
    const [pack, setPack] = useState<Pack>(initialPackState);
    const [dialog, setDialog] = useState({
        createDialog: false,
        deleteDialog: false,
    });

    async function fetchPackData(): Promise<Pack[] | any> {
        try {
            const res = await getPacks({ loadingOn, loadingOff });
            setPacks(res);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchPackData();
    }, []);

    const closeDialog = () => {
        setDialog(pre => ({ ...pre, createDialog: false, deleteDialog: false }));
        setPack(initialPackState);
    }

    const onSuccess = () => {
        closeDialog();
        fetchPackData();
    }

    const savePack = async () => {
        if (!pack.Pack) return toast.warn('Enter Pack');

        await (toNumber(pack.Pack_Id) !== 0
            ? updatePack({
                id: pack.Pack_Id,
                bodyData: pack,
                loadingOn,
                loadingOff,
                onSuccess
            })
            : createPack({
                bodyData: pack,
                loadingOn,
                loadingOff,
                onSuccess
            }));
    }

    return (
        <>
            <DataTable
                title="Packs"
                EnableSerialNumber
                dataArray={packs}
                columns={[
                    createCol('Pack', 'string', 'Pack'),
                    {
                        isVisible: 1,
                        ColumnHeader: 'Actions',
                        align: 'center',
                        verticalAlign: 'center',
                        isCustomCell: true,
                        Cell: ({ row }) => (
                            <>
                                <IconButton onClick={() => {
                                    setPack(row);
                                    setDialog(pre => ({ ...pre, createDialog: true }));
                                }}>
                                    <Edit />
                                </IconButton>
                            </>
                        )

                    }
                ]}
                ButtonArea={
                    <>
                        <Button onClick={() => {
                            setDialog(pre => ({ ...pre, createDialog: true }));
                        }}>Add</Button>
                    </>
                }
            />

            <Dialog
                open={dialog.createDialog}
                onClose={closeDialog}
                maxWidth='sm' fullWidth
            >
                <DialogTitle>Add New Pack</DialogTitle>
                <DialogContent>
                    <label>Pack</label>
                    <input
                        className="cus-inpt"
                        type="text"
                        value={pack.Pack}
                        onChange={(e) => setPack({ ...pack, Pack: e.target.value })}
                        placeholder="Enter Pack"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeDialog}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={savePack}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PackList;