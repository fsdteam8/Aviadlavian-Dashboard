import React, { use } from "react";
import QuestionDetails from "@/features/questions/components/QuestionDetails";

export default function QuestionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <QuestionDetails questionId={unwrappedParams.id} />;
}
