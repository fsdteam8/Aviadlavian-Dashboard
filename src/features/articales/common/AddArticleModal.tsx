"use client";

import React, { useMemo, useState } from "react";
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
import { useCreateArticle } from "../hooks/useCreateArticle";
import { useTopicsDropdown } from "../hooks/useTopicsDropdown";
import { ChevronLeft, ChevronRight, Loader2, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { toast } from "sonner";
import Image from "next/image";
import type { Topic } from "../api/topics-dropdown.api";

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const createArticleMutation = useCreateArticle();
  const [topicsPage, setTopicsPage] = useState(1);
  const topicsLimit = 10;
  const [selectedTopics, setSelectedTopics] = useState<Record<string, Topic>>(
    {},
  );

  const {
    data: topicsData,
    isLoading: isLoadingTopics,
    isFetching: isFetchingTopics,
  } = useTopicsDropdown(topicsPage, topicsLimit);

  const [formData, setFormData] = useState({
    name: "",
    topicIds: [] as string[],
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({ ...prev, description: html }));
  };

  const handleTopicSelect = (topicId: string) => {
    const selectedTopic = topicsData?.data.find(
      (topic) => topic._id === topicId,
    );

    if (!formData.topicIds.includes(topicId)) {
      setFormData((prev) => ({
        ...prev,
        topicIds: [...prev.topicIds, topicId],
      }));
    }

    if (selectedTopic) {
      setSelectedTopics((prev) => ({
        ...prev,
        [topicId]: selectedTopic,
      }));
    }
  };

  const removeTopicId = (topicIdToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      topicIds: prev.topicIds.filter((id) => id !== topicIdToRemove),
    }));

    setSelectedTopics((prev) => {
      const nextTopics = { ...prev };
      delete nextTopics[topicIdToRemove];
      return nextTopics;
    });
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

  //   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       setVideoFile(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setVideoPreview(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const totalTopicPages = topicsData?.meta.pages ?? 1;

  const selectedTopicChips = useMemo(() => {
    return formData.topicIds.map((topicId) => ({
      topicId,
      label:
        selectedTopics[topicId]?.Id ||
        topicsData?.data.find((topic) => topic._id === topicId)?.Id ||
        topicId,
    }));
  }, [formData.topicIds, selectedTopics, topicsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    createArticleMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          topicIds: [],
          description: "",
          isActive: true,
        });
        setImageFile(null);
        setVideoFile(null);
        setImagePreview("");
        setTopicsPage(1);
        setSelectedTopics({});
      },
      onError: (error) => {
        console.error("Mutation error:", error);

        const apiError = error as {
          response?: {
            data?: {
              data?: Array<{
                field?: string;
                message?: string;
              }>;
              message?: string;
            };
          };
        };

        const validationErrors = apiError.response?.data?.data;

        if (validationErrors && validationErrors.length > 0) {
          const errorMessages = validationErrors
            .map(
              (err) =>
                `${err.field || "field"}: ${err.message || "Invalid value"}`,
            )
            .join(", ");
          toast.error(`Validation failed: ${errorMessages}`);
          return;
        }

        toast.error(
          apiError.response?.data?.message || "Failed to create article",
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Add Article
          </DialogTitle>
        </DialogHeader>
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
              disabled={isLoadingTopics || isFetchingTopics}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Topic ID" />
              </SelectTrigger>
              <SelectContent className="w-[320px]">
                {topicsData?.data.map((topic) => (
                  <SelectItem key={topic._id} value={topic._id}>
                    {topic.Id} - {topic.Name}
                  </SelectItem>
                ))}

                <div className="flex items-center justify-between gap-2 border-t px-2 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setTopicsPage((prev) => Math.max(1, prev - 1));
                    }}
                    disabled={topicsPage === 1 || isFetchingTopics}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Prev
                  </Button>
                  <span className="text-xs text-slate-500">
                    Page {topicsPage} of {totalTopicPages} •{" "}
                    {topicsData?.meta.total ?? 0} topics
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setTopicsPage((prev) =>
                        Math.min(totalTopicPages, prev + 1),
                      );
                    }}
                    disabled={
                      topicsPage === totalTopicPages || isFetchingTopics
                    }
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </SelectContent>
            </Select>

            {/* Selected Topic IDs */}
            {formData.topicIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTopicChips.map(({ topicId, label }) => (
                  <div
                    key={topicId}
                    className="flex items-center gap-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{label}</span>
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
              disabled={createArticleMutation.isPending}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8"
            >
              {createArticleMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "+Add Article"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArticleModal;
