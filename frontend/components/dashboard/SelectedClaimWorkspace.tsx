"use client";

import React, { useState } from "react";
import { MessageSquare, Image as ImageIcon, Search, Crosshair, Tag, Maximize2, X, ClipboardList, AlertTriangle, Activity } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface WorkspaceProps {
  claimData: any;
  finalResult: any;
  steps: any[];
}

export function SelectedClaimWorkspace({ claimData, finalResult, steps }: WorkspaceProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!claimData) {
    return (
      <div className="h-full glass rounded-2xl border border-white/[0.05] p-6 flex flex-col items-center justify-center text-white/30">
        <Search className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a claim from the queue to view details.</p>
      </div>
    );
  }

  const { claim, history, requirements } = claimData;
  const images = claim.image_paths ? claim.image_paths.split(";") : [];

  // Extract findings from steps if available
  const extractionStep = steps.find(s => s.agent === "Claim Extraction Agent");
  const visionStep = steps.find(s => s.agent === "Vision Inspection Agent");

  const issueType = extractionStep?.result?.issue_type || "Pending Analysis";
  const objectPart = extractionStep?.result?.object_part || "Pending Analysis";
  const severity = visionStep?.result?.severity || "Pending Analysis";

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden relative">
      
      {/* Top Half: Conversation & Requirements */}
      <div className="flex gap-4 h-1/2">
        {/* Conversation */}
        <div className="flex-1 glass rounded-2xl border border-white/[0.05] p-5 flex flex-col overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            User Conversation
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-white/90 leading-relaxed font-mono whitespace-pre-wrap">
                {claim.user_claim}
              </p>
            </div>
            
            {history && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="text-[10px] uppercase text-white/40 mb-2">User History Summary</h4>
                <p className="text-xs text-white/60">{history.history_summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Requirements */}
        <div className="w-[40%] glass rounded-2xl border border-white/[0.05] p-5 flex flex-col overflow-hidden relative group">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            Evidence Rules
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 relative z-10">
            {requirements && requirements.filter((r: any) => r.claim_object === claim.claim_object || r.claim_object === 'all').map((req: any, i: number) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <p className="text-[10px] text-emerald-400 font-mono mb-1">{req.requirement_id}</p>
                <p className="text-xs text-white/70 leading-snug">{req.minimum_image_evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Half: Images & Findings */}
      <div className="flex gap-4 h-1/2">
        {/* Images */}
        <div className="flex-1 glass rounded-2xl border border-white/[0.05] p-5 flex flex-col overflow-hidden">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            Submitted Evidence
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-2 gap-3">
            {images.map((path: string, i: number) => {
              // path is something like "images/sample/case_001/img_1.jpg"
              // The API mounts "/images" to "dataset/images". So "https://verisight-nexus-back.onrender.com/" + path perfectly points to the image.
              const cleanPath = path.trim();
              const imgUrl = cleanPath.startsWith('http') ? cleanPath : `https://verisight-nexus-back.onrender.com/${cleanPath}`;
              return (
                <div 
                  key={i} 
                  className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video cursor-pointer"
                  onClick={() => setZoomedImage(imgUrl)}
                >
                  <img src={imgUrl} alt="Evidence" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Findings */}
        <div className="w-[40%] glass rounded-2xl border border-white/[0.05] p-5 flex flex-col overflow-hidden">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
            <Crosshair className="w-4 h-4 text-rose-400" />
            Live Findings
          </h3>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-2 text-white/40 mb-1">
                <Tag className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">Object Part</span>
              </div>
              <p className={cn("text-sm font-medium capitalize", objectPart === 'Pending Analysis' ? 'text-white/30 animate-pulse' : 'text-white')}>{objectPart}</p>
            </div>
            
            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-2 text-white/40 mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">Issue Type</span>
              </div>
              <p className={cn("text-sm font-medium capitalize", issueType === 'Pending Analysis' ? 'text-white/30 animate-pulse' : 'text-white')}>{issueType}</p>
            </div>

            <div className="bg-black/20 rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-2 text-white/40 mb-1">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">Severity Estimate</span>
              </div>
              <p className={cn("text-sm font-medium capitalize", severity === 'Pending Analysis' ? 'text-white/30 animate-pulse' : 'text-rose-400')}>{severity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-8"
          onClick={() => setZoomedImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed Evidence" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
