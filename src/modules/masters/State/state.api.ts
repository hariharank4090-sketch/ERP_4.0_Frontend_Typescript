// state.api.ts
import { fetchLink } from "../../../components/customFetch";
import type {
  StateCreateInput,
  StateUpdateInput,
  StateData} from "./state.types";
import { toast } from "react-toastify";


const stateAPI = "masters/state/";


export const getStates = async (
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<StateData[]> => {
  try {
    const res = await fetchLink<StateData>({ 
      address: stateAPI,
      method: "GET",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res  && res.success) {
      return res.data || [];
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



// -----------------------------------------
export const createState = async ( 
  body: StateCreateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
  
    const cleanBody = {
       State_Name: body.State_Name.trim(),
      Created_By: 1
    };

    const res = await fetchLink({
      address: stateAPI,
      method: "POST",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "State created successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to create State");
      return false;
    }
  } catch (e: unknown) {
    console.error("createState Error:", e);
    toast.error("Network error creating State");
    return false;
  }
};

// --------------------------------------------
 
export const updateState = async ( 
  id: number,
  body: StateUpdateInput,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const cleanBody = {
     State_Name: body.State_Name.trim(),
      Alter_By: 1
    };

    const res = await fetchLink({
      address: `${stateAPI}/${id}`,
      method: "PUT",
      bodyData: cleanBody,
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "State updated successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to update State");
      return false;
    }
  } catch (e: unknown) {
    console.error("updateState Error:", e);
    toast.error("Network error updating unit");
    return false;
  }
};

// ---------------------------------------------------------------------


export const deleteState = async ( 
  id: number,
  loadingOn?: () => void,
  loadingOff?: () => void
): Promise<boolean> => {
  try {
    const res = await fetchLink({
      address: `${stateAPI}/${id}`, 
      method: "DELETE",
      loadingOn: typeof loadingOn === 'function' ? loadingOn : undefined,
      loadingOff: typeof loadingOff === 'function' ? loadingOff : undefined
    });

    if (res && res.success) {
      toast.success(res.message || "State deleted successfully");
      return true;
    } else {
      toast.error(res?.message || "Failed to delete State");
      return false;
    }
  } catch (e: unknown) {
    console.error("DELETE State Error:", e);
    toast.error("Network error deleting State");
    return false;
}
};