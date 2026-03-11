"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useArticle } from "../hooks/useArticle";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ViewArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
}

const ViewArticleModal: React.FC<ViewArticleModalProps> = ({
  isOpen,
  onClose,
  articleId,
}) => {
  const { data, isLoading, isError } = useArticle(articleId);

  const article = data?.data;
  const normalizedTopicIds = ((article?.topicIds || []) as unknown[])
    .map((topic) => {
      if (typeof topic === "string") return topic;
      if (topic && typeof topic === "object") {
        const topicObj = topic as { _id?: string; Id?: string; Name?: string };
        return topicObj.Id || topicObj._id || topicObj.Name || "";
      }
      return "";
    })
    .filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            View Article
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500">
            Failed to load article details
          </div>
        )}

        {article && (
          <div className="space-y-4">
            {/* Article Name */}
            <div>
              <Label className="mb-2 font-semibold">Article Name</Label>
              <p className="text-gray-700 dark:text-gray-300">{article.name}</p>
            </div>

            {/* Topic IDs */}
            <div>
              <Label className="mb-2 font-semibold">Topic IDs</Label>
              <div className="flex flex-wrap gap-2">
                {normalizedTopicIds.map((topicId) => (
                  <span
                    key={topicId}
                    className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                  >
                    {topicId}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label className="mb-2 font-semibold">Status</Label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  article.isActive
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
              >
                {article.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Description */}
            <div>
              <Label className="mb-2 font-semibold">Description</Label>
              <div
                className="prose dark:prose-invert max-w-none border rounded-lg p-4 bg-slate-50 dark:bg-slate-900"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </div>

            {/* Image */}
            {article.image && (
              <div>
                <Label className="mb-2 font-semibold">Image</Label>
                <Image
                  src={article.image}
                  alt={article.name}
                  width={1024}
                  height={256}
                  unoptimized
                  className="w-full max-h-64 object-contain rounded-md border"
                />
              </div>
            )}

            {/* Video */}
            {article.video && (
              <div>
                <Label className="mb-2 font-semibold">Video</Label>
                <video
                  src={article.video}
                  controls
                  className="w-full max-h-64 rounded-md border"
                />
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="mb-1 font-semibold text-sm">Created At</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(article.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="mb-1 font-semibold text-sm">Updated At</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(article.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewArticleModal;
