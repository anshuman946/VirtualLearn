import { aiTutor } from "@/lib/ai-tutor"
import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { documentId, fileUrl, subject } = await request.json()

    const supabase = createServerClient()

    // Update status to processing
    await supabase.from("documents").update({ processing_status: "processing" }).eq("id", documentId)

    // Fetch file content (in a real app, you'd extract text from PDF)
    // For demo purposes, we'll simulate this
    const mockContent = `This is a ${subject} document with educational content about various topics.`

    // Process with AI
    const results = await aiTutor.processDocument(mockContent, subject)

    if (results) {
      // Update document with results
      await supabase
        .from("documents")
        .update({
          processing_status: "completed",
          ai_results: {
            summaries: 2,
            flashcards: results.flashcards?.length || 12,
            quizzes: results.quizQuestions?.length || 5,
            key_topics: results.keyTopics || [],
          },
        })
        .eq("id", documentId)

      return NextResponse.json({ success: true, results })
    } else {
      await supabase.from("documents").update({ processing_status: "failed" }).eq("id", documentId)

      return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
