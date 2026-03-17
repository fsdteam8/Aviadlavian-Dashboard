import { api } from "@/lib/api";

export interface TopicId {
  _id: string;
  Id: string;
  Name: string;
  Image_URL?: string;
  Primary_Body_Region?: string;
  Secondary_Body_Region?: string;
  Acuity?: string;
  Age_Group?: string;
  Tissue_Type?: string[];
}

export interface Article {
  _id: string;
  Id: string;
  name: string;
  topicIds?: TopicId[];
  description: string;
  isActive: boolean;
  image?: string;
  video?: string;
  createdAt: string;
  updatedAt: string;
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

export const getAllArticles = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<ArticlesResponse> => {
  const url = search
    ? `/article/get-all?page=${page}&limit=${limit}&search=${search}`
    : `/article/get-all?page=${page}&limit=${limit}`;
  const response = await api.get(url);
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
