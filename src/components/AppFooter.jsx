import React, { useState } from 'react';

const DEVELOPER = {
  name: 'Mizan',
  role: "Developer • RUET MTE '25",
  photo: '/developer.svg',
  handles: [
    { label: 'GitHub', url: 'https://github.com/mizansh32' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/abdulla-al-mizan-85b564287/' },
    { label: 'Facebook', url: 'https://www.facebook.com/abdullaalmamun.sheikh.9/' },
    { label: 'Instagram', url: 'https://instagram.com' },
  ],
};

export default function AppFooter() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <footer className="mt-10 pb-24 md:pb-6 border-t border-slate-200/80 dark:border-slate-800 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 ring-1 ring-slate-200/80 dark:ring-slate-700/80">
            <img
              src="/favicon.svg"
              alt="YourBuddy"
              className="w-8 h-8 rounded-lg object-cover"
            />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              YourBuddy
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              yourbuddy.site • RUET MTE '25 Academic Hub
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            {!imgFailed ? (
              <img
                src={DEVELOPER.photo}
                alt={DEVELOPER.name}
                onError={() => setImgFailed(true)}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-display text-xs font-bold flex items-center justify-center ring-2 ring-indigo-500/30 shrink-0">
                {DEVELOPER.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 leading-none">
                Developer
              </p>
              <p className="font-display text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {DEVELOPER.name}{' '}
                <span className="font-normal text-slate-500 dark:text-slate-400">
                  ({DEVELOPER.role})
                </span>
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex flex-wrap items-center gap-1.5">
            {DEVELOPER.handles.map((h) => (
              <a
                key={h.label}
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-300 dark:hover:text-white transition"
              >
                {h.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
