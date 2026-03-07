import { api } from "@/lib/api";

export interface CreateInjuryPayload {
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
  Video_URL?: File | null;
  Image_URL?: File | null;
}

export interface CreateInjuryResponse {
  message: string;
  statusCode: number;
  status: string;
  success?: boolean;
}

export const createInjury = async (
  payload: CreateInjuryPayload,
): Promise<CreateInjuryResponse> => {
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

  requiredFields.forEach((field) => {
    const value = payload[field as keyof CreateInjuryPayload];
    if (value) {
      formData.append(field, value as string);
    }
  });

  optionalFields.forEach((field) => {
    const value = payload[field as keyof CreateInjuryPayload];
    if (value && value !== "") {
      formData.append(field, value as string);
    }
  });

  if (payload.Video_URL instanceof File) {
    formData.append("Video_URL", payload.Video_URL);
  }

  if (payload.Image_URL instanceof File) {
    formData.append("Image_URL", payload.Image_URL);
  }

  const response = await api.post<CreateInjuryResponse>(
    "/injury/create",
    formData,
  );
  return response.data;
};
