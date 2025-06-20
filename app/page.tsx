import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  FileText,
  MessageSquare,
  Timer,
  BarChart3,
  Video,
  Zap,
  BookOpen,
  Lightbulb,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-purple-600 rounded-full opacity-20 scale-0 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
              VirtuLearn
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost" className="hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 hover:scale-105 border-0">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />🚀 AI-Powered Collaborative Learning
            </Badge>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Study Smarter,{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 animate-gradient-x">
                  Together
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 animate-scale-x animation-delay-1000"></div>
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join virtual study rooms, collaborate with peers, and get instant help from AI tutors. Transform your PDFs
              into interactive learning materials with summaries, quizzes, and flashcards.
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="group text-lg px-8 py-4 border-2 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
            >
              <Video className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-800 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 transition-transform duration-300 group-hover:scale-110">
                10K+
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 transition-transform duration-300 group-hover:scale-110">
                500+
              </div>
              <div className="text-sm text-gray-600">Study Rooms</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-1 transition-transform duration-300 group-hover:scale-110">
                50K+
              </div>
              <div className="text-sm text-gray-600">Documents Processed</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 transition-transform duration-300 group-hover:scale-110">
                98%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float animation-delay-1000">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float animation-delay-2000">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-25"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern collaborative learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Virtual Study Rooms",
                description:
                  "Join real-time video sessions with classmates. Share screens, chat, and collaborate seamlessly.",
                color: "purple",
                delay: "100",
              },
              {
                icon: Brain,
                title: "AI Tutor Assistant",
                description:
                  "Get instant help from AI tutors. Ask questions in natural language and receive personalized explanations.",
                color: "blue",
                delay: "200",
              },
              {
                icon: FileText,
                title: "Smart Document Processing",
                description: "Upload PDFs and get AI-generated summaries, flashcards, and quizzes automatically.",
                color: "green",
                delay: "300",
              },
              {
                icon: Users,
                title: "Collaborative Notes",
                description: "Take notes together in real-time with markdown support and shared whiteboards.",
                color: "orange",
                delay: "400",
              },
              {
                icon: Timer,
                title: "Pomodoro Sessions",
                description: "Synchronized study timers with AI-suggested break activities and productivity tracking.",
                color: "red",
                delay: "500",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track your progress, quiz scores, and get AI recommendations for improvement.",
                color: "indigo",
                delay: "600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group border-2 hover:border-${feature.color}-200 transition-all duration-500 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm animate-fade-in-up animation-delay-${feature.delay}`}
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto mb-4 w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <feature.icon
                      className={`h-8 w-8 text-${feature.color}-600 transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>
                  <CardTitle className="text-xl mb-3 transition-colors duration-300 group-hover:text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced AI Features</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Next-generation learning tools powered by artificial intelligence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="space-y-8">
                {[
                  {
                    icon: Lightbulb,
                    title: "Contextual Search",
                    description:
                      'Ask questions like "Explain slide 3" and get precise answers from your uploaded documents.',
                    color: "purple",
                  },
                  {
                    icon: MessageSquare,
                    title: "Voice Interaction",
                    description: "Speak to your AI tutor and receive voice responses for hands-free learning.",
                    color: "blue",
                  },
                  {
                    icon: BookOpen,
                    title: "Subject-Specific AI",
                    description:
                      "AI tutors adapt their teaching style based on the subject - fun for History, formal for Math.",
                    color: "green",
                  },
                  {
                    icon: Zap,
                    title: "Real-time Analytics",
                    description: "Live topic heatmaps and contribution tracking to optimize group study sessions.",
                    color: "orange",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-4 group animate-fade-in-up animation-delay-${(index + 1) * 200}`}
                  >
                    <div
                      className={`bg-${feature.color}-100 p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                    >
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-right">
              <div className="relative">
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-2xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain className="h-6 w-6" />
                        <h4 className="text-lg font-semibold">AI Tutor</h4>
                        <Badge className="bg-white/20 text-white border-0">Online</Badge>
                      </div>
                      <p className="text-sm opacity-90">How can I help you study today?</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl transition-all duration-300 hover:bg-gray-100">
                      <p className="text-sm text-gray-600">
                        Student: "Can you explain photosynthesis in simple terms?"
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl transition-all duration-300 hover:from-purple-100 hover:to-blue-100">
                      <p className="text-sm text-purple-800">
                        AI: "Think of plants as tiny solar panels! They capture sunlight and use it to make food from
                        water and air..."
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                      <span>AI is typing...</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -left-4 animate-float">
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Smart
                  </Badge>
                </div>
                <div className="absolute -bottom-4 -right-4 animate-float animation-delay-1000">
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 shadow-lg">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accurate
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students already using VirtuLearn to achieve better results
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="group bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 group">
              <Brain className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-lg font-semibold">VirtuLearn</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Support
              </a>
            </div>
            <p className="text-gray-400 text-sm">© 2024 VirtuLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
