import { ChatOpenAI } from "@langchain/openai"
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents"
import { pull } from "langchain/hub"
import { DynamicTool } from "@langchain/core/tools"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from "@langchain/core/documents"

// Study Agent Types
export interface StudyContext {
  subject: string
  documents: string[]
  userLevel: "beginner" | "intermediate" | "advanced"
  learningGoals: string[]
  previousQuestions: string[]
}

export interface AgentResponse {
  response: string
  reasoning: string
  suggestedActions: string[]
  confidence: number
  sources?: string[]
}

// Advanced Study Agent with LangChain
export class StudyAgent {
  private llm: ChatOpenAI
  private embeddings: OpenAIEmbeddings
  private vectorStore: MemoryVectorStore | null = null
  private agentExecutor: AgentExecutor | null = null

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    this.initializeAgent()
  }

  private async initializeAgent() {
    // Create tools for the agent
    const tools = [
      new DynamicTool({
        name: "document_search",
        description: "Search through uploaded documents for relevant information",
        func: async (query: string) => {
          if (!this.vectorStore) return "No documents available for search"

          const results = await this.vectorStore.similaritySearch(query, 3)
          return results.map((doc) => doc.pageContent).join("\n\n")
        },
      }),

      new DynamicTool({
        name: "generate_quiz",
        description: "Generate quiz questions based on a topic and difficulty level",
        func: async (input: string) => {
          const [topic, difficulty] = input.split("|")
          return this.generateQuizQuestions(topic, difficulty as any)
        },
      }),

      new DynamicTool({
        name: "create_study_plan",
        description: "Create a personalized study plan based on subject and goals",
        func: async (input: string) => {
          const [subject, goals, timeframe] = input.split("|")
          return this.createStudyPlan(subject, goals.split(","), timeframe)
        },
      }),

      new DynamicTool({
        name: "explain_concept",
        description: "Provide detailed explanation of a concept with examples",
        func: async (concept: string) => {
          return this.explainConcept(concept)
        },
      }),

      new DynamicTool({
        name: "analyze_learning_progress",
        description: "Analyze student's learning progress and provide recommendations",
        func: async (input: string) => {
          const data = JSON.parse(input)
          return this.analyzeLearningProgress(data)
        },
      }),
    ]

    // Get the prompt template from LangChain Hub
    try {
      const prompt = await pull<ChatPromptTemplate>("hwchase17/openai-functions-agent")

      // Create the agent
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools,
        prompt,
      })

      // Create agent executor
      this.agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true,
        maxIterations: 3,
      })
    } catch (error) {
      console.error("Failed to initialize agent:", error)
    }
  }

  // Load documents into vector store for RAG
  async loadDocuments(documents: { content: string; metadata: any }[]) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const docs = documents.map((doc) => new Document({ pageContent: doc.content, metadata: doc.metadata }))

    const splitDocs = await textSplitter.splitDocuments(docs)
    this.vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings)
  }

  // Main agent interaction method
  async processQuery(query: string, context: StudyContext): Promise<AgentResponse> {
    if (!this.agentExecutor) {
      throw new Error("Agent not initialized")
    }

    const systemPrompt = this.buildSystemPrompt(context)
    const fullQuery = `${systemPrompt}\n\nUser Query: ${query}`

    try {
      const result = await this.agentExecutor.invoke({
        input: fullQuery,
      })

      return {
        response: result.output,
        reasoning: this.extractReasoning(result),
        suggestedActions: this.generateSuggestedActions(query, context),
        confidence: this.calculateConfidence(result),
        sources: this.extractSources(result),
      }
    } catch (error) {
      console.error("Agent processing error:", error)
      throw error
    }
  }

  // Advanced reasoning chain for complex problems
  async solveComplexProblem(problem: string, subject: string): Promise<AgentResponse> {
    const reasoningChain = RunnableSequence.from([
      ChatPromptTemplate.fromTemplate(`
        You are an expert tutor in {subject}. Break down this complex problem step by step:
        
        Problem: {problem}
        
        Provide:
        1. Problem analysis
        2. Step-by-step solution approach
        3. Key concepts involved
        4. Common mistakes to avoid
        5. Practice recommendations
        
        Format your response as JSON with these fields.
      `),
      this.llm,
      new StringOutputParser(),
    ])

    try {
      const result = await reasoningChain.invoke({
        problem,
        subject,
      })

      const parsed = JSON.parse(result)

      return {
        response: parsed.solution || result,
        reasoning: parsed.analysis || "Complex problem solving approach",
        suggestedActions: parsed.practice_recommendations || [],
        confidence: 0.9,
        sources: [`${subject} problem solving methodology`],
      }
    } catch (error) {
      console.error("Complex problem solving error:", error)
      throw error
    }
  }

  // Multi-agent collaboration for comprehensive learning
  async collaborativeStudySession(
    participants: string[],
    topic: string,
    context: StudyContext,
  ): Promise<{
    discussion: string[]
    synthesis: string
    actionItems: string[]
  }> {
    const agents = {
      teacher: new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.3 }),
      student: new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.8 }),
      critic: new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.5 }),
    }

    const discussion: string[] = []

    // Teacher introduces the topic
    const teacherPrompt = ChatPromptTemplate.fromTemplate(`
      You are an expert teacher. Introduce the topic "{topic}" to students at {level} level.
      Provide a clear overview and key learning objectives.
    `)

    const teacherIntro = await teacherPrompt
      .pipe(agents.teacher)
      .pipe(new StringOutputParser())
      .invoke({ topic, level: context.userLevel })

    discussion.push(`Teacher: ${teacherIntro}`)

    // Student asks questions
    const studentPrompt = ChatPromptTemplate.fromTemplate(`
      You are a curious {level} student. Based on this introduction about {topic}:
      {introduction}
      
      Ask 2-3 thoughtful questions that would help deepen understanding.
    `)

    const studentQuestions = await studentPrompt.pipe(agents.student).pipe(new StringOutputParser()).invoke({
      topic,
      level: context.userLevel,
      introduction: teacherIntro,
    })

    discussion.push(`Student: ${studentQuestions}`)

    // Teacher responds to questions
    const teacherResponse = await ChatPromptTemplate.fromTemplate(`
      As an expert teacher, answer these student questions about {topic}:
      {questions}
      
      Provide clear, detailed explanations with examples.
    `)
      .pipe(agents.teacher)
      .pipe(new StringOutputParser())
      .invoke({ topic, questions: studentQuestions })

    discussion.push(`Teacher: ${teacherResponse}`)

    // Critic provides analysis
    const criticAnalysis = await ChatPromptTemplate.fromTemplate(`
      Analyze this learning discussion about {topic}:
      {discussion}
      
      Provide:
      1. Key insights covered
      2. Areas that need more exploration
      3. Suggested next steps
    `)
      .pipe(agents.critic)
      .pipe(new StringOutputParser())
      .invoke({ topic, discussion: discussion.join("\n\n") })

    discussion.push(`Learning Analyst: ${criticAnalysis}`)

    // Synthesize the session
    const synthesis = await ChatPromptTemplate.fromTemplate(`
      Synthesize this collaborative learning session about {topic}:
      {fullDiscussion}
      
      Create a comprehensive summary with key takeaways and learning outcomes.
    `)
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .invoke({ topic, fullDiscussion: discussion.join("\n\n") })

    return {
      discussion,
      synthesis,
      actionItems: this.extractActionItems(criticAnalysis),
    }
  }

  // Adaptive learning path generation
  async generateAdaptiveLearningPath(
    subject: string,
    currentKnowledge: string[],
    targetGoals: string[],
    timeframe: string,
  ): Promise<{
    path: Array<{
      week: number
      topics: string[]
      activities: string[]
      assessments: string[]
    }>
    prerequisites: string[]
    estimatedDifficulty: "easy" | "medium" | "hard"
  }> {
    const pathPrompt = ChatPromptTemplate.fromTemplate(`
      Create an adaptive learning path for {subject}.
      
      Current Knowledge: {currentKnowledge}
      Target Goals: {targetGoals}
      Timeframe: {timeframe}
      
      Generate a week-by-week learning plan with:
      - Progressive topic introduction
      - Varied learning activities
      - Regular assessments
      - Prerequisite identification
      
      Format as JSON with the specified structure.
    `)

    const result = await pathPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .invoke({
        subject,
        currentKnowledge: currentKnowledge.join(", "),
        targetGoals: targetGoals.join(", "),
        timeframe,
      })

    try {
      return JSON.parse(result)
    } catch (error) {
      console.error("Failed to parse learning path:", error)
      throw error
    }
  }

  // Private helper methods
  private buildSystemPrompt(context: StudyContext): string {
    return `
      You are an advanced AI study assistant with expertise in ${context.subject}.
      
      Student Level: ${context.userLevel}
      Learning Goals: ${context.learningGoals.join(", ")}
      Available Documents: ${context.documents.length} documents loaded
      Previous Questions: ${context.previousQuestions.slice(-3).join("; ")}
      
      Use your tools to provide comprehensive, personalized assistance.
      Always explain your reasoning and suggest follow-up actions.
    `
  }

  private extractReasoning(result: any): string {
    // Extract reasoning from agent's intermediate steps
    if (result.intermediateSteps) {
      return result.intermediateSteps
        .map((step: any) => step.action?.log || "")
        .filter(Boolean)
        .join(" ")
    }
    return "Applied multi-step reasoning to provide comprehensive response"
  }

  private generateSuggestedActions(query: string, context: StudyContext): string[] {
    const actions = [
      "Review related concepts in your documents",
      "Practice with generated quiz questions",
      "Explore deeper explanations of key terms",
    ]

    if (context.userLevel === "beginner") {
      actions.push("Start with fundamental concepts")
    } else if (context.userLevel === "advanced") {
      actions.push("Explore advanced applications and edge cases")
    }

    return actions
  }

  private calculateConfidence(result: any): number {
    // Simple confidence calculation based on result completeness
    const hasTools = result.intermediateSteps?.length > 0
    const hasDetailedResponse = result.output?.length > 100

    let confidence = 0.7
    if (hasTools) confidence += 0.2
    if (hasDetailedResponse) confidence += 0.1

    return Math.min(confidence, 1.0)
  }

  private extractSources(result: any): string[] {
    // Extract sources from tool usage
    const sources: string[] = []

    if (result.intermediateSteps) {
      result.intermediateSteps.forEach((step: any) => {
        if (step.action?.tool === "document_search") {
          sources.push("Uploaded documents")
        }
      })
    }

    return sources.length > 0 ? sources : ["AI knowledge base"]
  }

  private extractActionItems(analysis: string): string[] {
    // Extract action items from critic analysis
    const lines = analysis.split("\n")
    return lines
      .filter((line) => line.includes("next step") || line.includes("action") || line.includes("recommend"))
      .map((line) => line.trim())
      .slice(0, 5)
  }

  // Tool implementation methods
  private async generateQuizQuestions(topic: string, difficulty: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Generate 5 {difficulty} level quiz questions about {topic}.
      Include multiple choice, true/false, and short answer questions.
      Provide correct answers and explanations.
    `)

    return await prompt.pipe(this.llm).pipe(new StringOutputParser()).invoke({ topic, difficulty })
  }

  private async createStudyPlan(subject: string, goals: string[], timeframe: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Create a detailed study plan for {subject}.
      Goals: {goals}
      Timeframe: {timeframe}
      
      Include daily/weekly schedules, milestones, and progress tracking methods.
    `)

    return await prompt
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .invoke({
        subject,
        goals: goals.join(", "),
        timeframe,
      })
  }

  private async explainConcept(concept: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Provide a comprehensive explanation of: {concept}
      
      Include:
      1. Clear definition
      2. Real-world examples
      3. Common misconceptions
      4. Related concepts
      5. Practice suggestions
    `)

    return await prompt.pipe(this.llm).pipe(new StringOutputParser()).invoke({ concept })
  }

  private async analyzeLearningProgress(data: any): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(`
      Analyze this learning progress data:
      {data}
      
      Provide insights on:
      1. Strengths and weaknesses
      2. Learning patterns
      3. Recommended focus areas
      4. Study strategy adjustments
    `)

    return await prompt
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .invoke({ data: JSON.stringify(data) })
  }
}

// Specialized agents for different subjects
export class MathAgent extends StudyAgent {
  constructor() {
    super()
  }

  async solveMathProblem(problem: string, showSteps = true): Promise<AgentResponse> {
    const mathChain = RunnableSequence.from([
      ChatPromptTemplate.fromTemplate(`
        Solve this math problem step by step: {problem}
        
        Show work: {showSteps}
        
        Provide:
        1. Problem identification
        2. Solution strategy
        3. Step-by-step work
        4. Final answer
        5. Verification
      `),
      this.llm,
      new StringOutputParser(),
    ])

    const result = await mathChain.invoke({ problem, showSteps })

    return {
      response: result,
      reasoning: "Applied mathematical problem-solving methodology",
      suggestedActions: [
        "Practice similar problems",
        "Review underlying concepts",
        "Check answer with alternative method",
      ],
      confidence: 0.95,
      sources: ["Mathematical principles and procedures"],
    }
  }
}

export class ScienceAgent extends StudyAgent {
  constructor() {
    super()
  }

  async explainScientificPhenomenon(phenomenon: string): Promise<AgentResponse> {
    const scienceChain = RunnableSequence.from([
      ChatPromptTemplate.fromTemplate(`
        Explain the scientific phenomenon: {phenomenon}
        
        Include:
        1. Scientific principles involved
        2. Mechanism/process
        3. Real-world examples
        4. Experimental evidence
        5. Applications
      `),
      this.llm,
      new StringOutputParser(),
    ])

    const result = await scienceChain.invoke({ phenomenon })

    return {
      response: result,
      reasoning: "Applied scientific methodology and evidence-based explanation",
      suggestedActions: [
        "Explore related experiments",
        "Study underlying scientific laws",
        "Find real-world applications",
      ],
      confidence: 0.9,
      sources: ["Scientific literature and principles"],
    }
  }
}

// Agent factory for creating specialized agents
export class AgentFactory {
  static createAgent(subject: string): StudyAgent {
    switch (subject.toLowerCase()) {
      case "mathematics":
      case "math":
        return new MathAgent()
      case "physics":
      case "chemistry":
      case "biology":
        return new ScienceAgent()
      default:
        return new StudyAgent()
    }
  }
}
