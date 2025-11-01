import type { componentRoute } from "./indexRouter";
import MenuManagement from "../modules/configuration/menuManagement";

export const configurationRoutePath: componentRoute[] = [
    { path: '/configuration', component: MenuManagement }
];