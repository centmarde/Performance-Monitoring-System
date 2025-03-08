import { ref } from "vue";
import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_DEEPSEEK_AI;

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
  
  

export function usePerformanceAnalytics() {
  const subjectAnalysis = ref("");
  const sectionAnalysis = ref("");

  async function analyzeSubjectPerformance(subjectData: { 
    passingCount: number, 
    failingCount: number, 
    averageGrade: number 
  }, subjectName: string) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an educational analytics expert. Provide concise suggestions for improving subject performance."
        },
        {
          role: "user",
          content: `Analyze this subject performance data for ${subjectName}:
            Passing students: ${subjectData.passingCount}
            Failing students: ${subjectData.failingCount}
            Class average: ${subjectData.averageGrade}
            
            Provide specific teaching strategies and interventions in 200 words.`
        }
      ],
      model: "gemma2-9b-it",
      temperature: 0.7,
      max_tokens: 300,
      stream: true
    });

    subjectAnalysis.value = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      subjectAnalysis.value += formatResponse(content);
    }
  }

  async function analyzeSectionDistribution(sectionData: {
    excellentCount: number,
    goodCount: number,
    averageCount: number,
    failingCount: number
  }, sectionName: string) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an educational analytics expert. Provide concise suggestions for improving section performance."
        },
        {
          role: "user",
          content: `Analyze this section performance distribution for ${sectionName}:
            Excellent (90-100): ${sectionData.excellentCount}
            Good (80-89): ${sectionData.goodCount}
            Average (75-79): ${sectionData.averageCount}
            Failing (<75): ${sectionData.failingCount}
            
            Provide specific class management strategies and differentiated learning approaches in 200 words.`
        }
      ],
      model: "gemma2-9b-it",
      temperature: 0.7,
      max_tokens: 300,
      stream: true
    });

    sectionAnalysis.value = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      sectionAnalysis.value += formatResponse(content);
    }
  }

  return {
    subjectAnalysis,
    sectionAnalysis,
    analyzeSubjectPerformance,
    analyzeSectionDistribution
  };
}
