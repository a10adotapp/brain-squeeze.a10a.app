import OpenAI from "openai";
import { z } from "zod";

const resultSchema = z.object({
  question: z.string(),
  questionOptions: z.array(
    z.object({
      optionText: z.string(),
      description: z.string(),
      isCorrect: z.boolean(),
    }),
  ),
});

export async function generateQuestionData(): Promise<z.output<typeof resultSchema>> {
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-11-20",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "result",
        description: "",
        schema: {
          type: "object",
          properties: {
            question: {
              type: "string",
              description: [
                "社会人のマナーに関するクイズの問題文を作成してください",
                "",
                "# ルール",
                "- １つの問題に対して４つの選択肢があります",
                "- １つの選択肢が正解となります",
                "- 問題の難易度に関わらず、文章は読みやすく、中学生でも理解できる必要があります",
                "",
                "# 例",
                "- お辞儀をする際の角度は何度が適切とされているでしょうか",
              ].join("\n"),
            },
            questionOptions: {
              type: "array",
              description: [
                "社会人のマナーに関するクイズの選択肢を作成してください",
                "",
                "# ルール",
                "- ４つの選択肢を作成する必要があります",
                "- 正解の選択肢は１つのみである必要があります",
                "- 問題の難易度に関わらず、文章は読みやすく、中学生でも理解できる必要があります",
              ].join("\n"),
              items: {
                type: "object",
                properties: {
                  optionText: {
                    type: "string",
                    description: [
                      "選択肢の文章を作成してください",
                    ].join("\n"),
                  },
                  description: {
                    type: "string",
                    description: [
                      "この選択肢が正解、または不正解である理由について説明してください",
                    ].join("\n"),
                  },
                  isCorrect: {
                    type: "boolean",
                    description: [
                      "この選択肢が正解である場合にtrue、不正解である場合はfalseを設定してください",
                    ].join("\n"),
                  },
                },
              },
            }
          },
        },
      },
    },
    messages: [
      {
        role: "user",
        content: "社会人のマナーに関するクイズを作成してください",
      },
    ],
  });

  for (const choice of completion.choices) {
    if (choice.finish_reason === "stop") {
      if (choice.message.content) {
        return resultSchema.parse(JSON.parse(choice.message.content));
      }
    }
  }

  throw new Error("Failed to generate question");
}
