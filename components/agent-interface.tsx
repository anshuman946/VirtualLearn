"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Brain, Bot, Lightbulb, Target, Users, BookOpen, MessageSquare, Zap, Play, RotateCcw } from "lucide-react"

interface AgentMessage {
  id: string
  type: "user" | "agent" | "system"
  content: string
  reasoning?: string
  suggestedActions?: string[]
  confidence?: number
  sources?: string[]
  timestamp: Date
}

interface AgentInterfaceProps {
  subject: string
  userLevel: "beginner" | "intermediate" | "advanced"
  onAgentResponse?: (response: any) => void
}

export function AgentInterface({ subject, userLevel, onAgentResponse }: AgentInterfaceProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeAgent, setActiveAgent] = useState<"general" | "math" | "science">("general")
  const [agentMode, setAgentMode] = useState<"chat" | "problem-solving" | "collaborative">("chat")
  const [learningGoals, setLearningGoals] = useState<string[]>([])
  const [sessionProgress, setSessionProgress] = useState(0)

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: AgentMessage = {
      id: "welcome",
      type: "agent",
      content: `Hello! I'm your AI study agent for ${subject}. I can help you with complex problem-solving, generate study plans, create collaborative learning sessions, and provide detailed explanations. What would you like to explore today?`,
      suggestedActions: [
        "Ask a complex question",
        "Generate a study plan",
        "Start collaborative session",
        "Solve a problem step-by-step",
      ],
      confidence: 1.0,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [subject])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Call the agent API
      const response = await fetch("/api/agents/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          context: {
            subject,
            userLevel,
            agentMode,
            learningGoals,
            previousMessages: messages.slice(-5),
          },
        }),
      })

      const agentResponse = await response.json()

      const agentMessage: AgentMessage = {
        id: Date.now().toString() + "_agent",
        type: "agent",
        content: agentResponse.response,
        reasoning: agentResponse.reasoning,
        suggestedActions: agentResponse.suggestedActions,
        confidence: agentResponse.confidence,
        sources: agentResponse.sources,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setSessionProgress((prev) => Math.min(prev + 10, 100))
      onAgentResponse?.(agentResponse)
    } catch (error) {
      console.error("Agent processing error:", error)
      const errorMessage: AgentMessage = {
        id: Date.now().toString() + "_error",
        type: "system",
        content: "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  const startCollaborativeSession = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/agents/collaborative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: input || "Current topic",
          participants: ["Teacher", "Student", "Critic"],
          context: { subject, userLevel, learningGoals },
        }),
      })

      const session = await response.json()

      const sessionMessage: AgentMessage = {
        id: Date.now().toString() + "_collab",
        type: "agent",
        content: `Collaborative Learning Session Results:\n\n${session.synthesis}`,
        reasoning: "Multi-agent collaboration and synthesis",
        suggestedActions: session.actionItems,
        confidence: 0.95,
        sources: ["Multi-agent discussion"],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, sessionMessage])
    } catch (error) {
      console.error("Collaborative session error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateLearningPath = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/agents/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          currentKnowledge: [],
          targetGoals: learningGoals,
          timeframe: "4 weeks",
        }),
      })

      const path = await response.json()

      const pathMessage: AgentMessage = {
        id: Date.now().toString() + "_path",
        type: "agent",
        content: `Generated Adaptive Learning Path:\n\n${JSON.stringify(path, null, 2)}`,
        reasoning: "Adaptive learning path generation based on goals and current level",
        suggestedActions: ["Follow the weekly plan", "Track progress", "Adjust as needed"],
        confidence: 0.9,
        sources: ["Learning science and pedagogy"],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, pathMessage])
    } catch (error) {
      console.error("Learning path generation error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Study Agent</h2>
              <p className="text-sm text-gray-600">
                {subject} • {userLevel} level • {agentMode} mode
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              LangChain Powered
            </Badge>
            <Progress value={sessionProgress} className="w-20" />
          </div>
        </div>

        {/* Agent Mode Selector */}
        <Tabs value={agentMode} onValueChange={(value: any) => setAgentMode(value)} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="problem-solving" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Problem Solving</span>
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Collaborative</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : message.type === "agent"
                      ? "bg-white border-2 border-purple-200"
                      : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2 mb-2">
                    {message.type === "agent" && <Bot className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {/* Agent-specific information */}
                      {message.type === "agent" && (
                        <div className="mt-3 space-y-2">
                          {message.reasoning && (
                            <div className="bg-purple-50 p-2 rounded text-xs">
                              <strong>Reasoning:</strong> {message.reasoning}
                            </div>
                          )}

                          {message.confidence && (
                            <div className="flex items-center space-x-2 text-xs">
                              <span>Confidence:</span>
                              <Progress value={message.confidence * 100} className="w-16 h-2" />
                              <span>{Math.round(message.confidence * 100)}%</span>
                            </div>
                          )}

                          {message.sources && message.sources.length > 0 && (
                            <div className="text-xs text-gray-600">
                              <strong>Sources:</strong> {message.sources.join(", ")}
                            </div>
                          )}

                          {message.suggestedActions && message.suggestedActions.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">Suggested Actions:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.suggestedActions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={() => handleQuickAction(action)}
                                  >
                                    {action}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 text-right">{message.timestamp.toLocaleTimeString()}</p>
                </CardContent>
              </Card>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <Card className="bg-white border-2 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-purple-600 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                    <span className="text-sm text-gray-600">Agent is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={startCollaborativeSession}
            disabled={isProcessing}
            className="text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            Start Collaborative Session
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateLearningPath}
            disabled={isProcessing}
            className="text-xs"
          >
            <Target className="h-3 w-3 mr-1" />
            Generate Learning Path
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("Explain this concept in detail with examples")}
            className="text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Deep Explanation
          </Button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything or describe a complex problem..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button type="submit" disabled={isProcessing || !input.trim()}>
            {isProcessing ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
