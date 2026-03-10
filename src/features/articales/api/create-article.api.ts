import { api } from "@/lib/api";

export interface CreateArticlePayload {
  name: string;
  topicIds: string[];
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

const normalizeTopicIds = (input: string[] | string): string[] => {
  const toArray = (value: string): string[] => {
    const trimmed = value.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const normalizedJson = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(normalizedJson);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        const content = trimmed.slice(1, -1);
        return content
          .split(",")
          .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ""))
          .filter(Boolean);
      }
    }

    return [trimmed];
  };

  if (Array.isArray(input)) {
    return input
      .flatMap((item) => toArray(String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return toArray(String(input));
};

export const createArticle = async (
  payload: CreateArticlePayload,
): Promise<CreateArticleResponse> => {
  const formData = new FormData();
  const topicIds = normalizeTopicIds(payload.topicIds);

  formData.append("name", payload.name);
  topicIds.forEach((topicId) => {
    formData.append("topicIds", topicId);
  });
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
