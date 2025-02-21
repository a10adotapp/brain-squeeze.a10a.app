import { listQuestionCached } from "./_actions/list-question";
import { QuestionList } from "./_components/question-list";

export default async function Page() {
  const questions = await listQuestionCached();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        社会人マナークイズ
      </h1>

      <QuestionList questions={questions} />
    </div>
  );
}
