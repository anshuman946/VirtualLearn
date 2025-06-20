"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Brain,
  Plus,
  Users,
  Clock,
  BookOpen,
  BarChart3,
  Search,
  Video,
  FileText,
  Settings,
  Bell,
  Calendar,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const recentRooms = [
    {
      id: 1,
      name: "Calculus Study Group",
      members: 4,
      subject: "Mathematics",
      lastActive: "2 hours ago",
      status: "active",
    },
    { id: 2, name: "Biology Exam Prep", members: 6, subject: "Biology", lastActive: "1 day ago", status: "inactive" },
    { id: 3, name: "History Discussion", members: 3, subject: "History", lastActive: "3 hours ago", status: "active" },
  ]

  const recentDocuments = [
    {
      id: 1,
      name: "Linear Algebra Notes.pdf",
      subject: "Mathematics",
      uploadedAt: "Yesterday",
      quizzes: 3,
      flashcards: 12,
    },
    {
      id: 2,
      name: "Cell Biology Lecture.pdf",
      subject: "Biology",
      uploadedAt: "2 days ago",
      quizzes: 5,
      flashcards: 24,
    },
    {
      id: 3,
      name: "World War II Timeline.pdf",
      subject: "History",
      uploadedAt: "1 week ago",
      quizzes: 2,
      flashcards: 8,
    },
  ]

  const studyStats = {
    totalHours: 24.5,
    roomsJoined: 12,
    documentsProcessed: 8,
    quizzesTaken: 15,
    averageScore: 87,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">VirtuLearn</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms, documents, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/room/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Create Room</h3>
                <p className="text-sm text-gray-600">Start a new study session</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/room/join">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Join Room</h3>
                <p className="text-sm text-gray-600">Enter with invite code</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/documents/upload">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-green-200">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Upload PDF</h3>
                <p className="text-sm text-gray-600">Process with AI</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ai-tutor">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Tutor</h3>
                <p className="text-sm text-gray-600">Get instant help</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Study Rooms */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-purple-600" />
                    <span>Recent Study Rooms</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{room.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{room.members} members</span>
                            </span>
                            <Badge variant="secondary">{room.subject}</Badge>
                            <span>{room.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={room.status === "active" ? "default" : "secondary"}>{room.status}</Badge>
                        <Button size="sm">Join</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Recent Documents</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Badge variant="secondary">{doc.subject}</Badge>
                            <span>Uploaded {doc.uploadedAt}</span>
                            <span>
                              {doc.quizzes} quizzes • {doc.flashcards} flashcards
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Study Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Study Hours</span>
                  <span className="font-semibold">{studyStats.totalHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rooms Joined</span>
                  <span className="font-semibold">{studyStats.roomsJoined}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents Processed</span>
                  <span className="font-semibold">{studyStats.documentsProcessed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quizzes Taken</span>
                  <span className="font-semibold">{studyStats.quizzesTaken}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{studyStats.averageScore}%</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>Upcoming Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Physics Study Group</p>
                      <p className="text-xs text-gray-600">Today at 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Chemistry Lab Review</p>
                      <p className="text-xs text-gray-600">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Review Calculus</p>
                    <p className="text-xs text-purple-700">You haven't practiced derivatives in 3 days</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Join Biology Group</p>
                    <p className="text-xs text-green-700">Active discussion on cell division</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
