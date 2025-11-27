// district.types.ts — FINAL WORKING TYPES

/** MAIN DISTRICT DATA MODEL (Backend Response) */
export type DistrictData = {
  District_Id: number;
  District_Name: string;
  State_Id: number;
  State_Name?: string;    // IMPORTANT for table display
};

/** CREATE PAYLOAD */
export type DistrictCreateInput = {
  District_Name: string;
  State_Id: number;
};

/** UPDATE PAYLOAD */
export type DistrictUpdateInput = {
  District_Id: number; // Made required for update
  District_Name: string;
  State_Id: number;
};

/** STATE DROPDOWN */
export type StateDropdown = {
  State_Id: number;
  State_Name: string;
};

