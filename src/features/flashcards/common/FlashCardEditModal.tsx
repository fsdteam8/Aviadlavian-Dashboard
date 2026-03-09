import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { FlashCard } from "../types/flashCardType";
import { useUpdateFlashcard } from "../hooks/useFlashcard";

interface FlashCardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcard: FlashCard | null;
}

const FlashCardEditModal = ({
  isOpen,
  onClose,
  flashcard,
}: FlashCardEditModalProps) => {
  const [difficulty, setDifficulty] = useState(
    flashcard?.difficulty ?? "medium",
  );
  const [question, setQuestion] = useState(flashcard?.question ?? "");
  const [answer, setAnswer] = useState(flashcard?.answer ?? "");

  const updateMutation = useUpdateFlashcard();

  if (!flashcard) return null;

  const handleUpdate = async () => {
    if (!flashcard) return;

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);
    formData.append("difficulty", difficulty);

    try {
      await updateMutation.mutateAsync({ id: flashcard._id, data: formData });
      onClose();
    } catch (error) {
      console.error("Failed to update flashcard:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#f8f9fa] rounded-2xl shadow-xl overflow-hidden p-8 border-none pointer-events-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <Label className="w-40 text-lg font-normal text-gray-700">
              Difficulty Level :
            </Label>
            <div className="relative">
              <Select
                value={difficulty}
                onValueChange={(value) =>
                  setDifficulty(value as FlashCard["difficulty"])
                }
              >
                <SelectTrigger className="w-[120px] bg-white border border-gray-200 rounded-lg text-gray-400 h-10 focus:ring-0">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Label className="w-40 text-lg font-normal text-gray-700 whitespace-nowrap">
              Questions :
            </Label>
            <div className="flex-1">
              <Input
                placeholder="How many keys are there on a standard piano?"
                className="w-full bg-white border border-gray-200 rounded-xl h-12 px-6 text-gray-400 focus:outline-none focus:border-gray-300 text-lg placeholder:text-gray-300 shadow-none border-none ring-0 focus-visible:ring-0"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-normal text-gray-700 block">
              Correct Answer
            </Label>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6">
              <Textarea
                placeholder="Full Answer......."
                className="w-full min-h-[220px] bg-white border-none p-0 text-gray-400 focus:outline-none focus-visible:ring-0 text-lg placeholder:text-gray-300 resize-none"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 bg-white border-[#2EB8A3] text-[#2EB8A3] hover:bg-transparent hover:text-[#2EB8A3] rounded-xl text-lg font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="flex-1 h-14 bg-[#2EB8A3] hover:bg-[#26a591] text-white rounded-xl text-lg font-medium border-none shadow-none disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardEditModal;
