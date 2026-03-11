"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSingleQuestion } from "../hooks";
import { useArticle } from "@/features/articales/hooks";
import { useInjury } from "@/features/topics/hooks";

interface QuestionDetailsProps {
  questionId: string;
}

const ArticleDisplayName = ({
  articleId,
}: {
  articleId: string | { _id: string; name: string };
}) => {
  const isObject = typeof articleId === "object";
  const idToFetch = isObject ? null : (articleId as string);
  const { data, isLoading } = useArticle(idToFetch);

  if (isObject)
    return (
      <>
        {(articleId as { name: string }).name ||
          (articleId as { _id: string })._id}
      </>
    );

  if (isLoading)
    return <Loader2 className="h-3 w-3 animate-spin inline mr-1" />;
  return <>{data?.data?.name || articleId}</>;
};

const TopicDisplayName = ({ topicId }: { topicId: string }) => {
  const { data, isLoading } = useInjury(topicId);
  if (isLoading)
    return <Loader2 className="h-3 w-3 animate-spin inline mr-1" />;
  return <>{data?.data?.Name || topicId}</>;
};

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ questionId }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useSingleQuestion(questionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-slate-500">
          Question not found or an error occurred.
        </p>
        <button
          onClick={() => router.push("/questionbank")}
          className="text-teal-500 hover:text-teal-600 font-medium"
        >
          Return to Question Bank
        </button>
      </div>
    );
  }

  const {
    questionText,
    topicId,
    articleId,
    options,
    explanation,
    marks,
    difficulty,
    isHidden,
    createdAt,
    totalAttempts,
    correctAttempts,
  } = data.data;

  // Assuming options is an array of {text, isCorrect, _id}
  const safeOptions = Array.isArray(options) ? options : [];
  const correctOptionsCount = safeOptions.filter((o) => o.isCorrect).length;

  return (
    <section className="w-full p-6 transition-colors dark:text-slate-100 max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/questionbank")}
          className="flex items-center text-teal-500 hover:text-teal-600 font-semibold gap-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Question Bank
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 sm:p-8">
        {/* Meta Info row */}
        <div className="flex flex-wrap items-center justify-between border-b pb-6 mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Question Details
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ID:{" "}
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {questionId}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-lg font-semibold flex flex-col items-center border border-teal-100 dark:border-teal-800">
              <span className="text-xs uppercase tracking-wider opacity-80">
                Marks
              </span>
              <span className="text-lg">{marks}</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-semibold flex flex-col items-center border border-blue-100 dark:border-blue-800">
              <span className="text-xs uppercase tracking-wider opacity-80">
                Difficulty
              </span>
              <span className="text-lg capitalize">{difficulty || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* The Question */}
            <div>
              <h2 className="font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider text-sm">
                The Question
              </h2>
              <div className="text-xl sm:text-2xl font-medium text-slate-900 dark:text-slate-100 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                {questionText}
              </div>
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm">
                  Options
                </h2>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                  {correctOptionsCount > 1
                    ? "Multiple Correct Answers"
                    : "Single Choice"}
                </span>
              </div>

              <div className="grid gap-3">
                {safeOptions.map((opt, idx) => (
                  <div
                    key={opt._id || idx}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      opt.isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${opt.isCorrect ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span
                        className={`text-lg ${opt.isCorrect ? "text-green-900 dark:text-green-100 font-medium" : "text-slate-700 dark:text-slate-200"}`}
                      >
                        {opt.text}
                      </span>
                    </div>
                    {opt.isCorrect && (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                Explanation
              </h2>
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-6 rounded-xl text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                <p>{explanation || "No explanation provided."}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-6 border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3">
                Classification
              </h3>

              <div>
                <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                  Topic
                </span>
                <span className="px-3 py-1 bg-white dark:bg-slate-900 border rounded-md font-medium text-slate-700 dark:text-slate-300 inline-block shadow-sm">
                  <TopicDisplayName topicId={topicId} />
                </span>
              </div>

              <div>
                <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                  Article Info
                </span>
                {articleId ? (
                  <span className="text-sm font-medium text-teal-600 dark:text-teal-400 wrap-break-word">
                    <ArticleDisplayName articleId={articleId} />
                  </span>
                ) : (
                  <span className="text-sm text-slate-500 italic">
                    None linked
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-6 border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3">
                Analytics & Status
              </h3>

              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border shadow-sm">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Attempts
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {totalAttempts || 0}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border shadow-sm">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Correct Rate
                </span>
                <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded">
                  {totalAttempts &&
                  totalAttempts > 0 &&
                  correctAttempts !== undefined
                    ? `${Math.round((correctAttempts / totalAttempts) * 100)}%`
                    : "0%"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border shadow-sm">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Status
                </span>
                {isHidden ? (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-full">
                    <XCircle className="w-3 h-3" /> Hidden
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              {createdAt && (
                <div className="pt-2 text-xs text-slate-500 text-center">
                  Created: {new Date(createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionDetails;
