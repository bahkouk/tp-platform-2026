'use client';

import { Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>2024 TP Platform. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for educational purposes.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Github className="w-3 h-3" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}