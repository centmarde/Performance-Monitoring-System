import { ref } from "vue";
import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_DEEPSEEK_AI;

if (!apiKey) {
  throw new Error(
    "API key is missing or empty. Please provide a valid API key."
  );
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function formatResponse(content: string): string {
  return content.replace(/\n/g, "<br>");
}

export function useGroqChat() {
  const chatContent = ref("");

  async function startChat(studentRecord: any, studentName: string) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "Hello there, teacher. It's great to see you. I trust you're having a wonderful day so far. Is there something specific you'd like to discuss or learn about today, or would you like me to suggest some topics we could explore together?",
        },
        {
          role: "user",
          content:
            "Pretend that you are talking to a teacher.Given the following student record.provide advice for the teacher to help the student improve their performance. dont provide a list in your responsne also shorten it in 500 words.",
        },
        {
          role: "system",
          content: ` 
          WW = written works, PT = personal task, and QA = quality assessment.
          Also, remember the name of the student: ${studentName}. ${JSON.stringify(
            studentRecord
          )}`,
        },
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_completion_tokens: 600,
      top_p: 0.95,
      stream: true,
      stop: null,
    });

    // Collect and format the response
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      chatContent.value += formatResponse(content);
    }
  }

  return {
    chatContent,
    startChat,
  };
}
