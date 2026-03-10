import { api } from "@/lib/api";

export interface UpdateArticlePayload {
  name: string;
  topicIds: string;
  description: string;
  isActive: boolean;
  image?: File;
  video?: File;
}

export interface UpdateArticleResponse {
  message: string;
  statusCode: number;
  status: string;
  success?: boolean;
  data?: {
    _id: string;
    name: string;
  };
}

export const updateArticle = async (
  id: string,
  payload: UpdateArticlePayload,
): Promise<UpdateArticleResponse> => {
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

  const response = await api.put<UpdateArticleResponse>(
    `/article/${id}`,
    formData,
  );

  return response.data;
};
