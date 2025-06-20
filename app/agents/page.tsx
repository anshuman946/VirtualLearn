"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentInterface } from "@/components/agent-interface"
import { Brain, Bot, Users, Target, Lightbulb, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AgentsPage() {
  const [selectedSubject, setSelectedSubject] = useState("mathematics")
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [showInterface, setShowInterface] = useState(false)

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Literature",
    "Psychology",
  ]

  const agentFeatures = [
    {
      icon: Brain,
      title: "Advanced Reasoning",
      description: "Multi-step problem solving with detailed explanations and reasoning chains",
      color: "purple",
    },
    {
      icon: Bot,
      title: "Specialized Agents",
      description: "Subject-specific agents with domain expertise and tailored approaches",
      color: "blue",
    },
    {
      icon: Users,
      title: "Multi-Agent Collaboration",
      description: "Teacher, student, and critic agents working together for comprehensive learning",
      color: "green",
    },
    {
      icon: Target,
      title: "Adaptive Learning Paths",
      description: "Personalized study plans that adapt to your progress and learning style",
      color: "orange",
    },
    {
      icon: Lightbulb,
      title: "Complex Problem Solving",
      description: "Break down complex problems into manageable steps with guided solutions",
      color: "yellow",
    },
    {
      icon: TrendingUp,
      title: "Progress Analysis",
      description: "Intelligent analysis of learning patterns with actionable recommendations",
      color: "indigo",
    },
  ]

  if (showInterface) {
    return (
      <div className="h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowInterface(false)} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Setup</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">AI Study Agents</span>
            </div>
          </div>
        </header>
        <AgentInterface
          subject={selectedSubject}
          userLevel={userLevel}
          onAgentResponse={(response) => console.log("Agent response:", response)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">AI Study Agents</span>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">LangChain Powered</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Advanced AI Study Agents</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience next-generation AI tutoring with LangChain-powered agents that can reason, collaborate, and adapt
            to your learning needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="text-sm">
              🧠 Multi-Agent Reasoning
            </Badge>
            <Badge variant="outline" className="text-sm">
              🔗 LangChain Integration
            </Badge>
            <Badge variant="outline" className="text-sm">
              🎯 Adaptive Learning
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agentFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div
                  className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Configuration Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Configure Your AI Agent</CardTitle>
            <CardDescription>
              Set up your personalized AI study agent with subject expertise and learning level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject.toLowerCase()}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Learning Level</label>
              <Select value={userLevel} onValueChange={(value: any) => setUserLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Your Agent Will Include:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Subject-specific expertise in {selectedSubject}</li>
                <li>• {userLevel} level explanations and examples</li>
                <li>• Multi-step reasoning and problem solving</li>
                <li>• Collaborative learning sessions</li>
                <li>• Adaptive learning path generation</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowInterface(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
            >
              <Brain className="mr-2 h-5 w-5" />
              Launch AI Agent
            </Button>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Powered by Advanced AI Technology</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">LangChain Framework</h4>
              <p className="text-sm text-gray-600">
                Advanced agent orchestration with tool usage, memory, and reasoning chains
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">GPT-4 Integration</h4>
              <p className="text-sm text-gray-600">
                Latest OpenAI models for superior reasoning and natural language understanding
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Vector Search</h4>
              <p className="text-sm text-gray-600">
                RAG implementation for contextual responses based on your documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
