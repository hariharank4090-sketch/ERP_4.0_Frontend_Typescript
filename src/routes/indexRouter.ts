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
import { inventoryRoutePath } from "./inventory";

export interface componentRoute<P = any> {
    path: string;
    component: React.ComponentType<P>;
}

export interface PageProps {
    loading: boolean;
    loadingOn: () => void;
    loadingOff: () => void;
}

const configuration: componentRoute[] = configurationRoutePath.map(
    route => ({  ...route, path: `/configuration/${route.path}` 
}));

const contra: componentRoute[] = contraRoutePath.map(
    route => ({  ...route, path: `/contra/${route.path}` 
}));

const journal: componentRoute[] = journalRoutePath.map(
    route => ({  ...route, path: `/journal/${route.path}` 
}));

const masters: componentRoute[] = mastersRoutePath.map(
    route => ({  ...route, path: `/masters/${route.path}` 
}));

const others: componentRoute[] = otherRoutePath.map(
    route => ({  ...route, path: `/others/${route.path}` 
}));

const payment: componentRoute[] = paymentRoutePath.map(
    route => ({  ...route, path: `/payment/${route.path}` 
}));

const purchaseInvoice: componentRoute[] = purchaseInvoiceRoutePath.map(
    route => ({  ...route, path: `/purchaseinvoice/${route.path}` 
}));

const purchaseOrder: componentRoute[] = purchaseOrderRoutePath.map(
    route => ({  ...route, path: `/purchaseorder/${route.path}` 
}));

const receipt: componentRoute[] = receiptRoutePath.map(
    route => ({  ...route, path: `/receipt/${route.path}` 
}));

const saleOrder: componentRoute[] = saleOrderRoutePath.map(
    route => ({  ...route, path: `/saleorder/${route.path}` 
}));

const salesInvoice: componentRoute[] = salesInvoiceRoutePath.map(
    route => ({  ...route, path: `/salesinvoice/${route.path}` 
}));

const tally: componentRoute[] = tallyRoutePath.map(
    route => ({  ...route, path: `/tally/${route.path}` 
}));

const taskManagement: componentRoute[] = taskManagementRoutePath.map(
    route => ({  ...route, path: `/taskmanagement/${route.path}` 
}));

const inventory: componentRoute[] = inventoryRoutePath.map(
    route => ({  ...route, path: `/inventory/${route.path}` 
}));


export const appRoutes = ([] as componentRoute[]).concat(
    configuration,
    contra,
    journal,
    masters,
    others,
    payment,
    purchaseInvoice,
    purchaseOrder,
    receipt,
    saleOrder,
    salesInvoice,
    tally,
    taskManagement,
    inventory
);

