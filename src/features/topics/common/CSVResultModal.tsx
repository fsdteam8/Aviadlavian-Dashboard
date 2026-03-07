"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";

interface CSVResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    message: string;
    statusCode: number;
    status: string;
    data: {
      success: boolean;
      totalRows: number;
      inserted: number;
      skipped: number;
      failed: number;
      duplicates: string[];
      errors: Array<{
        row: number;
        id: string;
        message: string;
      }>;
    };
  };
}

const CSVResultModal: React.FC<CSVResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const { data } = result;
  const hasErrors = data.failed > 0 || data.errors.length > 0;
  const hasSuccess = data.inserted > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            {hasErrors && hasSuccess ? (
              <>
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                Import Completed with Issues
              </>
            ) : hasSuccess ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Import Successful
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Import Failed
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Message */}
          <div className="text-center">
            <p className="text-sm text-slate-600">{result.message}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {data.totalRows}
              </p>
              <p className="text-xs text-blue-600">Total Rows</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {data.inserted}
              </p>
              <p className="text-xs text-green-600">Inserted</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {data.skipped}
              </p>
              <p className="text-xs text-yellow-600">Skipped</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{data.failed}</p>
              <p className="text-xs text-red-600">Failed</p>
            </div>
          </div>

          {/* Errors Section */}
          {data.errors && data.errors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Errors Found
              </h3>
              <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {data.errors.map((error, index) => (
                    <div
                      key={index}
                      className="bg-white rounded p-3 border border-red-200"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          Row {error.row}
                        </span>
                        <span className="text-xs text-slate-500">
                          {error.id}
                        </span>
                      </div>
                      <p className="text-sm text-red-600">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Duplicates Section */}
          {data.duplicates && data.duplicates.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Duplicate Records
              </h3>
              <div className="bg-yellow-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-1">
                  {data.duplicates.map((duplicate, index) => (
                    <div
                      key={index}
                      className="text-sm text-yellow-700 bg-white rounded px-3 py-2"
                    >
                      {duplicate}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {hasSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">
                {data.inserted} record{data.inserted !== 1 ? "s" : ""}{" "}
                successfully imported
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVResultModal;
