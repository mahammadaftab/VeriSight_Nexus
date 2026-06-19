"use client";

import { Zap } from "lucide-react";
import { FOOTER_COLUMNS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer id="documentation" className="relative border-t border-white/[0.04]">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight leading-none">
                  VeriSight
                </span>
                <span className="text-[10px] font-medium text-purple-400/80 tracking-widest uppercase leading-none mt-0.5">
                  Nexus
                </span>
              </div>
            </a>
            <p className="text-sm text-white/30 leading-relaxed max-w-xs">
              Multi-Modal Evidence Intelligence Platform for enterprise damage
              claim verification.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200"
                      id={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} VeriSight Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Security
            </a>
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
