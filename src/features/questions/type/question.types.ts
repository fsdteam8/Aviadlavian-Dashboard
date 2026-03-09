export interface IOption {
  _id?: string;
  text: string;
  isCorrect: boolean;
  selectedCount?: number;
}

export interface IQuestion {
  _id: string;
  articleId?: string | { _id: string; name: string } | null;
  topicId: string;
  questionText: string;
  options: IOption[];
  totalAttempts?: number;
  correctAttempts?: number;
  explanation: string;
  marks: number;
  difficulty?: string;
  isHidden: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionListResponse {
  message: string;
  statusCode: number;
  status: string;
  data: {
    questions: IQuestion[];
    questionsCount: number;
  };
}

export interface QuestionSingleResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IQuestion;
}

export interface CreateQuestionPayload {
  articleId?: string;
  topicId: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  marks: number;
  difficulty?: string;
}

export interface CreateQuestionResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IQuestion;
}

export interface UpdateQuestionPayload {
  articleId?: string;
  topicId?: string;
  questionText?: string;
  options?: { text: string; isCorrect: boolean }[];
  explanation?: string;
  marks?: number;
  difficulty?: string;
  isHidden?: boolean;
}

export interface UpdateQuestionResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IQuestion;
}

export interface DeleteQuestionResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IQuestion;
}
