import { cronscriptToken } from "@/lib/env/cronscript-token";
import { broadcast } from "@/lib/line/broadcast";
import { generateQuestion } from "@/lib/openai/generate-question";
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

  const questionData = await generateQuestion();

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

  await broadcast([
    {
      type: "flex",
      altText: "社会人マナークイズ",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://developers-resource.landpress.line.me/fx/img/01_1_cafe.png",
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
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: question.options.map((option) => ({
            type: "button",
            height: "sm",
            action: {
              type: "postback",
              label: option.optionText,
              data: JSON.stringify({
                action: "answer",
                question: question.id,
                option: option.id,
              }),
            },
          })),
        },
      },
    },
  ]);

  return NextResponse.json({
    question: question.id,
  });
}
