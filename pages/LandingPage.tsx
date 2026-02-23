import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, FileText, CheckCircle, Search, Activity, Layers } from 'lucide-react';

// Simple hook for scroll reveals
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting] as const;
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div
      ref={ref} 
      className={`transition-all duration-700 ease-editorial ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC<{ onEnter: () => void, isExiting?: boolean }> = ({ onEnter, isExiting }) => {
  return (
    <div className={`relative min-h-screen w-full bg-ink-900 font-sans text-white selection:bg-accent selection:text-ink-900 overflow-x-hidden transition-all duration-500 ease-editorial ${isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Navbar - Stays fixed but fades out on exit */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-8 bg-ink-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 bg-white flex items-center justify-center transition-transform duration-500 ease-editorial group-hover:rotate-12">
                   <ShieldCheck className="text-ink-900" size={20} />
                </div>
                <span className="font-display font-bold text-2xl tracking-tighter text-white">SARaansh</span>
            </div>
            <div className="hidden md:flex items-center gap-12 text-sm font-bold uppercase tracking-widest text-neutral-400">
                <button className="hover:text-white transition-colors duration-300">Platform</button>
                <button className="hover:text-white transition-colors duration-300">Manifesto</button>
            </div>
            <button 
                onClick={onEnter}
                className="text-sm font-bold uppercase tracking-widest text-ink-900 bg-white hover:bg-accent hover:text-ink-900 px-8 py-3 transition-all duration-300 hover:-translate-y-0.5"
            >
                Enter Platform
            </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* HERO SECTION */}
        <header className="max-w-7xl mx-auto px-6 pt-40 lg:pt-60 pb-32 grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col">
                <div className="opacity-0 animate-enter stagger-1">
                    <div className="inline-flex items-center gap-3 mb-10 border-l-2 border-accent pl-4">
                        <span className="text-accent text-sm font-mono font-bold uppercase tracking-widest">
                        System v2.4 Live
                        </span>
                    </div>
                </div>

                <div className="opacity-0 animate-enter stagger-2">
                    <h1 className="font-display text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-12 text-white">
                        Radical <br />
                        <span className="text-neutral-500">Transparency.</span>
                    </h1>
                </div>

                <div className="opacity-0 animate-enter stagger-3">
                    <p className="text-xl text-neutral-300 leading-relaxed mb-16 max-w-xl font-light font-serif">
                        The first AML compliance platform designed for defensibility. 
                        Generate regulator-ready SAR narratives grounded in absolute evidence.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-0 opacity-0 animate-enter stagger-4">
                    <button 
                        onClick={onEnter}
                        className="group relative px-10 py-5 bg-accent text-ink-900 font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 flex items-center gap-4 hover:-translate-y-1"
                    >
                        View Live Case
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300 ease-editorial" />
                    </button>
                    <button className="px-10 py-5 text-white font-bold uppercase tracking-widest border border-white hover:bg-white hover:text-ink-900 transition-all duration-300 hover:-translate-y-1">
                        Documentation
                    </button>
                </div>
            </div>

            {/* Right Column: Visual */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 opacity-0 animate-enter stagger-3" style={{ animationDelay: '500ms' }}>
                <div className="relative w-full aspect-[4/5] bg-white p-2 hover:scale-[1.02] transition-transform duration-700 ease-editorial cursor-default">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent z-0"></div>
                    <div className="relative z-10 h-full w-full bg-paper border border-neutral-200 flex flex-col overflow-hidden">
                        {/* Mock UI Header */}
                        <div className="h-16 border-b border-neutral-200 flex items-center justify-between px-6 bg-white">
                             <div className="font-display font-bold text-ink-900 text-lg">SAR-2023-001</div>
                             <div className="w-3 h-3 bg-ink-900 rounded-full"></div>
                        </div>
                        {/* Mock UI Content */}
                        <div className="p-8 space-y-8 font-serif text-ink-900 opacity-80">
                            <h2 className="font-display font-bold text-2xl uppercase">Executive Summary</h2>
                            <div className="space-y-4 text-sm leading-7">
                                <div className="bg-neutral-200 h-3 w-full"></div>
                                <div className="bg-neutral-200 h-3 w-5/6"></div>
                                <div className="bg-neutral-200 h-3 w-full"></div>
                                <div className="bg-neutral-200 h-3 w-4/5"></div>
                            </div>
                            <div className="p-6 border border-ink-900 mt-8">
                                <div className="font-mono text-xs uppercase tracking-widest mb-4">Evidence Mapping</div>
                                <div className="flex justify-between font-mono text-xs border-b border-neutral-200 pb-2 mb-2">
                                    <span>TRX-8921</span>
                                    <span>$9,800.00</span>
                                </div>
                                <div className="flex justify-between font-mono text-xs">
                                    <span>TRX-8922</span>
                                    <span>$9,500.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* SECTION 2: MANIFESTO */}
        <section className="w-full py-40 bg-paper text-ink-900 border-t border-white">
             <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
                 <div>
                    <Reveal>
                        <h2 className="font-display text-5xl font-bold mb-8 tracking-tighter">The Compliance <br/>Bottleneck.</h2>
                        <div className="w-20 h-2 bg-accent mb-8"></div>
                    </Reveal>
                 </div>
                 <div className="space-y-8">
                    <Reveal delay={200}>
                        <p className="text-2xl font-serif leading-relaxed">
                            Modern compliance teams are drowning in false positives and manual reporting. 
                            We replaced the "stare and compare" workflow with intelligent automation.
                        </p>
                    </Reveal>
                    <div className="grid grid-cols-1 gap-8 pt-8">
                        {[
                            { title: "Fragmentation", desc: "Analysts waste 40% of time gathering data." },
                            { title: "Fatigue", desc: "Repetitive narratives lead to regulatory kickbacks." },
                            { title: "Opacity", desc: "Manual processes leave poor paper trails." }
                        ].map((item, i) => (
                            <Reveal key={i} delay={300 + (i * 100)}>
                                <div className="border-t border-neutral-300 pt-4 group">
                                    <h3 className="text-lg font-bold font-display uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                                    <p className="text-neutral-600 font-serif">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                 </div>
             </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-40 bg-ink-900 border-t border-white/20 text-center">
             <div className="max-w-5xl mx-auto px-6">
                 <Reveal>
                    <h2 className="font-display text-6xl md:text-8xl font-bold text-white mb-12 tracking-tighter">
                        Defensible <br/> by Design.
                    </h2>
                 </Reveal>
                 <Reveal delay={200}>
                    <button 
                        onClick={onEnter}
                        className="px-12 py-6 bg-white text-ink-900 font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 hover:-translate-y-1 text-lg"
                    >
                        Start Investigation
                    </button>
                 </Reveal>
             </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-white/10 bg-ink-900 text-neutral-500 text-xs font-mono uppercase tracking-widest">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    &copy; 2024 SARaansh Inc.
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Security</a>
                </div>
            </div>
        </footer>

      </div>
    </div>
  );
};