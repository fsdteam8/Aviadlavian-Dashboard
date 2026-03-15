"use client";

import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

import QuestionModal from "../common/QuestionModal";
import { useQuestions, useDeleteQuestion } from "../hooks";

const AllQuestions = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );

  const { data, isLoading, refetch } = useQuestions(currentPage, limit);
  const deleteMutation = useDeleteQuestion();

  const questions = data?.data?.questions || [];
  const total = data?.data?.questionsCount || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: string) => {
    router.push(`/questionbank/${id}`);
  };

  const handleEdit = (id: string) => {
    setModalMode("edit");
    setSelectedQuestionId(id);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedQuestionId(null);
    setIsModalOpen(true);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <section className="w-full p-6 transition-colors dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Question & Answer Bank
          </h1>
        </div>

        {/* Header Options */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Manage Questions
          </h2>
          <Button
            onClick={openAddModal}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            + Add New
          </Button>
        </div>

        {/* Table Container */}
        <div className="rounded-lg bg-white shadow dark:bg-slate-900 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <div className="col-span-8">Question Text</div>
            <div className="col-span-1 text-center">Marks</div>
            <div className="col-span-3 text-center">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-8 flex items-center">
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Skeleton className="h-5 w-8" />
                  </div>
                  <div className="col-span-3 flex items-center justify-center gap-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))
            ) : questions.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No questions found.
              </div>
            ) : (
              questions.map((question) => (
                <div
                  key={question._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {/* Question Text */}
                  <div className="col-span-8 flex items-center text-slate-900 dark:text-slate-100 text-sm pr-4 line-clamp-2">
                    {question.questionText}
                  </div>

                  {/* Marks */}
                  <div className="col-span-1 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-medium">
                    {question.marks}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleView(question._id)}
                      className="text-teal-500 hover:text-teal-600 transition-colors bg-teal-50 dark:bg-teal-900/30 p-2 rounded-md"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(question._id)}
                      className="text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md"
                      title="Edit Question"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="text-red-500 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-900/30 p-2 rounded-md disabled:opacity-50"
                      title="Delete Question"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, total)} of {total} questions
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-9 px-3"
              >
                Previous
              </Button>

              {renderPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-2 text-slate-400">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page as number)}
                      className={`h-9 w-9 ${
                        currentPage === page
                          ? "bg-teal-500 text-white hover:bg-teal-600 border-transparent"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="h-9 px-3"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        mode={modalMode}
        questionId={selectedQuestionId}
      />
    </section>
  );
};

export default AllQuestions;
