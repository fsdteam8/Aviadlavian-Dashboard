import FlashCardDetails from "@/features/flashcards/commponent/FlashCardDetails";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ flashcardId: string; SubFlashCardId: string }>;
  searchParams?: Promise<{
    subspecialty?: string | string[];
    chapter?: string | string[];
  }>;
}) => {
  await params;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <FlashCardDetails />
    </main>
  );
};

export default page;
