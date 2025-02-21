"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { QuestionOption } from "@prisma/client";

export function Listitem({
  questionOption,
  totalAnswerCount,
  answerCount,
  isUserSelected,
}: {
  questionOption: QuestionOption;
  totalAnswerCount: number;
  answerCount: number;
  isUserSelected: boolean;
}) {
  const responsePercentage = totalAnswerCount > 0 ? answerCount / totalAnswerCount * 100 : 0;

  return (
    <div
      className={cn(...[
        `flex flex-col gap-2 p-4 border-2 rounded-lg`,
        ...(questionOption.isCorrect ? ["bg-green-100 border-green-500"] : ["bg-gray-100"]),
      ])}
    >
      <div className="flex justify-between items-center">
        {questionOption.isCorrect ? (
          <div className="bg-green-700 text-white px-2 rounded">
            正解
          </div>
        ) : <div />}

        {isUserSelected ? (
          <div className="bg-orange-700 text-white px-2 rounded">
            あなたの回答
          </div>
        ) : <div />}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`font-semibold ${questionOption.isCorrect ? "text-green-700" : "text-gray-700"}`}
            >
              {questionOption.optionText}
            </span>

            <span className="flex flex-col items-end">
              <div className="text-sm text-gray-600">
                {answerCount}人
              </div>

              <div className="text-sm text-gray-600">
                ({responsePercentage.toFixed(1)}%)
              </div>
            </span>
          </div>

          <Progress value={responsePercentage} className="h-2" />
        </div>

        <p className="text-sm text-gray-600">
          {questionOption.description}
        </p>
      </div>
    </div>
  );
}
