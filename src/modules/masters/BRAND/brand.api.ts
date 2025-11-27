import { fetchLink } from "../../../components/customFetch";
import type {
  BrandCreateInput,
  BrandUpdateInput,
  BrandData
} from "./brand.types";
import { toast } from "react-toastify";

const BrandAPI = "masters/brand/";

export const getBrands = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<BrandData[]> => {
  try {
    const res = await fetchLink<BrandData>({ 
      address: BrandAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      return res.data || [];
    } else {
      toast.error(res?.message || "Failed to load Brands");
      return [];
    }
  } catch (e: unknown) {
    console.error("getBrands Error:", e);
    toast.error("Network error loading Brands");
    return [];
  }
};

export const createBrand = async ( 
  body: BrandCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      Brand_Name: body.Brand_Name.trim(),
      Pro_T_Id: body.Pro_T_Id, 
      Created_By: 1 
    };

    const res = await fetchLink({
      address: BrandAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Brand created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create brand");
      return false;
    }
  } catch (e: unknown) {
    console.error("createBrand Error:", e);
    toast.error("Network error creating brand");
    return false;
  }
};

export const updateBrand = async ( 
  id: number,
  body: BrandUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      Brand_Name: body.Brand_Name.trim(),
      Pro_T_Id: body.Pro_T_Id, 
      Alter_By: 1
    };

    const res = await fetchLink({
      address: `${BrandAPI}${id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Brand updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update Brand");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateBrand Error:", e);
    toast.error("Network error updating Brand");
    return false;
  }
};

export const deleteBrand = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink({
      address: `${BrandAPI}${id}`,
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Brand deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete Brand");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE Brand Error:", e);
    toast.error("Network error deleting Brand");
    return false;
  }
};