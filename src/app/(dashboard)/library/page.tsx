import Library from "@/features/library/commponent/Library";
import React from "react";

const page = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      <Library />
    </main>
  );
};

export default page;
