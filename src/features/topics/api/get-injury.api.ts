import { api } from "@/lib/api";

export interface InjuryDetail {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
  Secondary_Body_Region?: string;
  Acuity: string;
  Age_Group: string;
  Tissue_Type: string;
  Etiology_Mechanism: string;
  Common_Sports: string;
  Synonyms_Abbreviations?: string;
  Importance_Level: string;
  Description?: string;
  Tags_Keywords?: string;
  Video_URL?: string;
  Image_URL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetInjuryResponse {
  message: string;
  statusCode: number;
  status: string;
  data: InjuryDetail;
}

export const getInjury = async (id: string): Promise<GetInjuryResponse> => {
  const response = await api.get<GetInjuryResponse>(`/injury/get/${id}`);
  return response.data;
};
