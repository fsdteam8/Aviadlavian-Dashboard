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
import { useTopicsDropdown } from "@/features/articales/hooks/useTopicsDropdown";
import { useArticles } from "@/features/articales/hooks/useArticles";
import {
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from "../type/question.types";
import { Checkbox } from "@/components/ui/checkbox";

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

  const { data: topicsData, isLoading: isLoadingTopics } = useTopicsDropdown();
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

  const handleTopicSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, topicId: value }));
  };

  const handleArticleSelect = (value: string) => {
    // If selecting 'none', store empty string
    setFormData((prev) => ({
      ...prev,
      articleId: value === "none" ? "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topicId) {
      toast.error("Please select a Topic ID.");
      return;
    }

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
                <Label className="mb-2">Topic ID *</Label>
                <Select
                  value={formData.topicId}
                  onValueChange={handleTopicSelect}
                  disabled={isLoadingTopics}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Topic ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicsData?.data?.map((topic) => (
                      <SelectItem
                        key={topic._id}
                        value={topic.Primary_Body_Region}
                      >
                        {topic.Primary_Body_Region} - {topic.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Article ID (Optional)</Label>
                <Select
                  value={formData.articleId || "none"}
                  onValueChange={handleArticleSelect}
                  disabled={isLoadingArticles}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Article (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-slate-500 italic">None</span>
                    </SelectItem>
                    {articlesData?.data?.map((article) => (
                      <SelectItem key={article._id} value={article._id}>
                        {article.name}
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
                  Difficulty
                </Label>
                <Input
                  id="difficulty"
                  name="difficulty"
                  placeholder="easy, medium, hard"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                />
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
              <Label className="mb-2" htmlFor="explanation">
                Explanation *
              </Label>
              <Textarea
                id="explanation"
                name="explanation"
                placeholder="Why is this the correct answer?"
                value={formData.explanation}
                onChange={handleInputChange}
                rows={2}
                required
              />
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
