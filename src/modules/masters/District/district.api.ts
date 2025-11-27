// district.api.ts — ERROR-FREE VERSION
import { toast } from "react-toastify";
import { fetchLink } from "../../../components/customFetch";

import type {
  DistrictData,
  DistrictCreateInput,
  DistrictUpdateInput,
} from "./district.types";

const districtAPI = "masters/district/";
const stateAPI = "masters/state/";

// SIMPLE INTERFACE - NO GENERICS
interface BasicApiResponse {
  success: boolean;
  message?: string;
  data: unknown;
}

export const getDistricts = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<DistrictData[]> => {
  try {
    const res = await fetchLink<BasicApiResponse>({ 
      address: districtAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      // DIRECT TYPE ASSERTION - NO MORE ERRORS
      return (res.data as unknown as DistrictData[]) || [];
    } else {
      toast.error(res?.message || "Failed to load districts");
      return [];
    }
  } catch (e: unknown) {
    console.error("getDistricts Error:", e);
    toast.error("Network error loading districts");
    return [];
  }
};

export const getStateDropdown = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<{ State_Id: number; State_Name: string }[]> => {
  try {
    const res = await fetchLink<BasicApiResponse>({ 
      address: stateAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      return (res.data as unknown as { State_Id: number; State_Name: string }[]) || [];
    } else {
      toast.error(res?.message || "Failed to load States");
      return [];
    }
  } catch (e: unknown) {
    console.error("getStates Error:", e);
    toast.error("Network error loading states");
    return [];
  }
};

export const createDistrict = async ( 
  body: DistrictCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      District_Name: body.District_Name.trim(),
      State_Id: body.State_Id,
      Created_By: 1
    };

    const res = await fetchLink<BasicApiResponse>({
      address: districtAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "District created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create District");
      return false;
    }
  } catch (e: unknown) {
    console.error("createDistrict Error:", e);
    toast.error("Network error creating District");
    return false;
  }
};

export const updateDistrict = async (
  body: DistrictUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    if (!body.District_Id) {
      toast.error("District ID is required for update");
      return false;
    }

    const cleanBody = {
      District_Name: body.District_Name.trim(),
      State_Id: body.State_Id,
      Alter_By: 1
    };

    const res = await fetchLink<BasicApiResponse>({
      address: `${districtAPI}${body.District_Id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "District updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update District");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateDistrict Error:", e);
    toast.error("Network error updating District");
    return false;
  }
};

export const deleteDistrict = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink<BasicApiResponse>({
      address: `${districtAPI}${id}`, 
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "District deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete District");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE District Error:", e);
    toast.error("Network error deleting District");
    return false;
  }
};