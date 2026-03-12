"use client";

import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddArticleModal from "../common/AddArticleModal";
import ViewArticleModal from "../common/ViewArticleModal";
import EditArticleModal from "../common/EditArticleModal";
import { useArticles } from "../hooks/useArticles";
import { useDeleteArticle } from "../hooks/useDeleteArticle";
import { toast } from "sonner";

const AllArticles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(
    null,
  );

  // Use TanStack Query hooks
  const { data, isLoading, refetch } = useArticles(currentPage, limit);
  const deleteArticleMutation = useDeleteArticle();

  const articles = data?.data || [];
  const totalPages = data?.meta.pages || 1;
  const total = data?.meta.total || 0;

  const handleDeleteClick = (id: string) => {
    setArticleToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!articleToDeleteId) return;

    deleteArticleMutation.mutate(articleToDeleteId, {
      onSuccess: () => {
        toast.success("Article deleted successfully!");
        setIsDeleteModalOpen(false);
        setArticleToDeleteId(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete article");
      },
    });
  };

  const handleView = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsViewModalOpen(true);
  };

  const handleEdit = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsEditModalOpen(true);
  };

  const renderPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
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
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Articles
          </h1>
        </div>

        {/* Article Name and Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Article Name
          </h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            +Add Article
          </Button>
        </div>

        {/* All Articles Section */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
            All Articles
          </h3>
        </div>

        {/* Articles Table */}
        <div className="rounded-lg bg-white shadow dark:bg-slate-900">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="text-center font-semibold text-slate-900 dark:text-slate-100">
              Article Name
            </div>
            <div className="text-center font-semibold text-slate-900 dark:text-slate-100">
              Article ID
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
                <div key={index} className="grid grid-cols-3 px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))
            ) : articles.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No articles found
              </div>
            ) : (
              articles.map((article) => (
                <div
                  key={article._id}
                  className="grid grid-cols-3 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {/* Article Name */}
                  <div
                    className="flex items-center text-slate-900 dark:text-slate-100 prose dark:prose-invert prose-sm max-w-none line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: article?.name || "",
                    }}
                  />

                  {/* Article ID */}
                  <div className="flex items-center justify-center text-slate-900 dark:text-slate-100">
                    {article?.topicIds?.[0]?.Id
                      ? article.topicIds[0].Id.length > 8
                        ? `${article.topicIds[0].Id.slice(0, 8)}...`
                        : article.topicIds[0].Id
                      : "N/A"}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleView(article._id)}
                      className="text-teal-500 hover:text-teal-600 transition-colors"
                      title="View"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(article._id)}
                      className="text-teal-500 hover:text-teal-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(article._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Delete"
                      disabled={deleteArticleMutation.isPending}
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
        {!isLoading && articles.length > 0 && (
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
        {!isLoading && articles.length > 0 && (
          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, total)} of {total} articles
          </div>
        )}
      </div>

      {/* Add Article Modal */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* View Article Modal */}
      <ViewArticleModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedArticleId(null);
        }}
        articleId={selectedArticleId}
      />

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedArticleId(null);
        }}
        articleId={selectedArticleId}
      />

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (deleteArticleMutation.isPending) return;
          setIsDeleteModalOpen(open);
          if (!open) setArticleToDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setArticleToDeleteId(null);
              }}
              disabled={deleteArticleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteArticleMutation.isPending || !articleToDeleteId}
            >
              {deleteArticleMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AllArticles;
