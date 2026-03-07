"use client";

import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Injury } from "../type/injury.types";
import { Skeleton } from "@/components/ui/skeleton";
import AddTopicModal from "../common/AddTopicModal";
import { useInjuries } from "../hooks/useInjuries";
import { useDeleteInjury } from "../hooks/useDeleteInjury";

const AllTopics = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Use TanStack Query hooks
  const { data, isLoading, refetch } = useInjuries(currentPage, limit);
  const deleteInjuryMutation = useDeleteInjury();

  const topics = data?.data || [];
  const totalPages = data?.meta.pages || 1;
  const total = data?.meta.total || 0;

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      deleteInjuryMutation.mutate(id);
    }
  };

  const handleView = (topic: Injury) => {
    console.log("View topic:", topic);
    // Implement view logic
  };

  const handleEdit = (topic: Injury) => {
    console.log("Edit topic:", topic);
    // Implement edit logic
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
            Topics
          </h1>
        </div>

        {/* Topic Name and Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Topic Name
          </h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            +Add Topic
          </Button>
        </div>

        {/* All Topics Section */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
            All Topics
          </h3>
        </div>

        {/* Topics Table */}
        <div className="rounded-lg bg-white shadow dark:bg-slate-900">
          {/* Table Header */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="text-center font-semibold text-slate-900 dark:text-slate-100">
              Topic Name
            </div>
            <div className="text-center font-semibold text-slate-900 dark:text-slate-100">
              Action
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))
            ) : topics.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No topics found
              </div>
            ) : (
              topics.map((topic) => (
                <div
                  key={topic._id}
                  className="grid grid-cols-2 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {/* Topic Name */}
                  <div className="flex items-center text-slate-900 dark:text-slate-100">
                    {topic.Name}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleView(topic)}
                      className="text-teal-500 hover:text-teal-600 transition-colors"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(topic)}
                      className="text-teal-500 hover:text-teal-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && topics.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
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
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => setCurrentPage(page as number)}
                    className={`h-9 w-9 ${
                      currentPage === page
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : ""
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="ghost"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="h-9 px-3"
            >
              Next
            </Button>
          </div>
        )}

        {/* Total Count */}
        {!isLoading && topics.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, total)} of {total} topics
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      <AddTopicModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </section>
  );
};

export default AllTopics;
