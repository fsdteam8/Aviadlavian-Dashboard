import { api } from "@/lib/api";

export interface CreateArticlePayload {
  name: string;
  topicIds: string;
  description: string;
  isActive: boolean;
  image?: File;
  video?: File;
}

export interface CreateArticleResponse {
  message: string;
  statusCode: number;
  status: string;
  success?: boolean;
  data?: {
    _id: string;
    name: string;
  };
}

export const createArticle = async (
  payload: CreateArticlePayload,
): Promise<CreateArticleResponse> => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("topicIds", payload.topicIds);
  formData.append("description", payload.description);
  formData.append("isActive", String(payload.isActive));

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  if (payload.video instanceof File) {
    formData.append("video", payload.video);
  }

  const response = await api.post<CreateArticleResponse>(
    "/article/create",
    formData,
  );

  return response.data;
};
