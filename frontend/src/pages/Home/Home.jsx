import {
  ArrowRight,
  FolderGit2,
  MessageSquareCode,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";
import ModeToggle from "../../components/ui/ModeToggle";

function Home() {
  const features = [
    {
      title: "Connect GitHub",
      body: "OAuth with repo scope for public and private repositories.",
      icon: FolderGit2,
    },
    {
      title: "Index with RAG",
      body: "Chunk and embed your code into Postgres + pgvector.",
      icon: Sparkles,
    },
    {
      title: "Ask anything",
      body: "Get grounded answers with clickable source citations.",
      icon: MessageSquareCode,
    },
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="brand">
          <div className="brand-icon">
            <span>DP</span>
          </div>
          <span>DevPilot</span>
        </div>

        <div className="header-actions">
          <ModeToggle />

          <Link to="/login" className="signin-button">
            Sign in
          </Link>
        </div>
      </header>

      <main className="home-main">
        <section className="hero">
          <div className="hero-icon">
            <span>DP</span>
          </div>

          <h1>DevPilot</h1>

          <p>
            Connect GitHub, index any repository, and chat with your codebase
            using retrieval-augmented answers and citations.
          </p>

          <div className="hero-actions">
            <a href="#" className="github-button">
              <FolderGit2 size={18} />
              Continue with GitHub
              <ArrowRight size={18} />
            </a>

            <Link to="/login" className="outline-button">
              See how it works
            </Link>
          </div>
        </section>

        <section className="features">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={21} />
                </div>

                <h2>{feature.title}</h2>

                <p>{feature.body}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Home;