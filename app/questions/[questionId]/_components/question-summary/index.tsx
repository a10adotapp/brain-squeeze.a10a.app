"use client";

import { Question } from "@prisma/client";

export function QuestionSummary({
  question,
}: {
  question: Question;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-xl font-semibold text-gray-600 mb-4">
        {question.question}
      </p>
    </div>
  );
}
