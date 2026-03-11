import { api } from "@/lib/api";

export interface UpdateInjuryPayload {
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
  Video_URL?: File;
  Image_URL?: File;
}

export interface UpdateInjuryResponse {
  message: string;
  statusCode: number;
  status: string;
  success?: boolean;
  data?: {
    _id: string;
    Id: string;
    Name: string;
  };
}

export const updateInjury = async (
  id: string,
  payload: UpdateInjuryPayload,
): Promise<UpdateInjuryResponse> => {
  const formData = new FormData();

  const requiredFields = [
    "Id",
    "Name",
    "Primary_Body_Region",
    "Acuity",
    "Age_Group",
    "Tissue_Type",
    "Etiology_Mechanism",
    "Common_Sports",
    "Importance_Level",
  ];

  const optionalFields = [
    "Secondary_Body_Region",
    "Synonyms_Abbreviations",
    "Description",
    "Tags_Keywords",
  ];

  // Append required fields
  requiredFields.forEach((field) => {
    const value = payload[field as keyof UpdateInjuryPayload];
    if (value !== undefined && value !== null) {
      formData.append(field, String(value));
    }
  });

  // Append optional fields if present
  optionalFields.forEach((field) => {
    const value = payload[field as keyof UpdateInjuryPayload];
    if (value !== undefined && value !== null && value !== "") {
      formData.append(field, String(value));
    }
  });

  // Append file fields if present
  if (payload.Video_URL instanceof File) {
    formData.append("Video_URL", payload.Video_URL);
  }

  if (payload.Image_URL instanceof File) {
    formData.append("Image_URL", payload.Image_URL);
  }

  const response = await api.patch<UpdateInjuryResponse>(
    `/injury/update/${id}`,
    formData,
  );

  return response.data;
};
