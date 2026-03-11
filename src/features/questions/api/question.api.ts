import { api } from "@/lib/api";
import {
  CreateQuestionPayload,
  CreateQuestionResponse,
  DeleteQuestionResponse,
  QuestionListResponse,
  QuestionSingleResponse,
  UpdateQuestionPayload,
  UpdateQuestionResponse,
} from "../type/question.types";

export const getAllQuestions = async (
  page: number = 1,
  limit: number = 10,
): Promise<QuestionListResponse> => {
  try {
    const response = await api.get<QuestionListResponse>(
      `/question/get-all-questions`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const getSingleQuestion = async (
  id: string,
): Promise<QuestionSingleResponse> => {
  try {
    const response = await api.get<QuestionSingleResponse>(
      `/question/single-question/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    throw error;
  }
};

export const createQuestion = async (
  payload: CreateQuestionPayload,
): Promise<CreateQuestionResponse> => {
  try {
    const response = await api.post<CreateQuestionResponse>(
      `/question/create-question`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating question:", error);

    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      apiError?.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to create question");

    throw new Error(errorMessage);
  }
};

export const updateQuestion = async (
  id: string,
  payload: UpdateQuestionPayload,
): Promise<UpdateQuestionResponse> => {
  try {
    const response = await api.put<UpdateQuestionResponse>(
      `/question/update-question/${id}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error updating question ${id}:`, error);

    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      apiError?.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to update question");

    throw new Error(errorMessage);
  }
};

export const deleteQuestion = async (
  id: string,
): Promise<DeleteQuestionResponse> => {
  try {
    const response = await api.delete<DeleteQuestionResponse>(
      `/question/delete-question/${id}`,
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error deleting question ${id}:`, error);

    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const errorMessage =
      apiError?.response?.data?.message ||
      (error instanceof Error ? error.message : "Failed to delete question");

    throw new Error(errorMessage);
  }
};
