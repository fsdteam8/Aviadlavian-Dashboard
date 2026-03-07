import { api } from "@/lib/api";
import { InjuryResponse } from "../type/injury.types";

export const getAllInjuries = async (
  page: number = 1,
  limit: number = 10,
): Promise<InjuryResponse> => {
  try {
    const response = await api.get<InjuryResponse>(`/injury/get-all`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching injuries:", error);
    throw error;
  }
};

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
  try {
    const formData = new FormData();

    // Required text fields - always append
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

    // Optional text fields - only append if not empty
    const optionalFields = [
      "Secondary_Body_Region",
      "Synonyms_Abbreviations",
      "Description",
      "Tags_Keywords",
    ];

    // Append required fields (same keys as Postman)
    requiredFields.forEach((field) => {
      const value = payload[field as keyof CreateInjuryPayload];
      if (value) {
        formData.append(field, value as string);
      }
    });

    // Append optional fields only if they have values
    optionalFields.forEach((field) => {
      const value = payload[field as keyof CreateInjuryPayload];
      if (value && value !== "") {
        formData.append(field, value as string);
      }
    });

    // Append files only if selected
    if (payload.Video_URL && payload.Video_URL instanceof File) {
      formData.append("Video_URL", payload.Video_URL);
    }
    if (payload.Image_URL && payload.Image_URL instanceof File) {
      formData.append("Image_URL", payload.Image_URL);
    }

    if (process.env.NODE_ENV !== "production") {
      const keys = Array.from(formData.keys());
      console.log("createInjury FormData keys:", keys);
    }

    // Do not set Content-Type manually for FormData.
    // Axios will set the correct multipart boundary automatically.
    const response = await api.post<CreateInjuryResponse>(
      "/injury/create",
      formData,
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error creating injury:", error);

    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      apiError?.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to create injury");

    throw new Error(errorMessage);
  }
};

export const deleteInjury = async (id: string): Promise<void> => {
  try {
    await api.delete(`/injury/${id}`);
  } catch (error) {
    console.error("Error deleting injury:", error);
    throw error;
  }
};
