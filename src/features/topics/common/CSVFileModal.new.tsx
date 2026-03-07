"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import CSVResultModal from "./CSVResultModal";
import { useUploadInjuryCsv } from "../hooks/useUploadInjuryCsv";
import type {
  UploadInjuryCsvErrorResponse,
  UploadInjuryCsvResponse,
} from "../api/upload-injury-csv.api";

interface CSVFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CSVFileModal: React.FC<CSVFileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadResult, setUploadResult] =
    useState<UploadInjuryCsvResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadCsvMutation = useUploadInjuryCsv();

  const normalizeErrorToResult = (
    errorResponse: UploadInjuryCsvErrorResponse,
  ): UploadInjuryCsvResponse => {
    const mappedErrors = (errorResponse.data || []).map((item) => ({
      row: 0,
      id: item.field || "file",
      message: item.message || "Invalid value",
    }));

    return {
      message: errorResponse.message || "CSV upload failed",
      statusCode: errorResponse.statusCode || 400,
      status: errorResponse.status || "client Error",
      data: {
        success: false,
        totalRows: 0,
        inserted: 0,
        skipped: 0,
        failed: mappedErrors.length > 0 ? mappedErrors.length : 1,
        duplicates: [],
        errors:
          mappedErrors.length > 0
            ? mappedErrors
            : [
                {
                  row: 0,
                  id: "file",
                  message: errorResponse.message || "CSV upload failed",
                },
              ],
      },
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const isCsvFile = (file: File) => {
    const lowerName = file.name.toLowerCase();
    return file.type === "text/csv" || lowerName.endsWith(".csv");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!isCsvFile(file)) {
      alert("Please upload a CSV file");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isCsvFile(file)) {
      alert("Please upload a CSV file");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first");
      return;
    }

    try {
      const result = await uploadCsvMutation.mutateAsync(selectedFile);
      setUploadResult(result);
      setShowResultModal(true);

      if (result.data.success || result.data.inserted > 0) {
        onSuccess();
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: UploadInjuryCsvErrorResponse;
        };
      };

      const apiError = axiosError.response?.data;
      const normalized = normalizeErrorToResult(
        apiError || {
          message: "CSV upload failed",
          success: false,
          status: "client Error",
          statusCode: 400,
          data: [
            {
              field: "file",
              message: "Please upload a CSV file",
            },
          ],
        },
      );

      setUploadResult(normalized);
      setShowResultModal(true);
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setUploadResult(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Add Topic
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                isDragging
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-300 hover:border-teal-400"
              }`}
            >
              <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-semibold">Drop CSV file here</h3>
              <p className="text-sm text-slate-500">
                or click to select from your device
              </p>

              {selectedFile && (
                <p className="mt-4 text-sm font-medium text-teal-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-center">
              <span className="text-sm text-slate-600">
                or Upload <span className="font-bold text-teal-500">CSV</span>
              </span>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploadCsvMutation.isPending}
                className="bg-teal-500 px-8 text-white hover:bg-teal-600"
              >
                {uploadCsvMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "+Add Article"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {uploadResult && (
        <CSVResultModal
          isOpen={showResultModal}
          onClose={handleCloseResultModal}
          result={uploadResult}
        />
      )}
    </>
  );
};

export default CSVFileModal;
