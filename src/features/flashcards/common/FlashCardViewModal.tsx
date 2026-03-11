import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlashCard } from "../types/flashCardType";
import { Badge } from "@/components/ui/badge";

interface FlashCardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcard: FlashCard | null;
}

const FlashCardViewModal = ({
  isOpen,
  onClose,
  flashcard,
}: FlashCardViewModalProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!flashcard) return null;

  const handleClose = () => {
    setIsRevealed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl shadow-2xl p-0 border-none overflow-hidden">
        <div className="bg-[#2EB8A3] p-8 text-white relative">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {flashcard.topicId?.Primary_Body_Region || "General"}
            </Badge>
            <Badge
              className={`px-4 py-1 rounded-full text-sm font-medium border-none shadow-sm
              ${
                flashcard.difficulty === "easy"
                  ? "bg-green-400 text-white"
                  : flashcard.difficulty === "medium"
                    ? "bg-amber-400 text-white"
                    : "bg-red-400 text-white"
              }`}
            >
              {flashcard.difficulty.toUpperCase()}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold leading-tight mt-2 opacity-90">
            {flashcard.topicId?.Name || "Flashcard Detail"}
          </h3>
          <p className="text-white/70 text-sm mt-2 font-medium uppercase tracking-wider">
            {flashcard.topicId?.Secondary_Body_Region}
          </p>
        </div>

        <div className="p-8 space-y-8 bg-[#FDFDFD]">
          {/* Question Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Question
            </h4>
            <p className="text-xl text-gray-800 font-medium leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Answer Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Answer
            </h4>
            {isRevealed ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-lg text-gray-700 leading-relaxed bg-[#2EB8A3]/5 p-6 rounded-2xl border border-[#2EB8A3]/10">
                  {flashcard.answer}
                </p>
              </div>
            ) : (
              <div
                onClick={() => setIsRevealed(true)}
                className="group cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 hover:bg-gray-100/50 hover:border-[#2EB8A3]/30 transition-all active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-[#2EB8A3] text-xl font-bold">?</span>
                </div>
                <p className="text-gray-400 font-medium">
                  Click to reveal the answer
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-14 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-2xl text-lg font-semibold transition-all"
            >
              Close
            </Button>
            {isRevealed && (
              <Button
                onClick={() => setIsRevealed(false)}
                className="flex-1 h-14 bg-[#2EB8A3] hover:bg-[#26a591] text-white rounded-2xl text-lg font-semibold border-none shadow-lg shadow-[#2EB8A3]/20 transition-all"
              >
                Hide Answer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardViewModal;
