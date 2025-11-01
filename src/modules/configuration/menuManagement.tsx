import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
    MenuItem, InputLabel, FormControl, FormControlLabel, Switch, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Stack, Typography, Snackbar, Alert
} from "@mui/material";
import { Add, Edit } from '@mui/icons-material';
import type { MenuRow, MenuPayload, MenuFormState, MenuFormDialogProps, ToastState } from "./types";
import baseURL from "../../config/baseURL";
import { getAppMenuData } from "./api";

const apiPath = 'configuration/appMenu'

// ---------------- helpers (pure) ----------------
function buildMaps(rows: MenuRow[]) {
    const byId = new Map<number, MenuRow>();
    const children = new Map<number | null, MenuRow[]>();
    console.log(rows)
    rows.forEach((r) => {
        byId.set(r.menuId, r);
        const key = r.parentId ?? null;
        if (!children.has(key)) children.set(key, []);
        children.get(key)!.push(r);
    });
    return { byId, children };
}

function computeFullPath(row: MenuRow, byId: Map<number, MenuRow>): string {
    const parts: string[] = [];
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur) {
        if (guard.has(cur.menuId)) break; // safety on accidental cycles
        guard.add(cur.menuId);
        parts.unshift(cur.slug);
        cur = cur.parentId ? byId.get(cur.parentId) : null;
    }
    return "/" + parts.join("/");
}

function buildDepth(row: MenuRow, byId: Map<number, MenuRow>): number {
    let depth = 0;
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur && cur.parentId) {
        if (guard.has(cur.menuId)) break;
        guard.add(cur.menuId);
        depth++;
        cur = byId.get(cur.parentId);
    }
    return depth;
}

function computePathSort(row: MenuRow, byId: Map<number, MenuRow>): string {
    const parts: string[] = [];
    let cur: MenuRow | undefined | null = row;
    const guard = new Set<number>();
    while (cur) {
        if (guard.has(cur.menuId)) break;
        guard.add(cur.menuId);
        const so = cur.sortOrder == null ? 1000 : cur.sortOrder;
        parts.unshift(String(so).padStart(6, "0") + ":" + (cur.slug || ""));
        cur = cur.parentId ? byId.get(cur.parentId) : null;
    }
    return parts.join("/");
}

function collectDescendants(rootId: number, childrenMap: Map<number | null, MenuRow[]>): Set<number> {
    const out = new Set<number>();
    const stack: number[] = [rootId];
    while (stack.length) {
        const id = stack.pop()!;
        const kids = childrenMap.get(id) || [];
        for (const k of kids) {
            out.add(k.menuId);
            stack.push(k.menuId);
        }
    }
    return out; // menuIds
}

const defaultForm: MenuFormState = {
    menuId: null,
    parentId: null,
    slug: "",
    title: "",
    iconKey: "",
    menuType: 0,
    isActive: true,
    isVisible: true,
    sortOrder: 1,
    componentKey: "",
};

function MenuFormDialog({ open, onClose, initial, allMenus, onSubmit }: MenuFormDialogProps) {
    const [form, setForm] = useState<MenuFormState>(initial || defaultForm);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        setForm(initial || defaultForm);
    }, [initial]);

    const { children: childrenMap } = useMemo(() => buildMaps(allMenus || []), [allMenus]);

    const blockedParentIds = useMemo(() => {
        if (!form.menuId) return new Set<number>();
        const desc = collectDescendants(form.menuId, childrenMap);
        desc.add(form.menuId); // cannot parent to itself
        return desc;
    }, [form.menuId, childrenMap]);

    const options = useMemo(() => {
        const rows = allMenus || [];
        const byIdLocal = new Map<number, MenuRow>(rows.map((r) => [r.menuId, r]));
        const enriched = rows.map((r) => ({
            ...r,
            fullPath: computeFullPath(r, byIdLocal),
            depth: buildDepth(r, byIdLocal),
            pathSort: computePathSort(r, byIdLocal),
        }));
        enriched.sort((a, b) => a.pathSort.localeCompare(b.pathSort));
        return enriched;
    }, [allMenus]);

    const handleChange = <K extends keyof MenuFormState>(key: K, val: MenuFormState[K]) =>
        setForm((f) => ({ ...f, [key]: val } as MenuFormState));

    const submit = async () => {
        if (!form.slug?.trim()) return alert("Slug is required");
        if (!form.title?.trim()) return alert("Title is required");

        const payload: MenuPayload = {
            parentId: form.parentId || null,
            slug: form.slug.trim(),
            title: form.title.trim(),
            iconKey: form.iconKey?.trim?.() || null,
            menuType: Number(form.menuType) || 0,
            isActive: !!form.isActive,
            isVisible: !!form.isVisible,
            sortOrder: form.sortOrder === "" || form.sortOrder === null ? null : Number(form.sortOrder),
            componentKey: form.componentKey?.trim?.() || null,
        };

        setSaving(true);
        try {
            await onSubmit(form.menuId, payload);
            onClose(true);
        } catch (e: any) {
            console.error(e);
            alert(e?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={(_, __) => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{form.menuId ? "Edit Menu" : "Create Menu"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <FormControl fullWidth>
                        <InputLabel id="parent-select-label">Parent</InputLabel>
                        <Select
                            labelId="parent-select-label"
                            label="Parent"
                            value={form.parentId ?? ""}
                            onChange={(e: any) =>
                                handleChange("parentId", e.target.value === "" ? null : Number(e.target.value))
                            }
                        >
                            <MenuItem value="">
                                <em>— Root —</em>
                            </MenuItem>
                            {options.map((r) => (
                                <MenuItem key={r.menuId} value={r.menuId} disabled={blockedParentIds.has(r.menuId)}>
                                    <span style={{ paddingLeft: (r as any).depth * 12 }}>{(r as any).fullPath}</span>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Slug"
                        value={form.slug}
                        onChange={(e) => {
                            const v = e.target.value
                                .replace(/[^a-zA-Z0-9\-_/]/g, "-")
                                .replace(/\/+/, "/")
                                .replace(/\s+/g, "-")
                                .toLowerCase();
                            handleChange("slug", v);
                        }}
                        helperText="URL segment, e.g. salesInvoice or create"
                        fullWidth
                    />

                    <TextField label="Title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} fullWidth />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="menu-type-label">Menu Type</InputLabel>
                            <Select
                                labelId="menu-type-label"
                                label="Menu Type"
                                value={form.menuType}
                                onChange={(e: any) => handleChange("menuType", Number(e.target.value))}
                            >
                                <MenuItem value={0}>Page</MenuItem>
                                <MenuItem value={1}>Group/Section</MenuItem>
                                <MenuItem value={2}>Action</MenuItem>
                                <MenuItem value={3}>External</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Sort Order"
                            type="number"
                            value={form.sortOrder as any}
                            onChange={(e) => handleChange("sortOrder", e.target.value === "" ? "" : Number(e.target.value))}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Icon Key"
                            value={form.iconKey || ""}
                            onChange={(e) => handleChange("iconKey", e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Component Key"
                            value={form.componentKey || ""}
                            onChange={(e) => handleChange("componentKey", e.target.value)}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControlLabel
                            control={<Switch checked={!!form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} />}
                            label="Active"
                        />
                        <FormControlLabel
                            control={<Switch checked={!!form.isVisible} onChange={(e) => handleChange("isVisible", e.target.checked)} />}
                            label="Visible"
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={submit} variant="contained" startIcon={<Add />} disabled={saving}>
                    {saving ? "Saving..." : form.menuId ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const MenuManagement: React.ComponentType<{
    loading: boolean,
    loadingOn: () => void,
    loadingOff: () => void
}> = ({ loading = false, loadingOn = () => { }, loadingOff = () => { } }) => {
    const [rows, setRows] = useState<MenuRow[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogInitial, setDialogInitial] = useState<MenuFormState | null>(null);
    const [toast, setToast] = useState<ToastState>({ open: false, msg: "", severity: "success" });

    async function fetchMenuData(): Promise<MenuRow[] | any> {
        try {
            const res = await getAppMenuData(loadingOn, loadingOff);
            setRows(res);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchMenuData();
    }, []);

    const { byId } = useMemo(() => buildMaps(rows), [rows]);
    const enriched = useMemo(() => {
        const byIdLocal = new Map<number, MenuRow>(rows.map((r) => [r.menuId, r]));
        const out = rows.map((r) => ({
            ...r,
            fullPath: computeFullPath(r, byIdLocal),
            depth: buildDepth(r, byIdLocal),
            pathSort: computePathSort(r, byIdLocal),
        }));
        (out as any).sort((a: any, b: any) => a.pathSort.localeCompare(b.pathSort));
        return out as (MenuRow & { fullPath: string; depth: number; pathSort: string })[];
    }, [rows]);

    const openCreateRoot = () => {
        setDialogInitial({ ...defaultForm, parentId: null });
        setDialogOpen(true);
    };

    const openCreateChild = (row: MenuRow) => {
        setDialogInitial({ ...defaultForm, parentId: row.menuId });
        setDialogOpen(true);
    };

    const openEdit = (row: MenuRow) => {
        setDialogInitial({
            menuId: row.menuId,
            parentId: row.parentId ?? null,
            slug: row.slug,
            title: row.title,
            iconKey: row.iconKey || "",
            menuType: row.menuType ?? 0,
            isActive: !!row.isActive,
            isVisible: !!row.isVisible,
            sortOrder: row.sortOrder ?? 1000,
            componentKey: row.componentKey || "",
        });
        setDialogOpen(true);
    };

    const handleDialogClose = (changed: boolean) => {
        setDialogOpen(false);
        setDialogInitial(null);
        if (changed) fetchMenuData();
    };

    const handleSubmit = async (menuId: number | null, payload: MenuPayload) => {
        const url = `${baseURL + apiPath}/${menuId ? menuId : ''}`;

        try {
            if (menuId)
                await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            else
                await fetch(url, {
                    method: menuId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            setToast({ open: true, msg: "Menu saved", severity: "success" });
            await fetchMenuData();
        } catch (e: any) {
            console.error(e);
            setToast({ open: true, msg: e?.message || "Save failed", severity: "error" });
        }
    };

    return (
        <Box p={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Menu Management</Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={fetchMenuData} disabled={loading}>
                        Refresh
                    </Button>
                    <Button variant="contained" startIcon={<Add />} onClick={openCreateRoot}>
                        Create Root
                    </Button>
                </Stack>
            </Stack>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Full Path</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Parent</TableCell>
                            <TableCell>Sort</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Visible</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {enriched.map((r) => (
                            <TableRow key={r.menuId} hover>
                                <TableCell>
                                    <span style={{ paddingLeft: (r as any).depth * 16 }}>{(r as any).title}</span>
                                </TableCell>
                                <TableCell>{r.slug}</TableCell>
                                <TableCell>{(r as any).fullPath}</TableCell>
                                <TableCell>{["Page", "Group", "Action", "External"][r.menuType ?? 0]}</TableCell>
                                <TableCell>{r.parentId ? byId.get(r.parentId)?.title : "—"}</TableCell>
                                <TableCell>{r.sortOrder ?? ""}</TableCell>
                                <TableCell>{r.isActive ? "Yes" : "No"}</TableCell>
                                <TableCell>{r.isVisible ? "Yes" : "No"}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" title="Edit" onClick={() => openEdit(r)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" title="Create Child" onClick={() => openCreateChild(r)}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {enriched.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography color="text.secondary">No menus found.</Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <MenuFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                initial={dialogInitial}
                allMenus={rows}
                onSubmit={handleSubmit}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={toast.severity} sx={{ width: "100%" }}>
                    {toast.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default MenuManagement;