import { MenuGroupPage } from "../layout/subMenu";
import type { componentRoute } from "./indexRouter";
import PackList from "../modules/masters/packs/packList";

import Unitspage from "../modules/masters/Units/UomMaster";



export const mastersRoutePath: componentRoute[] = [
    { path: '', component: MenuGroupPage },
    { path: 'inventory/packs', component: PackList },
   
    { path: 'inventory/units', component: Unitspage },
   
   
];