"use client";

import { Question, QuestionAnswer } from "@prisma/client";
import { Listitem } from "./_components/listitem";

export function QuestionList({
  questions,
}: {
  questions: (Question & {
    answers: QuestionAnswer[];
  })[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((question, index) => {
        return (
          <Listitem key={index} question={question} />
        );
      })}
    </div>
  )
}
