import { api } from "@/lib/api";

export interface Topic {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
}

export interface TopicsResponse {
  message: string;
  statusCode: number;
  status: string;
  data: Topic[];
}

export const getAllTopicsForDropdown = async (): Promise<TopicsResponse> => {
  const response = await api.get<TopicsResponse>("/injury/get-all");
  return response.data;
};
