# DevPilot

AI-powered GitHub repository assistant that helps developers understand and interact with their codebase using natural language.

DevPilot connects to a user's GitHub repositories, indexes the source code, and uses Retrieval-Augmented Generation (RAG) to provide context-aware answers about the codebase.

## Features

- GitHub OAuth authentication
- Import and manage GitHub repositories
- Repository source-code indexing
- Code chunking for efficient retrieval
- Retrieval-Augmented Generation (RAG)
- Context-aware AI chat for repositories
- Code citations for retrieved context
- Streaming AI responses using Server-Sent Events (SSE)
- Persistent chat sessions and message history
- Repository and indexing status dashboard
- Light and dark mode

## Architecture

                    ┌─────────────────────┐
                    │       GitHub        │
                    │   OAuth + Repos     │
                    └──────────┬──────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────┐
│                  React Frontend                    │
│                                                    │
│  Dashboard → Repository → Indexing → AI Chat      │
└────────────────────────┬───────────────────────────┘
                         │ REST / SSE
                         ▼
┌────────────────────────────────────────────────────┐
│               Spring Boot Backend                  │
│                                                    │
│  Authentication                                    │
│  Repository Management                             │
│  Code Indexing                                     │
│  RAG Retrieval                                     │
│  AI Chat Streaming                                 │
└───────────────┬───────────────────────┬────────────┘
                │                       │
                ▼                       ▼
       ┌────────────────┐       ┌─────────────────┐
       │  PostgreSQL    │       │   OpenAI API    │
       │   + pgvector   │       │ Chat + Embedding│
       └────────────────┘       └─────────────────┘



Tech Stack:

Frontend - 
React
JavaScript
Vite
React Router
TanStack React Query
CSS

Backend - 
Java 21
Spring Boot
Spring Web
Spring Data JPA
Spring Security
GitHub OAuth2
Spring AI

Database - 
PostgreSQL
pgvector
AI
OpenAI Chat API
OpenAI Embeddings
Retrieval-Augmented Generation (RAG)

Infrastructure - 
Docker
Docker Compose


Project Structure : 
DevPilot/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/backend/
│   │       │       ├── config/
│   │       │       ├── controllers/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── exceptions/
│   │       │       ├── repository/
│   │       │       ├── security/
│   │       │       └── services/
│   │       │           ├── ai/
│   │       │           ├── github/
│   │       │           └── indexing/
│   │       └── resources/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker/
│   └── postgres/
│
├── docker-compose.yml
├── .gitignore
└── README.md


How It Works - 
1. GitHub Authentication

Users authenticate through GitHub OAuth.

DevPilot uses the authenticated GitHub account to access the user's repositories.

2. Repository Selection

After authentication, available repositories are displayed in the dashboard.

Users can select a repository to work with.

3. Code Indexing

When a repository is indexed:

GitHub Repository
       │
       ▼
Fetch source files
       │
       ▼
Filter relevant files
       │
       ▼
Split code into chunks
       │
       ▼
Generate embeddings
       │
       ▼
Store vectors in pgvector

4. Ask Questions

Users can ask questions about the selected repository.

Example:

How does authentication work in this project?

DevPilot retrieves the most relevant code chunks from the vector database.

User Question
      │
      ▼
Generate query embedding
      │
      ▼
Vector similarity search
      │
      ▼
Relevant code context
      │
      ▼
Build AI prompt
      │
      ▼
OpenAI
      │
      ▼
Stream response

5. Context-Aware Response

The retrieved repository context is provided to the AI model so that responses are based on the actual codebase rather than only the model's general knowledge.

Relevant code references are surfaced as citations alongside the response.

RAG Pipeline

DevPilot uses a repository-level Retrieval-Augmented Generation pipeline:

Repository
    ↓
File Filtering
    ↓
Code Chunking
    ↓
Embedding Generation
    ↓
pgvector Storage
    ↓
Similarity Retrieval
    ↓
Context Construction
    ↓
LLM
    ↓
Streaming Response
Getting Started
Prerequisites

Make sure you have the following installed:

Java 21
Maven
Node.js
npm
Docker Desktop
Git

You will also need:

A GitHub OAuth application
An OpenAI API key
1. Clone the Repository
git clone https://github.com/Aestheticsuraj234/devPilot.git
cd devPilot

3. Start PostgreSQL - 

Start the PostgreSQL/pgvector container:

docker compose up -d

The development database runs on:

localhost:5434

3. Configure Environment Variables

Do not commit your real credentials.

Create the local configuration file:

backend/src/main/resources/application.properties

The file should use environment variables for sensitive values.

Required environment variables:

OPENAI_API_KEY
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
DB_USERNAME
DB_PASSWORD
TOKEN_ENCRYPTOR_PASSWORD
TOKEN_ENCRYPTOR_SALT

Example:

spring.datasource.url=jdbc:postgresql://localhost:5434/devpilot
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.ai.openai.api-key=${OPENAI_API_KEY}

spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}

4. Configure GitHub OAuth

Create a GitHub OAuth application and configure the authorization callback URL as:

http://localhost:8080/login/oauth2/code/github

The frontend runs on:

http://localhost:5173
5. Start the Backend

Open a terminal:

cd backend
mvn spring-boot:run

Backend:

http://localhost:8080

6. Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://localhost:5173
Example Questions

Once a repository has been indexed, users can ask questions such as:

How does authentication work?

Where is the GitHub API integrated?

Explain the repository indexing flow.

Which classes handle AI responses?

How are chat sessions stored?

Where is the database configuration handled?
Security

Sensitive configuration is intentionally kept outside source control.

The following should never be committed:

application.properties
.env
.env.*
API keys
OAuth client secrets
Database credentials

Environment variables are used for local configuration.

Future Improvements :- 
Smarter code-aware chunking
Improved retrieval and ranking
Multi-file reasoning
Repository-wide dependency analysis
Pull request analysis
Code change suggestions
Test generation
Conversation context optimization
Background/asynchronous indexing
Improved observability and error handling


License

This project is intended as a personal software engineering project and portfolio application.
