import SubLibraryDetails from "@/features/library/commponent/SubLibraryDetails";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ libraryId: string; sublibraryId: string }>;
}) => {
  const { libraryId, sublibraryId } = await params;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <SubLibraryDetails libraryId={libraryId} chapterId={sublibraryId} />
    </main>
  );
};

export default page;
