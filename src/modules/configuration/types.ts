export type Boolish = boolean | 0 | 1 | null | undefined;

export interface MenuRow {
    menuId: number;
    parentId: number | null;
    slug: string;
    title: string;
    iconKey?: string | null;
    menuType?: number; // 0=page,1=group,2=action,3=external
    isActive?: Boolish;
    isVisible?: Boolish;
    sortOrder?: number | null;
    componentKey?: string | null;
}

export interface MenuPayload {
    parentId: number | null;
    slug: string;
    title: string;
    iconKey: string | null;
    menuType: number;
    isActive: boolean;
    isVisible: boolean;
    sortOrder: number | null;
    componentKey: string | null;
}

export interface ToastState {
    open: boolean;
    msg: string;
    severity: "success" | "error" | "info" | "warning";
}

// -------- form state --------
export interface MenuFormState {
    menuId: number | null;
    parentId: number | null;
    slug: string;
    title: string;
    iconKey: string | null;
    menuType: number;
    isActive: boolean;
    isVisible: boolean;
    sortOrder: number | "" | null;
    componentKey: string | null;
}

// -------- dialog --------
export interface MenuFormDialogProps {
    open: boolean;
    onClose: (changed: boolean) => void;
    initial: MenuFormState | null;
    allMenus: MenuRow[];
    onSubmit: (menuId: number | null, payload: MenuPayload) => Promise<void>;
}