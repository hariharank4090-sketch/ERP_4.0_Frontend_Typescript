import { fetchLink } from "../../components/customFetch";
import type { MenuRow } from "./types";

const menuAPI: string = 'configuration/appMenu';

export const getAppMenuData = async (
    loadingOn?: () => void,
    loadingOff?: () => void
): Promise<MenuRow[] | any> => {
    const url = menuAPI;
    const res = await fetchLink({
        address: url,
        loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
        loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    }).catch((e) => {
        throw new Error("NETWORK_ERROR:" + e.message);
    });
    // if (!res.ok) console.log('menu api error');
    return res;
}