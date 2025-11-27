// state.types.ts

// DATA returned from backend (must match DB model)
export interface StateData {
  State_Id: number;       // ✔ Comes from DB auto-increment
  State_Name: string;     // ✔ Required
}

// Create Input (POST)
export interface StateCreateInput {
  State_Name: string;
}

// Update Input (PUT)
export interface StateUpdateInput {
  State_Name: string;
}

// Generic Fetch Response
export interface FetchResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Form State used in frontend forms
export const initialState: StateData = {
  State_Id: 0,        // ✔ default for new
  State_Name: ""
};
