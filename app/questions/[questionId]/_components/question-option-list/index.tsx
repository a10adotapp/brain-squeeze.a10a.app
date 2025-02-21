"use client";

import { Context as LiffContext } from "@/app/_contexts/liff-context";
import { QuestionAnswer, QuestionOption } from "@prisma/client";
import { Listitem } from "./_components/listitem";
import { use, useEffect, useMemo, useState } from "react";
import { getQuestionAnswerCached } from "./_actions/get-question-answer";

export function QuestionOptionList({
  questionOptions,
  questionAnswers,
}: {
  questionOptions: QuestionOption[];
  questionAnswers: QuestionAnswer[];
}) {
  const { liff } = use(LiffContext);

  const [userQuestionAnswer, setUserQuestionAnswer] = useState<QuestionAnswer | null>(null);

  const lineUserId = useMemo(() => {
    return liff?.getContext()?.userId;
  }, [liff]);

  useEffect(() => {
    if (lineUserId) {
      (async () => {
        const questionAnswer = await getQuestionAnswerCached({
          lineUserId,
        });

        setUserQuestionAnswer(questionAnswer);
      })();
    }
  }, [lineUserId]);

  return (
    <div className="flex flex-col gap-4">
      {questionOptions.map((questionOption, index) => {
        const answerCount = questionAnswers.filter((questionAnswer) => {
          return questionAnswer.questionOptionId === questionOption.id;
        }).length;

        return (
          <Listitem
            key={index}
            questionOption={questionOption}
            totalAnswerCount={questionAnswers.length}
            answerCount={answerCount}
            isUserSelected={questionOption.id === userQuestionAnswer?.questionOptionId} />
        );
      })}
    </div>
  );
}
