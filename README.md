🧠 VirtuLearn – Built by Students, for Students
Hi there! 👋 We're the VirtuLearn team — a group of students and engineers who got tired of boring, one-size-fits-all study platforms. So, we built something better: VirtuLearn, a collaborative study space that blends AI tutoring with real-time group sessions. Think of it as a digital library where you can work with friends, whiteboard ideas, or ask an AI agent to help with tricky calculus problems.

No fluff. No generic “AI-powered” buzzwords. Just tools we actually wanted for our own studying.

✨ What You Can Do with VirtuLearn
Here’s a quick rundown of what we built — and what you can expect:

🎥 Join Study Rooms That Don’t Suck
Hop into live study rooms with classmates

Share screens, draw on whiteboards, and chat while working through problems

Sync Pomodoro timers to stay focused together

Ask AI for help without leaving the room

🤖 Work with Smarter AI Agents (They Actually Help)
We trained agents that don’t just spit out answers—they explain stuff, step by step

You can ask math, science, or general learning questions

The agents also collaborate with each other (yeah, we thought that was pretty cool too)

Bonus: they build you a study plan that adjusts as you learn

📄 Turn Your Docs into Study Tools
Drop in a PDF — get a summary, flashcards, and quizzes automatically

Highlight a paragraph and ask “what’s the key idea here?”

Search through your notes and readings semantically, not just by keywords

🧑‍🤝‍🧑 Collaborate (Without Fighting Over Who’s Taking Notes)
Share a whiteboard in real-time with friends

Type notes together (Markdown-friendly!)

Export everything after — clean and ready to review later

📊 Understand What’s Working
Track how much you’re studying

Get recommendations based on quiz performance

See which topics you’ve mastered (or not)


### 📊 **Performance Analytics**
- Study time tracking and analytics
- Quiz scores and progress monitoring
- AI-powered learning recommendations
- Topic mastery insights with confidence scoring

### 🎯 **Advanced AI Features**
- **Reasoning Chains**: Multi-step problem solving with explanations
- **Tool Usage**: Agents can search, generate, and analyze content
- **Confidence Scoring**: Transparency in AI response reliability
- **Source Attribution**: Clear indication of information sources
- **Voice Interaction**: Speech-to-text and text-to-speech capabilities

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Authentication and user management
- **Row Level Security** - Database security policies

### **AI & ML**
- **LangChain** - Advanced agent framework with tool usage
- **AI SDK** - Unified AI integration framework
- **OpenAI GPT-4** - Primary AI model for reasoning and tutoring
- **Vector Embeddings** - Semantic search and document understanding
- **RAG (Retrieval-Augmented Generation)** - Context-aware responses

### **Agent Architecture**
- **AgentExecutor** - Tool-using agents with function calling
- **Multi-Agent Systems** - Collaborative agent workflows
- **Memory & Context** - Conversation history and document awareness
- **Dynamic Tools** - Custom educational tools and capabilities

### **Storage & Media**
- **Vercel Blob** - File storage for PDFs and media
- **WebRTC** - Peer-to-peer video communication
- **Web Speech API** - Voice interaction
- **Vector Store** - In-memory document embeddings

### **Deployment**
- **Vercel** - Hosting and deployment platform
- **Edge Functions** - Serverless API endpoints

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### **1. Clone & Install**
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd 

# Install dependencies
npm install
\`\`\`

### **2. Environment Setup**
Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration (Required for LangChain Agents)
OPENAI_API_KEY=your_openai_api_key

# File Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Optional: Additional AI Providers
XAI_API_KEY=your_xai_api_key
GROQ_API_KEY=your_groq_api_key
FAL_KEY=your_fal_api_key
DEEPINFRA_API_KEY=your_deepinfra_api_key
\`\`\`

### **3. Database Setup**
1. Create a [Supabase](https://supabase.com) project
2. Copy your project URL and API keys
3. Run the database schema:
   - Go to Supabase SQL Editor
   - Copy contents from `scripts/supabase-schema.sql`
   - Execute the SQL script

### **4. AI & LangChain Setup**
1. Get an [OpenAI API key](https://platform.openai.com) (Required)
2. Set up billing (required for GPT-4 API usage)
3. Add the key to your `.env.local` file
4. The LangChain agents will automatically initialize with your API key

### **5. File Storage Setup**
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Create blob store
vercel blob create
\`\`\`

### **6. Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

\`\`\`
virtulearn/
├── app/                          # Next.js App Router
│   ├── agents/                   # AI Agent interface pages
│   ├── api/                      # API routes
│   │   ├── agents/               # LangChain agent endpoints
│   │   │   ├── process/          # Main agent processing
│   │   │   ├── collaborative/    # Multi-agent sessions
│   │   │   └── learning-path/    # Adaptive learning paths
│   │   ├── ai/                   # AI integration endpoints
│   │   ├── auth/                 # Authentication callbacks
│   │   └── documents/            # Document processing
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard
│   ├── documents/                # Document management
│   ├── room/                     # Study room pages
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── agent-interface.tsx       # LangChain agent chat interface
│   ├── collaborative-whiteboard.tsx
│   ├── video-call.tsx
│   └── voice-assistant.tsx
├── lib/                          # Utility libraries
│   ├── langchain-agents.ts       # Advanced LangChain agent implementation
│   ├── ai-tutor.ts              # Basic AI tutoring logic
│   ├── blob-storage.ts          # File storage utilities
│   ├── supabase.ts              # Database client
│   ├── voice-interaction.ts     # Voice API integration
│   ├── webrtc.ts                # Video call management
│   └── utils.ts                 # General utilities
├── scripts/                     # Database and setup scripts
│   └── supabase-schema.sql      # Database schema
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
└── README.md                    # This file
\`\`\`

---

## 🤖 AI Agent System

### **LangChain Integration**

VirtuLearn features a sophisticated AI agent system built with LangChain, providing advanced reasoning capabilities and tool usage.

#### **Agent Types**
- **StudyAgent**: General-purpose educational agent with tool usage
- **MathAgent**: Specialized for mathematical problem solving
- **ScienceAgent**: Expert in scientific phenomena and explanations
- **Multi-Agent Systems**: Collaborative agents for comprehensive learning

#### **Agent Capabilities**
\`\`\`typescript
// Create specialized agent
const agent = AgentFactory.createAgent("mathematics")

// Load documents for context
await agent.loadDocuments(documents)

// Process complex queries with reasoning
const response = await agent.processQuery(query, context)

// Multi-agent collaboration
const session = await agent.collaborativeStudySession(participants, topic, context)

// Generate adaptive learning paths
const path = await agent.generateAdaptiveLearningPath(subject, knowledge, goals, timeframe)
\`\`\`

#### **Agent Tools**
- **Document Search**: RAG-powered semantic search through uploaded materials
- **Quiz Generation**: Dynamic quiz creation based on topics and difficulty
- **Study Plan Creation**: Personalized learning path generation
- **Concept Explanation**: Detailed explanations with examples and misconceptions
- **Progress Analysis**: Learning pattern analysis with actionable recommendations

#### **Advanced Features**
- **Reasoning Chains**: Step-by-step problem solving with detailed explanations
- **Confidence Scoring**: Transparency in AI response reliability
- **Source Attribution**: Clear indication of information sources
- **Memory & Context**: Conversation history and document awareness
- **Tool Orchestration**: Dynamic tool selection and usage

## 🔧 Configuration

### **Supabase Setup**
1. **Create Project**: [supabase.com](https://supabase.com)
2. **Database Schema**: Run `scripts/supabase-schema.sql`
3. **Authentication**: 
   - Enable email authentication
   - Configure OAuth providers (optional)
   - Set redirect URLs: `http://localhost:3000/auth/callback`

### **LangChain & AI Configuration**
- **OpenAI API Key**: Required for all agent functionality
- **Model Selection**: Defaults to GPT-4 for optimal reasoning
- **Vector Embeddings**: Automatic document processing and search
- **Agent Memory**: Conversation context and learning history




## 🚀 Deployment

### **Deploy to Vercel**
\`\`\`bash
# Deploy to production
vercel --prod
\`\`\`

### **Environment Variables**
Add all environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. **Ensure OPENAI_API_KEY is set** (required for agents)
4. Update Supabase redirect URLs to production domain

### **Domain Configuration**
1. **Supabase**: Update site URL and redirect URLs
2. **OpenAI**: No additional configuration needed
3. **Vercel Blob**: Automatically configured
4. **LangChain**: Uses OpenAI API key automatically

---

## 📖 Usage Guide

### **Using AI Agents**
1. Navigate to `/agents` from the dashboard
2. Select your subject and learning level
3. Choose agent mode:
   - **Chat**: Natural conversation with reasoning
   - **Problem Solving**: Step-by-step complex problem breakdown
   - **Collaborative**: Multi-agent learning sessions

### **Agent Interactions**
\`\`\`typescript
// Ask complex questions
"Explain calculus derivatives with real-world applications"

// Request problem solving
"Solve this physics problem step by step: [problem]"

// Generate learning materials
"Create a study plan for organic chemistry over 4 weeks"

// Multi-agent collaboration
"Start a collaborative session on quantum mechanics"
\`\`\`

### **Creating a Study Room**
1. Sign in to your account
2. Click "Create Room" on dashboard
3. Configure room settings and AI features
4. Share invite link with peers

### **Document Processing with AI**
1. Go to "Upload Documents"
2. Drag and drop PDF files
3. Select subject category
4. AI agents will process and create:
   - Contextual summaries
   - Interactive flashcards
   - Practice quizzes
   - Searchable content

### **Collaborative Features**
1. **Whiteboard**: Draw, annotate, and share ideas
2. **Notes**: Take collaborative notes in real-time
3. **Video**: Communicate face-to-face with peers
4. **AI Chat**: Get intelligent help during sessions

---

## 🔒 Security & Privacy

### **Data Protection**
- **Row Level Security**: Database-level access control
- **Authentication**: Secure user authentication with Supabase
- **API Security**: Protected API endpoints with authentication
- **File Security**: Secure file storage with access controls
- **AI Privacy**: Conversations processed securely with OpenAI

### **Privacy Features**
- **Private Rooms**: Invite-only study sessions
- **Data Encryption**: All data encrypted in transit and at rest
- **User Control**: Users control their data and privacy settings
- **Agent Transparency**: Clear indication of AI reasoning and sources
