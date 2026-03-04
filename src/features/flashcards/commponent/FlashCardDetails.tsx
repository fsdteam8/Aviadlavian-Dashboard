"use client";

import React, { useState } from "react";
import Link from "next/link";

type FlashCardDetailsProps = {
  question?: string;
  subspecialty?: string;
  chapter?: string;
  questionId?: string;
};

const demoAnswers: Record<string, string> = {
  "1": "Pulmonary Embolism",
  "2": "Aortic Dissection",
  "3": "Myocardial Infarction",
  "4": "Pulmonary Embolism",
  "5": "Tension Pneumothorax",
  "6": "Pulmonary Embolism",
  "7": "Acute Pericarditis",
  "8": "Pulmonary Embolism",
  "9": "Esophageal Rupture",
  "10": "Pulmonary Embolism",
};

const FlashCardDetails = ({
  question = "A 65 years old male presents with sudden onset chest pain radiating to his back. What is most likely diagnosis?",
  subspecialty = "Knee",
  chapter = "Chondromalacia Patella",
  questionId = "1",
}: FlashCardDetailsProps) => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [confidenceRating, setConfidenceRating] = useState<string | null>(null);

  const answer = demoAnswers[questionId] || "Pulmonary Embolism";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Flashcards
          </h1>
          <Link
            href="/flashcards"
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span className="text-sm">Close</span>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mt-2 text-sm text-orange-700 dark:text-orange-400">
          <span>Flashcard</span>
          <span className="mx-1">&gt;</span>
          <span>{subspecialty}</span>
          <span className="mx-1">&gt;</span>
          <span>{chapter}</span>
          <span className="mx-1">&gt;</span>
          <span>Flashcards</span>
        </div>

        {/* Main Content */}
        <div className="mt-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Flashcard Answer
          </h2>

          {/* Question and Answer Card */}
          <div className="mt-4 overflow-hidden rounded-lg border border-orange-300 dark:border-orange-900/50">
            {/* Question Section */}
            <div className="bg-orange-50 p-6 dark:bg-orange-950/20">
              <div className="mb-3 flex justify-center">
                <span className="text-4xl">🫀</span>
              </div>
              <p className="text-center text-sm leading-relaxed text-orange-900 dark:text-orange-100">
                {question}
              </p>
            </div>

            {/* Answer Section */}
            <div className="bg-blue-50 p-6 dark:bg-blue-950/20">
              {!isAnswerRevealed ? (
                <button
                  type="button"
                  onClick={() => setIsAnswerRevealed(true)}
                  className="w-full rounded-lg py-3 text-center font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Reveal Answer
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Confidence Rating */}
          {/* {isAnswerRevealed && ( */}
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Rate your confidence. Did you know the answer?
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setConfidenceRating("correct")}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition ${
                  confidenceRating === "correct"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                Correct
              </button>
              <button
                type="button"
                onClick={() => setConfidenceRating("incorrect")}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition ${
                  confidenceRating === "incorrect"
                    ? "border-red-600 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-300"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                Incorrect
              </button>
              <button
                type="button"
                onClick={() => setConfidenceRating("unsure")}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition ${
                  confidenceRating === "unsure"
                    ? "border-amber-600 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/30 dark:text-amber-300"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                Unsure
              </button>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default FlashCardDetails;
