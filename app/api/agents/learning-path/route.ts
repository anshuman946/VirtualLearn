import { type NextRequest, NextResponse } from "next/server"
import { StudyAgent } from "@/lib/langchain-agents"

export async function POST(request: NextRequest) {
  try {
    const { subject, currentKnowledge, targetGoals, timeframe } = await request.json()

    const agent = new StudyAgent()

    const learningPath = await agent.generateAdaptiveLearningPath(subject, currentKnowledge, targetGoals, timeframe)

    return NextResponse.json(learningPath)
  } catch (error) {
    console.error("Learning path generation error:", error)
    return NextResponse.json({ error: "Failed to generate learning path" }, { status: 500 })
  }
}
