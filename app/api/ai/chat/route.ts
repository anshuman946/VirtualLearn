import { aiTutor } from "@/lib/ai-tutor"
import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, roomId, subject } = await request.json()

    const supabase = createServerClient()

    // Get recent messages for context
    const { data: recentMessages } = await supabase
      .from("chat_messages")
      .select("message, message_type")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(10)

    const context = {
      subject,
      roomId,
      recentMessages: recentMessages?.map((m) => `${m.message_type}: ${m.message}`) || [],
    }

    const response = await aiTutor.generateResponse(message, context)

    // Save AI response to database
    await supabase.from("chat_messages").insert({
      room_id: roomId,
      message: response,
      message_type: "ai",
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
