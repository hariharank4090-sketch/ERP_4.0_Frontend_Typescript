import { fetchLink } from "../../../components/customFetch";
import type {
  ProductGroupCreateInput,
  ProductGroupUpdateInput,
  ProductGroupData
} from "./product.types";
import { toast } from "react-toastify";

const ProductGroupAPI = "masters/productGroup/";

export const getProductGroups = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<ProductGroupData[]> => {
  try {
    const res = await fetchLink<ProductGroupData>({ 
      address: ProductGroupAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      return res.data || [];
    } else {
      toast.error(res?.message || "Failed to load Product Groups");
      return [];
    }
  } catch (e: unknown) {
    console.error("getProductGroups Error:", e);
    toast.error("Network error loading Product Groups");
    return [];
  }
};

 

export const createProductGroup = async ( 
  body: ProductGroupCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
      Pro_Group: body.Pro_Group.trim(),
      Pro_Group_Id: body.Pro_Group_Id, 
      Created_By: 1 
    };

    const res = await fetchLink({
      address: ProductGroupAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Product group  created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create Product group");
      return false;
    }
  } catch (e: unknown) {
    console.error("createProduct group Error:", e);
    toast.error("Network error creating Product group");
    return false;
  }
};


export const updateProductGroup = async ( 
  id: number,
  body:  ProductGroupUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
       Pro_Group: body. Pro_Group.trim(),
      Pro_Group_Id: body.Pro_Group_Id, 
      Alter_By: 1
    };

    const res = await fetchLink({
      address: `${ProductGroupAPI}${id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Product group updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update Product group");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateProduct group Error:", e);
    toast.error("Network error updating Product group");
    return false;
  }
};



export const deleteProductGroup = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink({
      address: `${ProductGroupAPI}${id}`,
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "Product Group deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete Product Group");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE ProductGroup Error:", e);
    toast.error("Network error deleting Product Group");
    return false;
  }
};