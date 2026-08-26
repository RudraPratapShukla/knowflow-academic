import { Header } from "@/components/Header";
import { BookOpen, Target, Users, Code } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-2xl py-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">About KnowFlow</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          KnowFlow is an advanced academic content aggregator that helps students and lifelong learners discover
          high-quality educational resources. We fetch, rank, and organize content from YouTube, trusted web articles,
          and our own community blog — all scored by a transparent credibility algorithm.
        </p>

        <div className="mt-12 space-y-8">
          {[
            { icon: <Target className="h-5 w-5" />, title: "Our Mission", text: "To make finding reliable educational content as effortless as a single search query." },
            { icon: <Users className="h-5 w-5" />, title: "Community Driven", text: "Our blog system lets educators and students contribute and peer-review academic content." },
            { icon: <Code className="h-5 w-5" />, title: "Transparent Scoring", text: "Our credibility algorithm uses engagement metrics, source reliability, and verification status — no black boxes." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
