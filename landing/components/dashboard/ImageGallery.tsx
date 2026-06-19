"use client";

import React from 'react';
import { ImageIcon, ZoomIn, Info } from 'lucide-react';

interface Props {
  imagePathsRaw: string;
  claimObject: string;
  userClaim: string;
}

export function ImageGallery({ imagePathsRaw, claimObject, userClaim }: Props) {
  const images = imagePathsRaw.split(';').filter(Boolean);
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center glass rounded-xl">
        <div className="text-center text-white/40">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  // Generate public paths (assuming images are placed in landing/public/dataset/images)
  // Or we can just use the absolute path if served via backend.
  // For the frontend, since landing is running, we assume images are copied to public/dataset/
  // But wait, they are in ../dataset/images. We should create an API route or serve them.
  // Let's assume we copy the dataset/images folder to landing/public/images/ for Next.js to serve,
  // or use the backend to proxy images. Let's just point to /images/... which we will set up.
  
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Main Viewer */}
      <div className="relative flex-1 glass rounded-xl border border-white/10 overflow-hidden group bg-black/40 flex items-center justify-center">
        <img 
          src={`http://localhost:8000/${images[selectedIdx]}`} 
          alt={`${claimObject} evidence`}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <p className="text-xs text-white/70 font-mono">{images[selectedIdx]}</p>
          </div>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-colors">
            <ZoomIn className="w-4 h-4 text-white/90" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                selectedIdx === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={`http://localhost:8000/${img}`} className="w-full h-full object-cover" alt="thumbnail" />
            </button>
          ))}
        </div>
      )}

      {/* Conversation Context */}
      <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-white/80 font-medium pb-2 border-b border-white/10">
          <Info className="w-4 h-4 text-blue-400" />
          <h3>Claim Transcript</h3>
        </div>
        <div className="text-sm text-white/60 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
          {userClaim.split('|').map((line, i) => (
            <p key={i} className="mb-2">
              <span className={line.includes('Customer') ? 'text-blue-300' : 'text-purple-300'}>
                {line.trim().split(':')[0]}:
              </span>
              {line.trim().split(':').slice(1).join(':')}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
