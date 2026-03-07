import { api } from "@/lib/api";

export interface CsvImportIssue {
  row: number;
  id: string;
  message: string;
}

export interface CsvImportData {
  success: boolean;
  totalRows: number;
  inserted: number;
  skipped: number;
  failed: number;
  duplicates: string[];
  errors: CsvImportIssue[];
}

export interface UploadInjuryCsvResponse {
  message: string;
  statusCode: number;
  status: string;
  data: CsvImportData;
}

export interface UploadInjuryCsvErrorResponse {
  message: string;
  success: boolean;
  status: string;
  statusCode: number;
  isOperationalError?: boolean;
  data?: Array<{
    field?: string;
    message?: string;
  }>;
}

export const uploadInjuryCsv = async (
  file: File,
): Promise<UploadInjuryCsvResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadInjuryCsvResponse>(
    "/injury/upload-csv",
    formData,
  );

  return response.data;
};
