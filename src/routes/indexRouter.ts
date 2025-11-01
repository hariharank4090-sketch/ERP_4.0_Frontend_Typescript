import { configurationRoutePath } from "./configuration";
import { contraRoutePath } from "./contra";
import { journalRoutePath } from "./journal";
import { mastersRoutePath } from "./masters";
import { otherRoutePath } from "./others";
import { paymentRoutePath } from "./payment";
import { purchaseInvoiceRoutePath } from "./purchaseInvoice";
import { purchaseOrderRoutePath } from "./purchaseOrder";
import { receiptRoutePath } from "./receipt";
import { saleOrderRoutePath } from "./saleOrder";
import { salesInvoiceRoutePath } from "./salesInvoice";
import { tallyRoutePath } from "./tallyModules";
import { taskManagementRoutePath } from "./taskManagement";

export interface componentRoute<P = any> {
    path: string;
    component: React.ComponentType<P>;
}

export interface PageProps {
    loading?: boolean;
    loadingOn?: () => void;
    loadingOff?: () => void;
}

export const appRoutes = ([] as componentRoute[]).concat(
    configurationRoutePath,
    contraRoutePath,
    journalRoutePath,
    mastersRoutePath,
    otherRoutePath,
    paymentRoutePath,
    purchaseInvoiceRoutePath,
    purchaseOrderRoutePath,
    receiptRoutePath,
    saleOrderRoutePath,
    salesInvoiceRoutePath,
    tallyRoutePath,
    taskManagementRoutePath
);

