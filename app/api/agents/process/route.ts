import { type NextRequest, NextResponse } from "next/server"
import { AgentFactory } from "@/lib/langchain-agents"

export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json()

    // Create appropriate agent based on subject
    const agent = AgentFactory.createAgent(context.subject)

    // Load any available documents (in a real app, fetch from database)
    // await agent.loadDocuments(documents)

    // Process the query with context
    const response = await agent.processQuery(query, {
      subject: context.subject,
      documents: [], // Would be populated from database
      userLevel: context.userLevel,
      learningGoals: context.learningGoals || [],
      previousQuestions: context.previousMessages?.map((m: any) => m.content) || [],
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Agent processing error:", error)
    return NextResponse.json({ error: "Failed to process agent request" }, { status: 500 })
  }
}
