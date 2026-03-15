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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useSingleQuestion,
} from "../hooks";
import { useArticles } from "@/features/articales/hooks/useArticles";
import {
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from "../type/question.types";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/features/articales/common/RichTextEditor";
import { Plus, Trash2 } from "lucide-react";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "add" | "edit";
  questionId?: string | null;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  questionId,
}) => {
  const isEdit = mode === "edit";

  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const { data: questionData, isLoading: isLoadingSingle } = useSingleQuestion(
    questionId as string,
    isEdit && !!questionId,
  );

  // Fetching a larger limit to ensure all articles fit in the dropdown without pagination for now
  const { data: articlesData, isLoading: isLoadingArticles } = useArticles(
    1,
    100,
  );

  const defaultOptions = [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];

  const [formData, setFormData] = useState({
    articleId: "",
    topicId: "",
    questionText: "",
    options: defaultOptions,
    explanation: "",
    keyPoints: [""],
    marks: 1,
    difficulty: "easy",
    isHidden: false,
  });

  useEffect(() => {
    if (isEdit && questionData?.data) {
      const q = questionData.data;
      setFormData({
        articleId:
          typeof q.articleId === "string"
            ? q.articleId
            : q.articleId?._id || "",
        topicId: q.topicId || "",
        questionText: q.questionText || "",
        options: q.options && q.options.length > 0 ? q.options : defaultOptions,
        explanation: q.explanation || "",
        keyPoints: q.keyPoints && q.keyPoints.length > 0 ? q.keyPoints : [""],
        marks: q.marks || 1,
        difficulty: q.difficulty || "easy",
        isHidden: q.isHidden || false,
      });
    } else if (!isEdit && isOpen) {
      // Reset when opening ADD modal
      setFormData({
        articleId: "",
        topicId: "",
        questionText: "",
        options: defaultOptions,
        explanation: "",
        keyPoints: [""],
        marks: 1,
        difficulty: "easy",
        isHidden: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, questionData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleArticleSelect = (value: string) => {
    // If selecting 'none', store empty string
    setFormData((prev) => ({
      ...prev,
      articleId: value === "none" ? "" : value,
    }));
  };

  const handleAddKeyPoint = () => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""],
    }));
  };

  const handleRemoveKeyPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    setFormData((prev) => ({ ...prev, keyPoints: newKeyPoints }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate options
    const filledOptions = formData.options.filter((o) => o.text.trim() !== "");
    if (filledOptions.length < 2) {
      toast.error("Please provide at least two options.");
      return;
    }
    const hasCorrect = formData.options.some(
      (o) => o.isCorrect && o.text.trim() !== "",
    );
    if (!hasCorrect) {
      toast.error("Please mark at least one valid option as correct.");
      return;
    }

    if (isEdit && questionId) {
      const payload: UpdateQuestionPayload = {
        articleId: formData.articleId || undefined,
        topicId: formData.topicId,
        questionText: formData.questionText,
        options: formData.options,
        explanation: formData.explanation,
        keyPoints: formData.keyPoints.filter((kp) => kp.trim() !== ""),
        marks: formData.marks,
        difficulty: formData.difficulty,
        isHidden: formData.isHidden,
      };

      updateMutation.mutate(
        { id: questionId, payload },
        {
          onSuccess: () => {
            onSuccess();
            onClose();
          },
        },
      );
    } else {
      const payload: CreateQuestionPayload = {
        articleId: formData.articleId || undefined,
        topicId: formData.topicId,
        questionText: formData.questionText,
        options: formData.options,
        explanation: formData.explanation,
        keyPoints: formData.keyPoints.filter((kp) => kp.trim() !== ""),
        marks: formData.marks,
        difficulty: formData.difficulty,
      };

      createMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isEdit ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        {isEdit && isLoadingSingle ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Article ID (Optional)</Label>
                <Select
                  value={formData.articleId || "none"}
                  onValueChange={handleArticleSelect}
                  disabled={isLoadingArticles}
                >
                  <SelectTrigger className="w-full flex items-center justify-between truncate">
                    <SelectValue placeholder="Select Article (Optional)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="none">
                      <span className="text-slate-500 italic">None</span>
                    </SelectItem>
                    {articlesData?.data?.map((article) => (
                      <SelectItem key={article._id} value={article._id}>
                        <span className="truncate">
                          {(article.name || "").replace(/<[^>]*>/g, "")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2" htmlFor="marks">
                  Marks *
                </Label>
                <Input
                  id="marks"
                  name="marks"
                  type="number"
                  min={1}
                  value={formData.marks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label className="mb-2" htmlFor="difficulty">
                  Difficulty *
                </Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, difficulty: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="questionText">
                Question Text *
              </Label>
              <Textarea
                id="questionText"
                name="questionText"
                placeholder="Enter the question..."
                value={formData.questionText}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="font-semibold text-md">Options</Label>
              {formData.options.map((opt, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      required={index < 2} // Require at least 2
                    />
                  </div>
                  <div className="flex items-center gap-2 w-32 border px-3 py-2 rounded-md justify-center">
                    <input
                      type="radio"
                      id={`correct-${index}`}
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectChange(index)}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={`correct-${index}`}
                      className="cursor-pointer"
                    >
                      Correct
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label className="mb-2 font-semibold" htmlFor="explanation">
                Explanation *
              </Label>
              <RichTextEditor
                content={formData.explanation}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, explanation: html }))
                }
                placeholder="Why is this the correct answer?"
              />
            </div>

            <div className="space-y-4">
              <Label className="font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                <Plus size={16} /> Key Study Points
              </Label>
              <div className="space-y-3">
                {formData.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xs font-bold text-teal-600 border border-teal-100 shadow-sm">
                      {index + 1}
                    </div>
                    <Input
                      placeholder={`Enter key point ${index + 1}...`}
                      value={point}
                      onChange={(e) =>
                        handleKeyPointChange(index, e.target.value)
                      }
                      className="flex-1 h-10 focus-visible:ring-teal-500 hover:border-teal-200 transition-all"
                    />
                    <div className="flex items-center gap-1">
                      {index === formData.keyPoints.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddKeyPoint}
                          className="h-10 w-10 text-teal-600 border-teal-200 hover:bg-teal-50 transition-colors shadow-sm"
                          title="Add new point"
                        >
                          <Plus size={18} />
                        </Button>
                      )}
                      {formData.keyPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveKeyPoint(index)}
                          className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove point"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formData.keyPoints.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddKeyPoint}
                  className="w-full py-6 border-dashed border-teal-200 text-teal-600 hover:bg-teal-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add your first key point
                </Button>
              )}
            </div>

            {isEdit && (
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <Checkbox
                  id="isHidden"
                  checked={formData.isHidden}
                  onCheckedChange={(c) =>
                    setFormData((prev) => ({ ...prev, isHidden: c === true }))
                  }
                />
                <Label
                  htmlFor="isHidden"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Hide Question (Archive)
                </Label>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : isEdit ? (
                  "Update Question"
                ) : (
                  "Create Question"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
