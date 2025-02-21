import { appUrl } from "@/lib/env/app-url";
import { reply } from "@/lib/line/reply";
import { prisma } from "@/lib/prisma";
import { format as formatDate } from "@formkit/tempo";

export async function answer(lineUserId: string, data: {
  questionId: string;
  questionOptionId: string;
  replyToken: string;
}): Promise<void> {
  const question = await prisma.question.findFirstOrThrow({
    include: {
      options: {
        where: {
          deletedAt: null,
        },
      },
    },
    where: {
      deletedAt: null,
      id: data.questionId,
    },
  });

  let questionOption = question.options.find((questionOption) => {
    return questionOption.id === data.questionOptionId;
  });

  if (!questionOption) {
    throw new Error(`question option not found (${JSON.stringify(data)})`);
  }

  let questionAnswer = await prisma.questionAnswer.findFirst({
    include: {
      questionOption: true,
    },
    where: {
      questionId: question.id,
      lineUserId: lineUserId,
    },
  });

  if (questionAnswer) {
    questionOption = questionAnswer.questionOption;
  } else {
    const createdQuestionAnswer = await prisma.questionAnswer.create({
      data: {
        questionId: question.id,
        questionOptionId: questionOption.id,
        lineUserId: lineUserId,
      },
    });

    questionAnswer = await prisma.questionAnswer.findFirstOrThrow({
      include: {
        questionOption: true,
      },
      where: {
        deletedAt: null,
        id: createdQuestionAnswer.id,
      },
    });
  }

  let previousQuestionAnswerCount = 0;

  if (questionOption.isCorrect) {
    previousQuestionAnswerCount = await prisma.questionAnswer.count({
      where: {
        deletedAt: null,
        questionId: question.id,
        createdAt: {
          lte: questionAnswer.createdAt,
        },
        id: {
          not: questionAnswer.id,
        },
      },
    });
  }

  await reply(data.replyToken, [
    {
      type: "flex",
      altText: question.question,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "あなたの回答",
              size: "sm",
              color: "#999999",
            },
            {
              type: "text",
              text: questionOption.optionText,
              size: "lg",
              weight: "bold",
              wrap: true,
            },
            ...(questionOption.isCorrect ? [
              {
                type: "text",
                text: "正解",
                size: "xl",
                align: "center",
                weight: "bold",
                color: "#33cc33",
              },
              {
                type: "text",
                text: `${previousQuestionAnswerCount + 1} 位`,
                size: "md",
                align: "center",
                weight: "bold",
                color: "#33cc33",
              },
            ] : [
              {
                type: "text",
                text: "不正解",
                size: "xl",
                align: "center",
                weight: "bold",
                color: "#cc3333",
              },
            ]),
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "回答日時",
                      size: "sm",
                      color: "#999999",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: formatDate({
                        date: questionAnswer.createdAt,
                        format: "YYYY/MM/DD HH:mm",
                        tz: "Asia/Tokyo",
                      }),
                      size: "sm",
                      color: "#666666",
                      flex: 2,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "uri",
                label: "解説を見る",
                uri: [
                  appUrl(),
                  `/questions/${question.id}`,
                ].join(""),
              }
            }
          ],
        },
      },
    },
  ]);
}
