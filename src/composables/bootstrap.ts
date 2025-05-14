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
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>") // ***bold & italic***
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")              // **bold**
    .replace(/\*(.*?)\*/g, "<em>$1</em>");                        // *italic*
}

export function useGroqChat() {
  const chatContent = ref("");

  async function startChat(studentRecord: any, studentName: string, topicNames: string[] = []) {
    // Filter out any empty topic names
    const validTopicNames = topicNames.filter(topic => topic && topic.trim() !== "");
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "Analyze this student's performance data to identify which specific topics they are struggling with. Focus on the lowest scores and suggest targeted strategies to help improve in those specific areas. Use the actual topic names in your feedback, not just topic numbers. Keep your response under 500 words."
        },
        {
          role: "system",
          content: ` 
          The actual topic names for topic1 through topic5 are: ${JSON.stringify(validTopicNames)}.
          WW = written works (these are the named topics), PT = personal task (pt1 through pt10), and QA = quality assessment (qa1).
          Scores below 75 are considered failing, 75-80 are borderline, and above 80 are good.
          Identify which specific named topics have the lowest scores and suggest concrete improvement strategies tailored to those topics.
          Always refer to topics by their actual names (not as topic1, topic2, etc.) when providing advice.
          Remember the name of the student: ${studentName}. ${JSON.stringify(
            studentRecord
          )}`,
        },
      ],
      model: "gemma2-9b-it",
      temperature: 0.6,
      max_completion_tokens: 600,
      top_p: 0.95,
      stream: true,
      stop: null,
    });

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
