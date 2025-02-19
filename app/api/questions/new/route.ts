import { cronscriptToken } from "@/lib/env/cronscript-token";
import { broadcast } from "@/lib/line/broadcast";
import { generateQuestionData } from "@/lib/openai/generate-question-data";
import { generateQuestionImage } from "@/lib/openai/generate-question-image";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  const token = cronscriptToken();

  if (token) {
    if (token !== request.headers.get("x-cronscript-token")) {
      return NextResponse.json({
        error: "Invalid token",
      }, {
        status: 401,
      });
    }
  }

  const questionData = await generateQuestionData();

  const createdQuestion = await prisma.question.create({
    data: {
      question: questionData.question,
    },
  });

  await prisma.questionOption.createMany({
    data: questionData.questionOptions.map((questionOptionData) => ({
      questionId: createdQuestion.id,
      optionText: questionOptionData.optionText,
      description: questionOptionData.description,
      isCorrect: questionOptionData.isCorrect,
    })),
  });

  const question = await prisma.question.findFirstOrThrow({
    include: {
      options: true,
    },
    where: {
      deletedAt: null,
      id: createdQuestion.id,
    },
  });

  const imageUrl = await generateQuestionImage(question);

  await broadcast([
    {
      type: "flex",
      altText: question.question,
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: imageUrl || "https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: question.question,
              size: "lg",
              weight: "bold",
              wrap: true,
            },
          ],
        },
      },
    },
    ...question.options.map((questionOption) => ({
      type: "flex",
      altText: [
        question.question,
        "-----",
        questionOption.optionText,
      ].join("\n"),
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "horizontal",
          spacing: "md",
          contents: [
            {
              type: "box",
              layout: "vertical",
              flex: 2,
              contents: [
                {
                  type: "text",
                  text: questionOption.optionText,
                  wrap: true,
                },
              ],
            },
            {
              type: "button",
              flex: 1,
              style: "secondary",
              height: "sm",
              action: {
                type: "postback",
                label: "選択",
                data: JSON.stringify({
                  action: "answer",
                  question: question.id,
                  option: questionOption.id,
                }),
              },
            }
          ],
        },
      },
    })),
  ]);

  return NextResponse.json({
    question: question.id,
  });
}
