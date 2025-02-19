import { Question, QuestionOption } from "@prisma/client";
import OpenAI from "openai";

export async function generateQuestionImage(question: Question & {
  options: QuestionOption[];
}): Promise<string | undefined> {
  const openai = new OpenAI();

  const completion = await openai.images.generate({
    model: "dall-e-2",
    prompt: [
      "社会人のマナーに関するクイズを作成しましたので、アイキャッチとなる画像を作成してください",
      "",
      "# ルール",
      "- クイズの内容と選択肢をイメージできる画像にしてください",
      "- できるだけシンプルな画像にしてください",
      "",
      "# 問題文",
      question.question,
      "",
      "# 選択肢",
      ...question.options.map((option) => {
        return `- ${option.optionText}`;
      }),
    ].join("\n"),
    size: "512x512",
    quality: "standard",
    n: 1,
    response_format: "url",
  });

  for (const { url } of completion.data) {
    if (url) {
      return url;
    }
  }
}
