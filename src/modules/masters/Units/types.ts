// In your types.ts - ENHANCED VERSION
export type UnitData = {
  Unit_Id: number;
  Units: string;
  ERP_Id: number | null;
  Alter_Id: number | null;
  Created_By: number | null;
  Created_Time?: string | null;
  Alter_By: number | null;
  Alter_Time?: string | null;
};

export type UnitCreateInput = {
  Units: string;
  ERP_Id?: number | null;
  Alter_Id?: number | null;
  Created_By?: number | null;
};

export type UnitUpdateInput = {
  Units?: string;
  ERP_Id?: number | null;
  Alter_Id?: number | null;
  Alter_By?: number | null;
};

// Add API response type if you have consistent response structure
export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};