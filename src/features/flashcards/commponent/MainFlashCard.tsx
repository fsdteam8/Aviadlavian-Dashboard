"use client";

import React, { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import FlashCardNewAddModal from "../common/FlashCardNewAddModal";
import FlashCardEditModal from "../common/FlashCardEditModal";
import FlashCardViewModal from "../common/FlashCardViewModal";

import { FlashCard } from "../types/flashCardType";
import { useDeleteFlashcard, useFlashcards } from "../hooks/useFlashcard";

const MainFlashCard = () => {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { data, isLoading, isError } = useFlashcards(page, limit);
  const deleteMutation = useDeleteFlashcard();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<FlashCard | null>(
    null,
  );

  const handleView = (flashcard: FlashCard) => {
    setSelectedFlashcard(flashcard);
    setIsViewModalOpen(true);
  };

  const handleEdit = (flashcard: FlashCard) => {
    setSelectedFlashcard(flashcard);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedFlashcard(null);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setSelectedFlashcard(null);
  };

  const handleDelete = async (flashcardId: string) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(flashcardId);
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
    }
  };

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Error loading flashcards.
      </div>
    );

  const flashcards = data?.data || [];
  const meta = data?.meta;
  // console.log('meta',meta)

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Flashcards</h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2EB8A3] hover:bg-[#26a591] text-white flex items-center gap-2 px-6 py-2 rounded-lg"
          >
            <Plus size={18} /> Add New
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-4 font-semibold text-gray-600">
                  Secondary Body Region
                </th>
                <th className="pb-4 font-semibold text-gray-600">Difficulty</th>
                <th className="pb-4 font-semibold text-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array.from({ length: limit }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      <td className="py-4">
                        <Skeleton className="h-5 w-44" />
                      </td>
                      <td className="py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                : flashcards.map((fc) => (
                    <tr
                      key={fc._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 text-gray-700">
                        {fc.topicId?.Secondary_Body_Region ||
                          fc.topicId?.Name?.slice(0, 12) ||
                          "N/A"}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                      ${
                        fc.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : fc.difficulty === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                        >
                          {fc.difficulty}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleView(fc)}
                            className="p-2 text-gray-400 hover:text-[#2EB8A3] transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(fc)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(fc._id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.pages > 1 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, meta.total)} of {meta.total} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-200 text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-md text-sm transition-colors ${
                        page === p
                          ? "bg-[#2EB8A3] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
                className="border-gray-200 text-gray-600 disabled:opacity-50"
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <FlashCardNewAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedFlashcard && (
        <FlashCardEditModal
          key={selectedFlashcard._id}
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          flashcard={selectedFlashcard}
        />
      )}

      {selectedFlashcard && (
        <FlashCardViewModal
          key={`view-${selectedFlashcard._id}`}
          isOpen={isViewModalOpen}
          onClose={handleCloseView}
          flashcard={selectedFlashcard}
        />
      )}
    </div>
  );
};

export default MainFlashCard;
