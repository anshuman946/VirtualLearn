"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Brain, Video, MessageSquare, Timer, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [maxMembers, setMaxMembers] = useState("10")
  const [isPrivate, setIsPrivate] = useState(false)
  const [aiTutorEnabled, setAiTutorEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [whiteboardEnabled, setWhiteboardEnabled] = useState(true)
  const [pomodoroEnabled, setPomodoroEnabled] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Literature",
    "Psychology",
    "Economics",
    "Philosophy",
    "Other",
  ]

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Simulate room creation
    setTimeout(() => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
      router.push(`/room/${roomId}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Study Room</h1>
            <p className="text-gray-600">Set up a collaborative learning space for you and your peers</p>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>Configure the basic settings for your study room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name *</Label>
                  <Input
                    id="room-name"
                    placeholder="e.g., Calculus Study Group"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you'll be studying in this room..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subj) => (
                          <SelectItem key={subj} value={subj.toLowerCase()}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-members">Max Members</Label>
                    <Select value={maxMembers} onValueChange={setMaxMembers}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="15">15 members</SelectItem>
                        <SelectItem value="20">20 members</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="private-room">Private Room</Label>
                    <p className="text-sm text-gray-600">Only people with invite link can join</p>
                  </div>
                  <Switch id="private-room" checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Room Features</CardTitle>
                <CardDescription>Enable or disable specific features for your study room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <Label htmlFor="ai-tutor">AI Tutor</Label>
                        <p className="text-sm text-gray-600">Get instant help from AI</p>
                      </div>
                    </div>
                    <Switch id="ai-tutor" checked={aiTutorEnabled} onCheckedChange={setAiTutorEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Label htmlFor="video-chat">Video Chat</Label>
                        <p className="text-sm text-gray-600">Face-to-face communication</p>
                      </div>
                    </div>
                    <Switch id="video-chat" checked={videoEnabled} onCheckedChange={setVideoEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <Label htmlFor="whiteboard">Whiteboard</Label>
                        <p className="text-sm text-gray-600">Collaborative drawing space</p>
                      </div>
                    </div>
                    <Switch id="whiteboard" checked={whiteboardEnabled} onCheckedChange={setWhiteboardEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Timer className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <Label htmlFor="pomodoro">Pomodoro Timer</Label>
                        <p className="text-sm text-gray-600">Synchronized study sessions</p>
                      </div>
                    </div>
                    <Switch id="pomodoro" checked={pomodoroEnabled} onCheckedChange={setPomodoroEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Room Preview</CardTitle>
                <CardDescription>Here's how your room will appear to others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{roomName || "Room Name"}</h3>
                      <p className="text-gray-600 text-sm">{description || "Room description will appear here..."}</p>
                    </div>
                    <Badge variant={isPrivate ? "secondary" : "default"}>{isPrivate ? "Private" : "Public"}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Max {maxMembers} members</span>
                    </span>
                    {subject && <Badge variant="outline">{subject}</Badge>}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    {aiTutorEnabled && (
                      <Badge variant="outline" className="text-xs">
                        AI Tutor
                      </Badge>
                    )}
                    {videoEnabled && (
                      <Badge variant="outline" className="text-xs">
                        Video
                      </Badge>
                    )}
                    {whiteboardEnabled && (
                      <Badge variant="outline" className="text-xs">
                        Whiteboard
                      </Badge>
                    )}
                    {pomodoroEnabled && (
                      <Badge variant="outline" className="text-xs">
                        Pomodoro
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={!roomName || isCreating}>
                {isCreating ? "Creating Room..." : "Create Room"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
