import { api } from "@/lib/api";

export interface LibraryTopic {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
  Secondary_Body_Region?: string;
  Acuity?: string;
  Age_Group?: string;
  Tissue_Type?: string[];
  Etiology_Mechanism?: string;
  Common_Sports?: string[];
  Synonyms_Abbreviations?: string[];
  Importance_Level?: string;
  Description?: string;
  Video_URL?: string;
  Tags_Keywords?: string[];
  Image_URL?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Article {
  _id: string;
  name: string;
  topicIds: LibraryTopic[];
  description: string;
  isActive: boolean;
  image?: {
    public_id: string;
    secure_url: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ArticlesResponse {
  message: string;
  statusCode: number;
  status: string;
  data: Article[];
  meta: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export type ArticlesQueryParams = {
  page: number;
  limit: number;
  search?: string;
  speciality?: string;
  bodyArea?: string;
};

export const getAllArticles = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  speciality?: string,
  bodyArea?: string,
): Promise<ArticlesResponse> => {
  const params: ArticlesQueryParams = { page, limit };
  if (search) params.search = search;
  if (speciality) params.speciality = speciality;
  if (bodyArea) params.bodyArea = bodyArea;

  const response = await api.get<ArticlesResponse>("/article/get-all", {
    params,
  });
  return response.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await api.delete(`/article/delete/${id}`);
  } catch (error: unknown) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      apiError?.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to delete article");

    throw new Error(errorMessage);
  }
};
