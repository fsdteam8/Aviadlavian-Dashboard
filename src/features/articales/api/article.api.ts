import { api } from "@/lib/api";

export interface Article {
  _id: string;
  Id: string;
  name: string;
  topicIds?: string[];
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
): Promise<ArticlesResponse> => {
  const response = await api.get(
    `/article/get-all?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/article/${id}`);
};
