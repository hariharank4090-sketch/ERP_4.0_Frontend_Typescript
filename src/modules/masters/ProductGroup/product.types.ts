


export interface ProductGroupData {
  Pro_Group_Id: number;       
   Pro_Group: string;     
  
}



export interface ProductGroupCreateInput  {
  Pro_Group: string;
   Pro_Group_Id: number; 
  
}




export interface ProductGroupUpdateInput {
  Pro_Group: string;
   Pro_Group_Id: number; 
}




export const initialState: ProductGroupCreateInput= {
  Pro_Group: "",
   Pro_Group_Id:1 
 

};