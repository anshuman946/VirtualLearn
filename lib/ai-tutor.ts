import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface TutorContext {
  subject: string
  roomId: string
  recentMessages: string[]
  documentContext?: string
}

export class AITutor {
  private model = openai("gpt-4o")

  async generateResponse(message: string, context: TutorContext): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context)

    const { text } = await generateText({
      model: this.model,
      system: systemPrompt,
      prompt: message,
    })

    return text
  }

  async streamResponse(message: string, context: TutorContext) {
    const systemPrompt = this.buildSystemPrompt(context)

    return streamText({
      model: this.model,
      system: systemPrompt,
      prompt: message,
    })
  }

  private buildSystemPrompt(context: TutorContext): string {
    const subjectPersonality = this.getSubjectPersonality(context.subject)

    return `You are an AI tutor specializing in ${context.subject}. ${subjectPersonality}

Context:
- You are helping students in a collaborative study room
- Recent conversation: ${context.recentMessages.join("\n")}
${context.documentContext ? `- Document context: ${context.documentContext}` : ""}

Guidelines:
- Be encouraging and supportive
- Explain concepts clearly with examples
- Ask follow-up questions to ensure understanding
- Suggest practice problems when appropriate
- Keep responses concise but thorough
- Use analogies and real-world examples
- If students seem stuck, break down problems into smaller steps

Remember: You're not just answering questions, you're facilitating learning and understanding.`
  }

  private getSubjectPersonality(subject: string): string {
    const personalities: Record<string, string> = {
      mathematics:
        "You have a logical, step-by-step approach. You love breaking down complex problems into manageable parts and showing multiple solution methods.",
      physics:
        "You're enthusiastic about real-world applications and love connecting abstract concepts to everyday phenomena.",
      chemistry:
        "You're detail-oriented and safety-conscious, always explaining the 'why' behind chemical reactions and processes.",
      biology: "You're fascinated by life processes and enjoy using analogies to explain complex biological systems.",
      history:
        "You're a storyteller who brings historical events to life and helps students understand cause-and-effect relationships.",
      literature:
        "You're thoughtful and analytical, helping students explore themes, symbolism, and the human condition in texts.",
      "computer science":
        "You're practical and project-oriented, focusing on problem-solving and real-world applications of programming concepts.",
      psychology:
        "You're empathetic and curious about human behavior, using case studies and examples to illustrate psychological principles.",
    }

    return (
      personalities[subject.toLowerCase()] ||
      "You adapt your teaching style to the subject matter, always focusing on clarity and student engagement."
    )
  }

  async processDocument(fileContent: string, subject: string) {
    const { text } = await generateText({
      model: this.model,
      system: `You are an AI that processes educational documents for ${subject}. Extract key information and create learning materials.`,
      prompt: `Analyze this document and provide:
1. A comprehensive summary (2-3 paragraphs)
2. 10-15 key concepts/terms with definitions
3. 5-8 potential quiz questions with answers
4. 8-12 flashcard pairs (question/answer)

Document content:
${fileContent}

Format your response as JSON with the structure:
{
  "summary": "...",
  "keyTopics": ["topic1", "topic2", ...],
  "quizQuestions": [{"question": "...", "options": ["a", "b", "c", "d"], "correct": 0, "explanation": "..."}],
  "flashcards": [{"front": "...", "back": "..."}]
}`,
    })

    try {
      return JSON.parse(text)
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      return null
    }
  }
}

export const aiTutor = new AITutor()
