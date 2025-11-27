// district.api.ts — CORRECTED VERSION

import { toast } from "react-toastify";
import { fetchLink } from "../../../components/customFetch";
import type {
AreaData,
AreaCreateInput,
AreaUpdateInput,
} from "../Area/area.types";
import type { DistrictData } from "../District/district.types";


const areaAPI = "masters/area/";
const districtAPI = "masters/district/";

// SIMPLE INTERFACE - NO GENERICS
interface BasicApiResponse {
  success: boolean;
  message?: string;
  data: unknown;
}





export const getAreas = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<AreaData[]> => {
  try {
    const res = await fetchLink<BasicApiResponse>({ 
      address: areaAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      // DIRECT TYPE ASSERTION - NO MORE ERRORS
      return (res.data as unknown as AreaData[]) || [];
    } else {
      toast.error(res?.message || "Failed to load Areas");
      return [];
    }
  } catch (e: unknown) {
    console.error("getAreas Error:", e);
    toast.error("Network error loading Areas");
    return [];
  }
};









// --------------------------------------------------------------------------------

export const getDistrictDropdown = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<DistrictData[]> => {
  try {
    const res = await fetchLink<{ data: DistrictData[] }>({ 
      address: districtAPI ,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      // Ensure we return a flat array of StateData objects
      const DistrictData = res.data || [];
      
      // If it's an array of arrays, flatten it
      if (DistrictData.length > 0 && Array.isArray(DistrictData[0])) {
        return (DistrictData as unknown as DistrictData[][]).flat();
      }
      
      return DistrictData as unknown as DistrictData[];
    } else {
      toast.error(res?.message || "Failed to load Districts");
      return [];
    }
  } catch (e: unknown) {
    console.error("getDistricts Error:", e);
    toast.error("Network error loading Districts");
    return [];
  }
};

// ---------------------------------------------------------

export const createArea = async ( 
  body: AreaCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      Area_Name: body.Area_Name.trim(),
      District_Id: body.District_Id,
      Created_By: 1
    };

    const res = await fetchLink({
      address: areaAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Areas created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create Area");
      return false;
    }
  } catch (e: unknown) {
    console.error("createArea Error:", e);
    toast.error("Network error creating Area");
    return false;
  }
};

// --------------------------------------------------------------------

export const updateArea = async (
  body: AreaUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    if (!body. Area_Id) {
      toast.error("Area ID is required for update");
      return false;
    }

    const cleanBody = {
       Area_Name: body. Area_Name.trim(),
      District_Id: body.District_Id
    };

    const res = await fetchLink({
      address: `${areaAPI}${body.Area_Id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res?.success) {
      toast.success(res.message || "Area updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update Area");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateArea Error:", e);
    toast.error("Network error updating Area");
    return false;
  }
};

// -----------------------------------------------------------------------


export const deleteArea = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink({
      address: `${areaAPI}${id}`, 
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Area deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete Area");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE Area Error:", e);
    toast.error("Network error deleting Area");
    return false;
  }
};