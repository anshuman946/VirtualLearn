import { type NextRequest, NextResponse } from "next/server"
import { StudyAgent } from "@/lib/langchain-agents"

export async function POST(request: NextRequest) {
  try {
    const { topic, participants, context } = await request.json()

    const agent = new StudyAgent()

    const session = await agent.collaborativeStudySession(participants, topic, {
      subject: context.subject,
      documents: [],
      userLevel: context.userLevel,
      learningGoals: context.learningGoals || [],
      previousQuestions: [],
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error("Collaborative session error:", error)
    return NextResponse.json({ error: "Failed to create collaborative session" }, { status: 500 })
  }
}
