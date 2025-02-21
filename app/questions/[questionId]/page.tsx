import { z } from "zod";
import { getQuestionCached } from "./_actions/get-question";
import { PageProps } from "@/lib/props";
import { QuestionSummary } from "./_components/question-summary";
import { QuestionOptionList } from "./_components/question-option-list";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const propsSchema = z.object({
  questionId: z.string().cuid2(),
});

export default async function Page(props: PageProps) {
  const parsedProps = propsSchema.parse(await props.params);

  const question = await getQuestionCached(parsedProps.questionId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        社会人マナークイズ
      </h1>

      <QuestionSummary question={question} />

      <QuestionOptionList questionOptions={question.options} questionAnswers={question.answers} />

      <p className="text-center text-gray-600">
        全回答者数: {question.answers.length}人
      </p>

      <Link href="/questions" className="flex justify-center items-center gap-2 text-gray-400">
        <ChevronLeft size={16} />
        一覧に戻る
      </Link>
    </div>
  );
}
