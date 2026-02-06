import { redirect } from "next/navigation";

export default function QuizPage() {
  // Redirect to first step
  redirect("/quiz/1");
}
