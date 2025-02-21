"use server";

import { prisma } from "@/lib/prisma";
import { QuestionAnswer } from "@prisma/client";
import { cache } from "react";

export async function getQuestionAnswer({
  lineUserId,
}: {
  lineUserId: string;
}): Promise<QuestionAnswer | null> {
  return await prisma.questionAnswer.findFirst({
    where: {
      deletedAt: null,
      lineUserId,
    },
  }) || null;
}

export const getQuestionAnswerCached = cache(getQuestionAnswer);
