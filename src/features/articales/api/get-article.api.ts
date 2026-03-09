import { api } from "@/lib/api";

export interface ArticleDetail {
  _id: string;
  name: string;
  topicIds: string[];
  description: string;
  isActive: boolean;
  image?: string;
  video?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetArticleResponse {
  message: string;
  statusCode: number;
  status: string;
  data: ArticleDetail;
}

export const getArticle = async (id: string): Promise<GetArticleResponse> => {
  const response = await api.get<GetArticleResponse>(`/article/get/${id}`);
  return response.data;
};
