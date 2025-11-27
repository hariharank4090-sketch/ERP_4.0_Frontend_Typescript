import { MenuGroupPage } from "../layout/subMenu";
import type { componentRoute } from "./indexRouter";
import PackList from "../modules/masters/packs/packList";

import Unitspage from "../modules/masters/Units/UomMaster";
import StatePage from "../modules/masters/State/State";
import DistrictMaster from "../modules/masters/District/DistrictMaster";
import AreaMaster from "../modules/masters/Area/AreaMaster.page";
import BrandPage from "../modules/masters/BRAND/BrandMaster";
import ProductGroupPage from "../modules/masters/ProductGroup/ProductGroup";
 



export const mastersRoutePath: componentRoute[] = [
    { path: '', component: MenuGroupPage },
    { path: 'inventory/packs', component: PackList },
    { path: 'inventory/units', component: Unitspage },
     {path:'inventory/brand',component:BrandPage},
   {path:'inventory/productgroup',component:ProductGroupPage},
   {path:'userdatamanagement/state', component:StatePage},
   {path:'userdatamanagement/district',component:DistrictMaster},
   {path:'userdatamanagement/area',component:AreaMaster},
  
   
   
];