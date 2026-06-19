"use client";

import dynamic from "next/dynamic";

// Cinematic Background
const NeuralBackground = dynamic(() => import("@/components/sections/cinematic/NeuralBackground"), { ssr: false });

// Cinematic Sequence
const HeroCinematic = dynamic(() => import("@/components/sections/cinematic/HeroCinematic"), { ssr: true });
const ProblemSection = dynamic(() => import("@/components/sections/cinematic/ProblemSection"), { ssr: true });
const EvidenceChaos = dynamic(() => import("@/components/sections/cinematic/EvidenceChaos"), { ssr: true });
const ConvergenceSection = dynamic(() => import("@/components/sections/cinematic/ConvergenceSection"), { ssr: true });
const MultiAgentGraph = dynamic(() => import("@/components/sections/cinematic/MultiAgentGraph"), { ssr: true });
const DecisionPipeline = dynamic(() => import("@/components/sections/cinematic/DecisionPipeline"), { ssr: true });
const TrustLayer = dynamic(() => import("@/components/sections/cinematic/TrustLayer"), { ssr: true });
const LivePlatformPreview = dynamic(() => import("@/components/sections/cinematic/LivePlatformPreview"), { ssr: true });

export default function Home() {
  return (
    <main className="relative bg-[#030014] text-white">
      {/* Global Background */}
      <NeuralBackground />
      
      {/* Content Layer */}
      <div className="relative z-10">
        
        {/* Story Sequence */}
        <HeroCinematic />
        <ProblemSection />
        <EvidenceChaos />
        <ConvergenceSection />
        <MultiAgentGraph />
        <DecisionPipeline />
        <TrustLayer />
        <LivePlatformPreview />
        
      </div>
    </main>
  );
}
