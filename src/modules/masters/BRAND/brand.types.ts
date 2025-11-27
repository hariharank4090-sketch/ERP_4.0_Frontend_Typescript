export interface BrandData {
  Brand_Id: number;       
  Brand_Name: string;     
  Pro_T_Id: number;  
}

export interface BrandCreateInput {
  Brand_Name: string;
  Pro_T_Id: number;  
}

export interface BrandUpdateInput {
  Brand_Name: string;
  Pro_T_Id: number;  
}

export const initialState: BrandCreateInput = {
  Brand_Name: "",
  Pro_T_Id: 1  
};