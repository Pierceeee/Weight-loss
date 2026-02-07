import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="h-screen w-screen overflow-hidden relative noise-texture">
      {/* Decorative organic blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="blob absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(16 85% 55% / 0.4) 0%, transparent 70%)" }}
        />
        <div 
          className="blob blob-delay-1 absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, hsl(160 45% 45% / 0.3) 0%, transparent 70%)" }}
        />
        <div 
          className="blob blob-delay-2 absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(30 60% 70% / 0.4) 0%, transparent 70%)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Minimal header */}
        <header className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex items-center gap-3 animate-fade-up">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">PCOS Plan</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up animate-delay-100">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="hidden sm:inline">50,000+ women helped</span>
          </div>
        </header>

        {/* Hero content - centered */}
        <main className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="animate-fade-up animate-delay-100">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Personalized for your body
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] animate-fade-up animate-delay-200">
              Take control of{" "}
              <span className="gradient-text italic">PCOS</span>
              <br />
              with a plan made
              <br />
              <span className="text-primary">just for you</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-up animate-delay-300">
              Answer a few questions about your symptoms and goals. 
              Get a personalized diet plan in minutes.
            </p>

            {/* CTA */}
            <div className="pt-4 animate-fade-up animate-delay-400">
              <Link 
                href="/quiz/1"
                className="group inline-flex items-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300"
              >
                Start Your Free Quiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust indicator */}
            <p className="text-sm text-muted-foreground animate-fade-up animate-delay-500">
              Takes only 3 minutes • No credit card required
            </p>
          </div>
        </main>

        {/* Bottom accent */}
        <footer className="px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60 animate-fade-up animate-delay-500">
            <span>Privacy-first</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>Science-backed</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>HIPAA compliant</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
