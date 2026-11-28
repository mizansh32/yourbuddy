import React, { useState } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';

const DEVELOPER = {
  name: 'Mizan',
  role: "RUET MTE '25",
  photo: '/developer.svg',
  handles: [
    { label: 'GitHub', url: 'https://github.com/mizansh32' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/abdulla-al-mizan-85b564287/' },
    { label: 'Facebook', url: 'https://www.facebook.com/abdullaalmamun.sheikh.9/' },
    { label: 'Instagram', url: 'https://instagram.com' },
  ],
};

export default function AppFooter({ darkMode = false }) {
  const [imgFailed, setImgFailed] = useState(false);

  const cardSurface = darkMode
    ? 'bg-slate-900/90 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200/90 text-slate-900 shadow-sm';

  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';

  const pillClass = darkMode
    ? 'bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white border-slate-700/80'
    : 'bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border-slate-200/90';

  return (
    <footer className="mt-12 pb-24 md:pb-8">
      <div className={`rounded-2xl border p-5 sm:p-6 transition-colors ${cardSurface}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Brand Column */}
          <div className="flex items-center gap-3.5">
            <img
              src="/favicon.svg"
              alt="YourBuddy"
              className="w-11 h-11 rounded-xl object-cover shadow-sm ring-1 ring-indigo-500/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-extrabold tracking-tight">
                  YourBuddy
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600">
                  Live
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${mutedText}`}>
                yourbuddy.site • Academic Routine, CT & Lab Companion
              </p>
            </div>
          </div>

          {/* Developer Spotlight Card */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 sm:px-5 sm:py-3.5 ${
              darkMode
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50/70 border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {!imgFailed ? (
                <img
                  src={DEVELOPER.photo}
                  alt={DEVELOPER.name}
                  onError={() => setImgFailed(true)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover object-top bg-white ring-2 ring-indigo-500/40 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-display text-base font-bold flex items-center justify-center ring-2 ring-indigo-500/30 shrink-0">
                  MZ
                </div>
              )}
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  <Code2 className="w-3 h-3" />
                  <span>Crafted By</span>
                </div>
                <p className="font-display text-base font-bold leading-tight mt-0.5">
                  {DEVELOPER.name}
                </p>
                <p className={`text-xs ${mutedText}`}>
                  Developer • {DEVELOPER.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
              {DEVELOPER.handles.map((h) => (
                <a
                  key={h.label}
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${pillClass}`}
                >
                  <span>{h.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
