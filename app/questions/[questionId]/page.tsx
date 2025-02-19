import { z } from "zod";
import { getQuestionCached } from "./_actions/get-question";
import { PageProps } from "@/lib/props";
import { Progress } from "@/components/ui/progress";

const propsSchema = z.object({
  questionId: z.string().cuid2(),
});

export default async function Page(props: PageProps) {
  const parsedProps = propsSchema.parse(await props.params);

  const question = await getQuestionCached(parsedProps.questionId);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">社会人マナークイズ結果</h1>

      <div className="mb-6">
        <p className="text-xl font-semibold text-gray-700 mb-4">{question.question}</p>
      </div>

      <div className="space-y-6 mb-6">
        {question.options.map((questionOption, index) => {
          const answerCount = question.answers.filter((questionAnswer) => {
            return questionAnswer.questionOptionId === questionOption.id;
          }).length;

          const responsePercentage = answerCount / question.answers.length * 100

          return (
            <div
              key={index}
              className={`p-4 rounded-lg ${questionOption.isCorrect ? "bg-blue-100 border-blue-500" : "bg-gray-100"} border-2`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-semibold ${questionOption.isCorrect ? "text-blue-700" : "text-gray-700"}`}
                >
                  {questionOption.optionText}
                  {questionOption.isCorrect && " (正解)"}
                </span>
                <span className="text-sm text-gray-600">
                  {answerCount}人 ({responsePercentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={responsePercentage} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">{questionOption.description}</p>
            </div>
          )
        })}
      </div>

      <p className="text-center text-gray-600 mb-6">全回答者数: {question.answers.length}人</p>
    </div>
  );
}
