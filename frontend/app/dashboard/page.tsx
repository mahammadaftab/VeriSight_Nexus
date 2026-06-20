"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ClaimsTable } from '@/components/dashboard/ClaimsTable';
import { AgentActivityFeed } from '@/components/dashboard/AgentActivityFeed';
import { TopBar } from '@/components/dashboard/TopBar';
import { ExecutiveMetrics } from '@/components/dashboard/ExecutiveMetrics';
import { LiveAgentPipeline } from '@/components/dashboard/LiveAgentPipeline';
import { AIVerdictPanel } from '@/components/dashboard/AIVerdictPanel';
import { AnalyticsRow } from '@/components/dashboard/AnalyticsRow';
import { ObservabilityRow } from '@/components/dashboard/ObservabilityRow';
import { EvaluationRow } from '@/components/dashboard/EvaluationRow';
import { SelectedClaimWorkspace } from '@/components/dashboard/SelectedClaimWorkspace';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [claims, setClaims] = useState([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [claimData, setClaimData] = useState<any>(null);
  
  // App-wide metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [obs, setObs] = useState<any>(null);
  const [evalData, setEvalData] = useState<any>(null);

  // Live WebSocket State
  const [steps, setSteps] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, string>>({});

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch metrics and claims
    Promise.all([
      fetch('https://verisight-nexus-back.onrender.com/claims', { credentials: 'include' }).then(res => res.json()),
      fetch('https://verisight-nexus-back.onrender.com/metrics', { credentials: 'include' }).then(res => res.json()),
      fetch('https://verisight-nexus-back.onrender.com/api/observability', { credentials: 'include' }).then(res => res.json()),
      fetch('https://verisight-nexus-back.onrender.com/api/evaluation', { credentials: 'include' }).then(res => res.json())
    ]).then(([claimsData, metricsData, obsData, evalRes]) => {
      if(claimsData.claims) {
        setClaims(claimsData.claims);
        // Auto-select the first claim so the dashboard never looks empty
        if (claimsData.claims.length > 0 && !selectedId) {
          setSelectedId(claimsData.claims[0].user_id);
        }
      }
      setMetrics(metricsData);
      setObs(obsData);
      setEvalData(evalRes);
    }).catch(console.error);
  }, []);

  // Reset live state when selected claim changes
  useEffect(() => {
    setSteps([]);
    setIsAnalyzing(false);
    setIsDone(false);
    setFinalResult(null);
    setError(null);
    setActiveAgent(null);
    setAgentStatus({});
    setClaimData(null);
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    if (selectedId) {
      fetch(`https://verisight-nexus-back.onrender.com/claim/${selectedId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setClaimData(data))
        .catch(console.error);
    }
  }, [selectedId]);

  const handleAnalyze = () => {
    if (!selectedId) return;
    
    setIsAnalyzing(true);
    setSteps([]);
    setIsDone(false);
    setFinalResult(null);
    setError(null);
    setActiveAgent(null);
    setAgentStatus({});

    const ws = new WebSocket(`wss://verisight-nexus-back.onrender.com/ws/analyze/${selectedId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'step') {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        if (data.status === 'processing') {
          setActiveAgent(data.agent);
        } else if (data.status === 'completed') {
          if (activeAgent === data.agent) setActiveAgent(null);
        }
        
        setAgentStatus(prev => ({ ...prev, [data.agent]: data.status }));

        setSteps(prev => {
          const existing = prev.findIndex(s => s.agent === data.agent);
          if (existing >= 0) {
            const next = [...prev];
            next[existing] = { ...next[existing], status: data.status, result: data.result, timestamp };
            return next;
          }
          return [...prev, { agent: data.agent, status: data.status, result: data.result, timestamp }];
        });
      } else if (data.type === 'done') {
        setIsDone(true);
        setIsAnalyzing(false);
        setActiveAgent(null);
        setFinalResult({
          final_status: data.final_status,
          severity: data.severity,
          justification: data.justification,
          health_score: data.health_score,
          fraud_score: data.fraud_score,
          confidence: data.confidence,
          copilot: data.copilot
        });
        
        // Re-fetch evaluation data if we finished a claim to keep metrics fully live
        fetch('https://verisight-nexus-back.onrender.com/api/evaluation', { credentials: 'include' })
          .then(res => res.json())
          .then(setEvalData)
          .catch(console.error);
          
        fetch('https://verisight-nexus-back.onrender.com/metrics', { credentials: 'include' })
          .then(res => res.json())
          .then(setMetrics)
          .catch(console.error);

        fetch('https://verisight-nexus-back.onrender.com/api/observability', { credentials: 'include' })
          .then(res => res.json())
          .then(setObs)
          .catch(console.error);
          
      } else if (data.type === 'error') {
        setError(data.message);
        setIsAnalyzing(false);
        setActiveAgent(null);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection failed.");
      setIsAnalyzing(false);
      setActiveAgent(null);
    };

    ws.onclose = () => {
      setIsAnalyzing(false);
    };
  };

  if (!metrics || !obs || !evalData) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 opacity-50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-y-auto custom-scrollbar flex flex-col relative">
      {/* Deep Navy Background & Mesh Gradients */}
      <div className="fixed inset-0 z-0 bg-[#030014]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#030014] to-[#030014]" />
        <div className="absolute right-0 top-1/4 w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute left-0 bottom-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      </div>

      <TopBar />

      <main className="relative z-10 flex-1 p-6 max-w-[2000px] mx-auto w-full">
        {/* ROW 1: Executive Metrics */}
        <div className="mb-8">
          <ExecutiveMetrics metrics={metrics} />
        </div>

        {/* ROW 2: Live Agent Pipeline (Horizontal) */}
        <div className="mb-16">
          <LiveAgentPipeline activeAgent={activeAgent} agentStatus={agentStatus} />
        </div>

        {/* ROW 3: Command Center Core (20/50/30 Layout) */}
        <div className="flex gap-4 h-[1000px] mb-12">
          {/* Left Column: 20% */}
          <div className="w-1/5 h-full">
            <ClaimsTable 
              claims={claims} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
          </div>
          
          {/* Center Column: 50% */}
          <div className="w-1/2 h-full">
             <SelectedClaimWorkspace claimData={claimData} finalResult={finalResult} steps={steps} />
          </div>
          
          {/* Right Column: 30% */}
          <div className="w-[30%] h-full flex flex-col gap-4">
             <div className="flex-1">
               <AgentActivityFeed 
                 userId={selectedId || ''} 
                 steps={steps}
                 isAnalyzing={isAnalyzing}
                 isDone={isDone}
                 finalResult={finalResult}
                 error={error}
                 onAnalyze={handleAnalyze}
               />
             </div>
             <div className="shrink-0 h-[280px]">
               <AIVerdictPanel verdict={finalResult} />
             </div>
          </div>
        </div>

        {/* Separator / Sub-sections */}
        <div className="py-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <h2 className="text-white/40 uppercase tracking-widest text-xs font-semibold">Platform Analytics & Observability</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>
        </div>

        <div className="space-y-12">
          <EvaluationRow evaluation={evalData} />
          <AnalyticsRow metrics={metrics} />
          <ObservabilityRow obs={obs} />
        </div>
        
      </main>
    </div>
  );
}
