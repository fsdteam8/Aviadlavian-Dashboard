"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateArticle } from "../hooks/useUpdateArticle";
import { useArticle } from "../hooks/useArticle";
import { useTopicsDropdown } from "../hooks/useTopicsDropdown";
import { Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { toast } from "sonner";
import Image from "next/image";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  articleId,
}) => {
  const { data, isLoading } = useArticle(articleId);
  const updateArticleMutation = useUpdateArticle();
  const { data: topicsData, isLoading: isLoadingTopics } = useTopicsDropdown();

  const [formData, setFormData] = useState({
    name: "",
    topicIds: [] as string[],
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const videoFile: File | null = null;
  const [imagePreview, setImagePreview] = useState<string>("");

  const getMediaUrl = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      const mediaObj = value as {
        url?: string;
        secure_url?: string;
        path?: string;
      };
      return mediaObj.url || mediaObj.secure_url || mediaObj.path || "";
    }
    return "";
  };

  useEffect(() => {
    if (data?.data && isOpen) {
      const article = data.data;
      const normalizedTopicIds = ((article.topicIds || []) as unknown[])
        .map((topic) => {
          if (typeof topic === "string") return topic;
          if (topic && typeof topic === "object") {
            const topicObj = topic as { _id?: string; Id?: string };
            return topicObj._id || topicObj.Id || "";
          }
          return "";
        })
        .filter(Boolean);

      queueMicrotask(() => {
        setFormData({
          name: article.name || "",
          topicIds: normalizedTopicIds,
          description: article.description || "",
          isActive: article.isActive ?? true,
        });
        setImagePreview(
          getMediaUrl(
            (article as { image?: unknown; Image_URL?: unknown }).image,
          ) ||
            getMediaUrl(
              (article as { image?: unknown; Image_URL?: unknown }).Image_URL,
            ),
        );
      });
    }
  }, [data, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({ ...prev, description: html }));
  };

  const handleTopicSelect = (topicId: string) => {
    if (!formData.topicIds.includes(topicId)) {
      setFormData((prev) => ({
        ...prev,
        topicIds: [...prev.topicIds, topicId],
      }));
    }
  };

  const removeTopicId = (topicIdToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      topicIds: prev.topicIds.filter((id) => id !== topicIdToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!articleId) return;

    if (formData.topicIds.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    const normalizedTopicIds = formData.topicIds
      .map((topicRef) => {
        if (/^[a-f\d]{24}$/i.test(topicRef)) return topicRef;
        return (
          topicsData?.data.find((topic) => topic.Id === topicRef)?._id ||
          topicRef
        );
      })
      .filter(Boolean);

    const payload = {
      name: formData.name,
      topicIds: normalizedTopicIds,
      description: formData.description,
      isActive: formData.isActive,
      image: imageFile || undefined,
      video: videoFile || undefined,
    };

    updateArticleMutation.mutate(
      {
        id: articleId,
        payload,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Article
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        )}

        {!isLoading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Article Name */}
            <div>
              <Label className="mb-2" htmlFor="name">
                Article Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Give Article Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Topic ID Dropdown */}
            <div>
              <Label className="mb-2">Topic ID</Label>
              <Select
                onValueChange={handleTopicSelect}
                disabled={isLoadingTopics}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic ID" />
                </SelectTrigger>
                <SelectContent>
                  {topicsData?.data.map((topic) => (
                    <SelectItem key={topic._id} value={topic._id}>
                      {topic.Id} - {topic.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Topic IDs */}
              {formData.topicIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.topicIds.map((topicId) => (
                    <div
                      key={topicId}
                      className="flex items-center gap-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                    >
                      <span>
                        {topicsData?.data.find((topic) => topic._id === topicId)
                          ?.Id || String(topicId)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTopicId(topicId)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>

            {/* Articles Description - Rich Text Editor */}
            <div>
              <Label className="mb-2">Articles Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Write your article content here..."
                allowImages={true}
              />
            </div>

            {/* Upload Image and Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload Image */}
              <div>
                <Label className="mb-2">Upload Image</Label>
                {imagePreview ? (
                  <div className="relative border-2 border-dashed rounded-lg p-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={512}
                      height={128}
                      unoptimized
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-teal-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Upload Video */}
              {/* <div>
                <Label className="mb-2">Upload Video</Label>
                {videoPreview ? (
                  <div className="relative border-2 border-dashed rounded-lg p-4">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-32 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-teal-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div> */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={updateArticleMutation.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8"
              >
                {updateArticleMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Article"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditArticleModal;
