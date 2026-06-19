import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), { ssr: true });
const MetricsBar = dynamic(() => import("@/components/sections/MetricsBar"), { ssr: true });
const ProblemSection = dynamic(() => import("@/components/sections/ProblemSection"), { ssr: true });
const TransformationSection = dynamic(() => import("@/components/sections/TransformationSection"), { ssr: true });
const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection"), { ssr: true });
const WorkflowSection = dynamic(() => import("@/components/sections/WorkflowSection"), { ssr: true });
const DomainCards = dynamic(() => import("@/components/sections/DomainCards"), { ssr: true });
const ProcessTimeline = dynamic(() => import("@/components/sections/ProcessTimeline"), { ssr: true });
const ArchitectureSection = dynamic(() => import("@/components/sections/ArchitectureSection"), { ssr: true });
const EvaluationSection = dynamic(() => import("@/components/sections/EvaluationSection"), { ssr: true });
const PerformanceMetrics = dynamic(() => import("@/components/sections/PerformanceMetrics"), { ssr: true });
const CTASection = dynamic(() => import("@/components/sections/CTASection"), { ssr: true });

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <MetricsBar />
      <ProblemSection />
      <TransformationSection />
      <FeaturesSection />
      <WorkflowSection />
      <DomainCards />
      <ProcessTimeline />
      <ArchitectureSection />
      <EvaluationSection />
      <PerformanceMetrics />
      <CTASection />
      <Footer />
    </main>
  );
}
