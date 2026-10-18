import React, { useState } from 'react';
import { Globe, Download, X, Copy, Check, ExternalLink, Zap, UploadCloud } from 'lucide-react';
import { downloadOfflineHtmlFile } from '../utils/downloadOfflineHtml';
import { sound } from '../utils/audio';

interface PublicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicLinkModal: React.FC<PublicLinkModalProps> = ({ isOpen, onClose }) => {
  const [copiedHost, setCopiedHost] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playCatch();
    downloadOfflineHtmlFile();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHost(id);
    sound.playCatch();
    setTimeout(() => setCopiedHost(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FFFDF5] border-4 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-900 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-sky-400 border-2 border-sky-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-white">
            🌐
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-['Fredoka'] text-amber-950">
              Create 100% Free Public Link
            </h3>
            <p className="text-xs font-bold text-sky-800">
              Fix "You do not have access" · Friends can click & play without login
            </p>
          </div>
        </div>

        {/* Notice explaining access error */}
        <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-2.5 mb-3 text-[11px] font-bold text-amber-950 flex items-start gap-2">
          <span className="text-sm">⚠️</span>
          <span>
            <strong>Why your friends saw "No Access":</strong> The current preview link is in Google AI Studio private developer mode. To give friends a public link they can open on WhatsApp, upload the single offline file to any of these 100% free hosts below!
          </span>
        </div>

        {/* Free Hosting Options */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left text-xs font-medium text-stone-800">
          {/* Method 1: Netlify Drop */}
          <div className="bg-white border-2 border-emerald-400 rounded-2xl p-3.5 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  ⚡ Fastest (15 Seconds)
                </span>
                <span className="font-black text-sm text-stone-900 font-['Fredoka']">Netlify Drop</span>
              </div>
              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 underline"
              >
                Open Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 font-semibold text-stone-700 text-[11px]">
              <li>
                Click <strong>"Download OFFLINE Game"</strong> below to get <code>Richie-Diamond-Vault-OFFLINE.html</code>.
              </li>
              <li>
                Rename it to <code>index.html</code> and put it in a new empty folder on your desktop.
              </li>
              <li>
                Open <strong>app.netlify.com/drop</strong> in any browser.
              </li>
              <li>
                <strong>Drag and drop the folder</strong> onto the Netlify webpage.
              </li>
              <li>
                Done! You instantly get a permanent public URL like <code>https://richie-vault.netlify.app</code> to share on WhatsApp!
              </li>
            </ol>
          </div>

          {/* Method 2: Itch.io */}
          <div className="bg-white border-2 border-rose-300 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  🎮 Free Game Store
                </span>
                <span className="font-black text-sm text-stone-900 font-['Fredoka']">Itch.io</span>
              </div>
              <a
                href="https://itch.io"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black text-rose-700 hover:text-rose-800 flex items-center gap-1 underline"
              >
                Open Itch <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-stone-600 font-semibold">
              Create a free account on <strong>itch.io</strong>, click "Upload new project", set kind of project to "HTML", upload the game file, and your game is live on the public web for millions of players.
            </p>
          </div>

          {/* Method 3: GitHub Pages */}
          <div className="bg-white border-2 border-stone-300 rounded-2xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-stone-100 text-stone-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  💻 Unlimited Free Hosting
                </span>
                <span className="font-black text-sm text-stone-900 font-['Fredoka']">GitHub Pages</span>
              </div>
              <a
                href="https://pages.github.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black text-stone-700 hover:text-stone-900 flex items-center gap-1 underline"
              >
                Learn More <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-stone-600 font-semibold">
              Create a free GitHub repository named <code>richie-vault</code>, upload <code>index.html</code>, go to Settings ➔ Pages, and turn on GitHub Pages for a free <code>.github.io</code> link!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t-2 border-amber-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 border-2 border-amber-300 font-['Outfit']"
          >
            <Download className="w-4 h-4 text-amber-950" />
            <span>Download OFFLINE Game to Upload (45 KB)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
