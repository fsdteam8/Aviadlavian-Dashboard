import SubLibrary from "@/features/library/commponent/SubLibrary";
import React from "react";

const page = async ({ params }: { params: Promise<{ libraryId: string }> }) => {
  const { libraryId } = await params;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <SubLibrary libraryId={libraryId} />
    </main>
  );
};

export default page;
