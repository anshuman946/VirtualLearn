"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Brain,
  Timer,
  Settings,
  Share2,
  PenTool,
  Send,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"
import { useParams } from "next/navigation"

import { VideoCall } from "@/components/video-call"
import { VoiceAssistant } from "@/components/voice-assistant"
import { CollaborativeWhiteboard } from "@/components/collaborative-whiteboard"

export default function StudyRoom() {
  const params = useParams()
  const roomId = params.id as string

  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [message, setMessage] = useState("")
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false)
  const [aiMessage, setAiMessage] = useState("")

  const roomData = {
    name: "Calculus Study Group",
    subject: "Mathematics",
    members: [
      { id: 1, name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
      { id: 2, name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
      { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "away" },
      { id: 4, name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
    ],
  }

  const chatMessages = [
    { id: 1, user: "Jane Smith", message: "Hey everyone! Ready to tackle derivatives?", time: "2:30 PM", type: "user" },
    {
      id: 2,
      user: "AI Tutor",
      message: "Hello! I'm here to help with any calculus questions you might have. What would you like to start with?",
      time: "2:31 PM",
      type: "ai",
    },
    { id: 3, user: "Mike Johnson", message: "I'm struggling with the chain rule", time: "2:32 PM", type: "user" },
    {
      id: 4,
      user: "AI Tutor",
      message:
        "The chain rule is used when you have a composite function. If f(x) = g(h(x)), then f'(x) = g'(h(x)) × h'(x). Would you like me to show you an example?",
      time: "2:33 PM",
      type: "ai",
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPomodoroRunning, pomodoroTime])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Add message logic here
      setMessage("")
    }
  }

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault()
    if (aiMessage.trim()) {
      // Add AI interaction logic here
      setAiMessage("")
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{roomData.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{roomData.subject}</Badge>
                <span className="text-sm text-gray-600">Room ID: {roomId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          {/* Video Call Component */}
          <VideoCall roomId={roomId} userId="current-user-id" participants={roomData.members} />

          {/* Controls */}
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <PenTool className="h-4 w-4 mr-2" />
                  Whiteboard
                </Button>
              </div>

              {/* Pomodoro Timer */}
              <div className="flex items-center space-x-2">
                <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-orange-600" />
                  <span className="font-mono text-sm">{formatTime(pomodoroTime)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}>
                  {isPomodoroRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPomodoroTime(25 * 60)
                    setIsPomodoroRunning(false)
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Collaborative Notes Area */}
          {/* Collaborative Whiteboard */}
          <div className="flex-1 p-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5 text-green-600" />
                  <span>Collaborative Whiteboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <CollaborativeWhiteboard
                  roomId={roomId}
                  isEnabled={true}
                  onDrawingChange={(data) => console.log("Drawing:", data)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="ai">AI Tutor</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col px-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-3 ${msg.type === "ai" ? "bg-purple-50 p-3 rounded-lg" : ""}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.type === "ai" ? "bg-purple-600 text-white" : ""}>
                          {msg.type === "ai" ? (
                            <Brain className="h-4 w-4" />
                          ) : (
                            msg.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="members" className="flex-1 px-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Members ({roomData.members.length})</h3>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
                {roomData.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.status === "online" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-xs text-gray-500 capitalize">{member.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 flex flex-col px-4">
              <div className="mb-4">
                <div className="bg-purple-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">AI Tutor</span>
                      <Badge variant="secondary" className="text-xs">
                        Mathematics Mode
                      </Badge>
                    </div>
                    <VoiceAssistant
                      onTranscript={(text) => setAiMessage(text)}
                      onSpeakResponse={(text) => console.log("Speaking:", text)}
                      isEnabled={true}
                    />
                  </div>
                  <p className="text-sm text-purple-800">
                    I'm here to help with your calculus studies! Ask me anything about derivatives, integrals, or any
                    math concept.
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Explain the chain rule with examples
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Help me solve this derivative problem
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    What are the applications of calculus?
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <form onSubmit={handleAskAI} className="flex space-x-2">
                  <Input
                    placeholder="Ask the AI tutor anything..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
