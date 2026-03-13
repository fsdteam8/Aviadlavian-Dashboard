import { api } from "@/lib/api";

export interface TopPerformingStudent {
  _id: string;
  email: string;
  name: string;
  profileImage: string;
  totalQuizzes: number;
  totalQuestions: number;
  performance: number;
}

export interface TopPerformingStudentsResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface TopPerformingStudentsResponse {
  success: boolean;
  message: string;
  data: {
    meta: TopPerformingStudentsResponseMeta;
    data: TopPerformingStudent[];
  };
}

export interface ProgressData {
  totalUsers: number;
  totalArticles: number;
  totalQuestions: number;
}

export interface ProgressResponse {
  message: string;
  statusCode: number;
  status: string;
  data: ProgressData;
}

export const getOverallProgress = async (): Promise<ProgressResponse> => {
  const res = await api.get<ProgressResponse>("/progress");
  return res.data;
};

export const getTopPerformingStudents = async (
  page: number = 2,
  limit: number = 3,
): Promise<TopPerformingStudentsResponse> => {
  const response = await api.get<TopPerformingStudentsResponse>(
    "/progress/top-performing-students",
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};
