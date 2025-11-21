import { fetchLink } from "../../../components/customFetch";
import type { UnitCreateInput, UnitUpdateInput, UnitData } from "./types";
import { toast } from "react-toastify";

const unitsAPI = "masters/units"; 

export const getUnits = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<UnitData[]> => {
  try {
    const res = await fetchLink<UnitData>({ 
      address: unitsAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res  && res.success) {
      return res.data || [];
    } else {
      toast.error(res?.message || "Failed to load units");
      return [];
    }
  } catch (e: unknown) {
    console.error("getUnits Error:", e);
    toast.error("Network error loading units");
    return [];
  }
};




export const createUnit = async ( 
  body: UnitCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
  
    const cleanBody = {
      Units: body.Units.trim(),
      Created_By: 1 
    };

    const res = await fetchLink({
      address: unitsAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Unit created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create unit");
      return false;
    }
  } catch (e: unknown) {
    console.error("createUnit Error:", e);
    toast.error("Network error creating unit");
    return false;
  }
};


export const updateUnit = async ( 
  id: number,
  body: UnitUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      Units: body.Units?.trim(),
      Alter_By: 1
    };

    const res = await fetchLink({
      address: `${unitsAPI}/${id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Unit updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update unit");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateUnit Error:", e);
    toast.error("Network error updating unit");
    return false;
  }
};

export const deleteUnit = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink({
      address: `${unitsAPI}/${id}`, 
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Unit deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete unit");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE UNIT Error:", e);
    toast.error("Network error deleting unit");
    return false;
}
};