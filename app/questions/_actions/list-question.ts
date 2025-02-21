"use server";

import { prisma } from "@/lib/prisma";
import { Question, QuestionAnswer } from "@prisma/client";
import { cache } from "react";

export async function listQuestion(): Promise<
  (Question & {
    answers: QuestionAnswer[];
  })[]
> {
  return await prisma.question.findMany({
    include: {
      answers: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          questionOptionId: "asc",
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const listQuestionCached = cache(listQuestion);
