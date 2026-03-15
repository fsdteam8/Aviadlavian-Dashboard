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

type TopicItem = string | { _id?: string; Id?: string; Name?: string };

interface MediaObject {
  secure_url?: string;
  url?: string;
}

interface Article {
  name: string;
  topicIds: TopicItem[];
  isActive: boolean;
  description: string;
  image?: string | MediaObject;
  video?: string | MediaObject;
  createdAt?: string;
  updatedAt?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseMedia = (value: unknown): string | MediaObject | undefined => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return undefined;

  const secure_url =
    typeof value.secure_url === "string" ? value.secure_url : undefined;
  const url = typeof value.url === "string" ? value.url : undefined;

  if (!secure_url && !url) return undefined;
  return { secure_url, url };
};

const parseTopicItem = (value: unknown): TopicItem | null => {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return null;

  const _id = typeof value._id === "string" ? value._id : undefined;
  const Id = typeof value.Id === "string" ? value.Id : undefined;
  const Name = typeof value.Name === "string" ? value.Name : undefined;

  if (!_id && !Id && !Name) return null;
  return { _id, Id, Name };
};

const parseArticle = (value: unknown): Article | null => {
  if (!isRecord(value)) return null;

  const name = typeof value.name === "string" ? value.name : "";
  const isActive = typeof value.isActive === "boolean" ? value.isActive : false;
  const description =
    typeof value.description === "string" ? value.description : "";

  const topicIdsRaw = Array.isArray(value.topicIds) ? value.topicIds : [];
  const topicIds = topicIdsRaw
    .map(parseTopicItem)
    .filter((item): item is TopicItem => item !== null);

  const image = parseMedia(value.image);
  const video = parseMedia(value.video);

  const createdAt =
    typeof value.createdAt === "string" ? value.createdAt : undefined;
  const updatedAt =
    typeof value.updatedAt === "string" ? value.updatedAt : undefined;

  return {
    name,
    topicIds,
    isActive,
    description,
    image,
    video,
    createdAt,
    updatedAt,
  };
};

const ViewArticleModal: React.FC<ViewArticleModalProps> = ({
  isOpen,
  onClose,
  articleId,
}) => {
  const { data, isLoading, isError } = useArticle(articleId);

  const article = parseArticle(data?.data);

  const normalizedTopicIds = (article?.topicIds ?? [])
    .map((topic) => {
      if (typeof topic === "string") return topic;
      return topic.Id || topic._id || topic.Name || "";
    })
    .filter((topicId): topicId is string => topicId.length > 0);

  const imageUrl =
    typeof article?.image === "string"
      ? article.image
      : article?.image?.secure_url || article?.image?.url || "";

  const videoUrl =
    typeof article?.video === "string"
      ? article.video
      : article?.video?.secure_url || article?.video?.url || "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
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
            <div>
              <Label className="mb-2 font-semibold">Article Name</Label>
              <p className="text-gray-700 dark:text-gray-300">{article.name}</p>
            </div>

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

            <div>
              <Label className="mb-2 font-semibold">Description</Label>
              <div
                className="prose dark:prose-invert max-w-none border rounded-lg p-4 bg-slate-50 dark:bg-slate-900"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </div>

            {imageUrl && (
              <div>
                <Label className="mb-2 font-semibold">Image</Label>
                <Image
                  src={imageUrl}
                  alt={article.name || "Article image"}
                  width={1024}
                  height={256}
                  unoptimized
                  className="w-full max-h-64 object-contain rounded-md border"
                />
              </div>
            )}

            {videoUrl && (
              <div>
                <Label className="mb-2 font-semibold">Video</Label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-h-64 rounded-md border"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="mb-1 font-semibold text-sm">Created At</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div>
                <Label className="mb-1 font-semibold text-sm">Updated At</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {article.updatedAt
                    ? new Date(article.updatedAt).toLocaleString()
                    : "-"}
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
