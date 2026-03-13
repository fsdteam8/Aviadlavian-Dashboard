import { api } from "@/lib/api";

export interface Topic {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
  Secondary_Body_Region?: string;
}

export interface TopicsMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TopicsResponse {
  message: string;
  statusCode: number;
  status: string;
  meta: TopicsMeta;
  data: Topic[];
}

export const getAllTopicsForDropdown = async (
  page: number = 1,
  limit: number = 10,
): Promise<TopicsResponse> => {
  const response = await api.get<TopicsResponse>("/injury/get-all", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};
