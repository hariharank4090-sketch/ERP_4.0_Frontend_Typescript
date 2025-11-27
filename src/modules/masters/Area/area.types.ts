// area.types.ts

export type AreaData = {
  Area_Id: number;
  Area_Name: string;
  District_Id: number;
  District_Name?: string;    // IMPORTANT for table display
};


export type AreaCreateInput = {
  Area_Name: string;
   District_Id: number;
};


export type AreaUpdateInput= {
  Area_Id: number; // Made required for update
   Area_Name: string;
  District_Id: number;
};

export type DistrictDropdown = {
   District_Id: number;
  District_Name: string;
};


