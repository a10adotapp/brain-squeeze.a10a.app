"use server";

import { prisma } from "@/lib/prisma";
import { Question, QuestionAnswer, QuestionOption } from "@prisma/client";
import { cache } from "react";

export async function getQuestion(id: string): Promise<
  Question & {
    answers: QuestionAnswer[];
    options: QuestionOption[];
  }
> {
  return await prisma.question.findFirstOrThrow({
    include: {
      answers: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          questionOptionId: "asc",
        },
      },
      options: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
    where: {
      deletedAt: null,
      id: id,
    },
  });
}

export const getQuestionCached = cache(getQuestion);
