"use client";

import { Card } from "@/components/ui/card";
import { Question, QuestionAnswer } from "@prisma/client";
import Link from "next/link";

export function Listitem({
  question,
}: {
  question: Question & {
    answers: QuestionAnswer[];
  };
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 p-6">
        <Link href={`/questions/${question.id}`}>
          <div className="font-bold">
            {question.question}
          </div>
        </Link>
      </div>
    </Card>
  );
}
