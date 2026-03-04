import FlashCardDetails from "@/features/flashcards/commponent/FlashCardDetails";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ subspecialty: string; questionId: string }>;
  searchParams?: Promise<{
    question?: string | string[];
    subspecialty?: string | string[];
    chapter?: string | string[];
  }>;
}) => {
  const { subspecialty, questionId } = await params;
  const search = searchParams ? await searchParams : undefined;

  const question = Array.isArray(search?.question)
    ? search?.question[0]
    : search?.question;

  const subspecialtyTitle = Array.isArray(search?.subspecialty)
    ? search?.subspecialty[0]
    : search?.subspecialty;

  const chapterTitle = Array.isArray(search?.chapter)
    ? search?.chapter[0]
    : search?.chapter;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <FlashCardDetails
        question={question}
        subspecialty={subspecialtyTitle || subspecialty}
        chapter={chapterTitle}
        questionId={questionId}
      />
    </main>
  );
};

export default page;
