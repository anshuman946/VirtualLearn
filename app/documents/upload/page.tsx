"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Brain, BookOpen, HelpCircle, ArrowLeft, CheckCircle, Loader2, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { blobStorage } from "@/lib/blob-storage"
import { supabase } from "@/lib/supabase"

export default function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [subject, setSubject] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processedResults, setProcessedResults] = useState<any>(null)
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) => file.type === "application/pdf")
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const processDocuments = async () => {
    if (files.length === 0 || !subject) return

    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Upload files to Vercel Blob
      setProcessingProgress(20)
      const uploadedUrls = await blobStorage.uploadMultipleFiles(files, "documents")

      // Create document records in database
      setProcessingProgress(40)
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      const documentPromises = files.map(async (file, index) => {
        const { data, error } = await supabase
          .from("documents")
          .insert({
            name: file.name,
            file_url: uploadedUrls[index],
            subject: subject,
            user_id: user.user.id,
            processing_status: "pending",
          })
          .select()
          .single()

        if (error) throw error
        return data
      })

      const documents = await Promise.all(documentPromises)

      // Process documents with AI
      setProcessingProgress(60)
      const processingPromises = documents.map((doc) =>
        fetch("/api/documents/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: doc.id,
            fileUrl: doc.file_url,
            subject: subject,
          }),
        }),
      )

      await Promise.all(processingPromises)
      setProcessingProgress(100)

      // Set mock results for demo
      setProcessedResults({
        summaries: files.length * 2,
        flashcards: files.length * 15,
        quizzes: files.length * 3,
        keyTopics: ["Derivatives", "Chain Rule", "Integration", "Limits", "Continuity"],
      })
    } catch (error) {
      console.error("Processing error:", error)
      // Handle error
    } finally {
      setIsProcessing(false)
    }
  }

  if (processedResults) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Complete!</h1>
              <p className="text-gray-600">Your documents have been successfully processed by AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{processedResults.summaries}</h3>
                  <p className="text-sm text-gray-600">Summaries Generated</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{processedResults.flashcards}</h3>
                  <p className="text-sm text-gray-600">Flashcards Created</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{processedResults.quizzes}</h3>
                  <p className="text-sm text-gray-600">Quizzes Generated</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{processedResults.keyTopics.length}</h3>
                  <p className="text-sm text-gray-600">Key Topics Identified</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Key Topics Identified</CardTitle>
                  <CardDescription>AI has identified these main topics in your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {processedResults.keyTopics.map((topic: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>What would you like to do with your processed content?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Review Flashcards
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Take a Quiz
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Read Summaries
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Content
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button onClick={() => router.push("/dashboard")} className="bg-purple-600 hover:bg-purple-700">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
            <p className="text-gray-600">Upload your PDFs and let AI create summaries, flashcards, and quizzes</p>
          </div>

          {!isProcessing ? (
            <div className="space-y-8">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-purple-600" />
                    <span>Upload PDF Files</span>
                  </CardTitle>
                  <CardDescription>Drag and drop your PDF files or click to browse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop your PDF files here</p>
                    <p className="text-gray-600 mb-4">or</p>
                    <Label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Browse Files
                      </Button>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-4">Only PDF files are supported. Max 10MB per file.</p>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium text-gray-900">Selected Files ({files.length})</h4>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subject Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Category</CardTitle>
                  <CardDescription>Help AI understand the context of your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Select Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subject category" />
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
                </CardContent>
              </Card>

              {/* AI Features Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>AI Will Generate</span>
                  </CardTitle>
                  <CardDescription>Here's what our AI will create from your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">Smart Summaries</h4>
                      <p className="text-sm text-gray-600">Key points and main concepts</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Flashcards</h4>
                      <p className="text-sm text-gray-600">Q&A pairs for memorization</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium">Practice Quizzes</h4>
                      <p className="text-sm text-gray-600">Multiple choice questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process Button */}
              <div className="text-center">
                <Button
                  onClick={processDocuments}
                  disabled={files.length === 0 || !subject}
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Process with AI
                </Button>
              </div>
            </div>
          ) : (
            /* Processing State */
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Documents</h3>
                  <p className="text-gray-600">Our AI is analyzing your PDFs and creating learning materials...</p>
                </div>

                <div className="space-y-4">
                  <Progress value={processingProgress} className="w-full" />
                  <p className="text-sm text-gray-600">{processingProgress}% Complete</p>
                </div>

                <div className="mt-8 text-left">
                  <h4 className="font-medium mb-3">Processing Steps:</h4>
                  <div className="space-y-2 text-sm">
                    <div
                      className={`flex items-center space-x-2 ${processingProgress >= 20 ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Extracting text from PDFs</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${processingProgress >= 40 ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Analyzing content structure</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${processingProgress >= 60 ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Generating summaries</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${processingProgress >= 80 ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Creating flashcards</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${processingProgress >= 90 ? "text-green-600" : "text-gray-400"}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Generating quizzes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
