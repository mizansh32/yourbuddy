import React, { useState, useEffect } from 'react';
import { Printer, Clock, CheckCircle2, FileText, Edit3, AlertCircle } from 'lucide-react';

const DEFAULT_LAB_PRINTING = {
  labCourse: 'ME 1256 — Basic Mechanical Engineering Lab',
  reportingTime: 'Saturday • Period 1 (08:00 AM) • Lab Room',
  reports: [
    { title: 'Exp 01: Study of Steam Boiler', materials: 'Cover Page, Data Sheet, Schematic Diagram' },
    { title: 'Exp 02: Internal Combustion Engine', materials: 'Cover Page, Observation Table, Graph Paper' },
    { title: 'Exp 03: Refrigeration & Air Conditioning', materials: 'Cover Page, Calculation Sheet' },
  ],
  extraNote: 'Print single-sided on A4 offset paper; bring calculator & lab manual.',
};

export default function LabPrintingSection({
  labPrinting,
  darkMode = false,
  editable = false,
  onSaveLabPrinting,
  onOpenAdmin,
}) {
  const normalized = {
    ...DEFAULT_LAB_PRINTING,
    ...(labPrinting || {}),
    reports:
      Array.isArray(labPrinting?.reports) && labPrinting.reports.length === 3
        ? labPrinting.reports
        : DEFAULT_LAB_PRINTING.reports,
  };

  const [draft, setDraft] = useState(normalized);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setDraft(normalized);
  }, [labPrinting]);

  const updateReport = (idx, field, val) => {
    const next = draft.reports.map((r, i) => (i === idx ? { ...r, [field]: val } : r));
    setDraft({ ...draft, reports: next });
  };

  const handleSave = async () => {
    if (onSaveLabPrinting) {
      await onSaveLabPrinting(draft);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }
  };

  const shellClass = darkMode
    ? 'bg-slate-900 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200/90 text-slate-900 shadow-sm';

  const subCardClass = darkMode
    ? 'bg-slate-800/60 border-slate-700/80'
    : 'bg-slate-50/80 border-slate-200/80';

  const inputClass = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600';

  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <section className={`rounded-2xl border p-4 sm:p-6 transition-colors ${shellClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600">
            <Printer className="w-3.5 h-3.5" />
            <span>Next Lab Reporting & Printing</span>
          </div>
          <h2 className="font-display text-base sm:text-lg font-extrabold tracking-tight">
            {normalized.labCourse}
          </h2>
          <p className={`flex items-center gap-1.5 text-xs sm:text-sm ${mutedText}`}>
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{normalized.reportingTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {editable ? (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedToast ? 'Saved Live!' : 'Save Print Schedule'}</span>
            </button>
          ) : (
            onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  darkMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>CR Edit</span>
              </button>
            )
          )}
        </div>
      </div>

      {editable ? (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${mutedText}`}>
                Next Lab Course
              </label>
              <input
                value={draft.labCourse}
                onChange={(e) => setDraft({ ...draft, labCourse: e.target.value })}
                placeholder="e.g. ME 1256 — Basic Mechanical Engineering Lab"
                className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${mutedText}`}>
                Reporting Day, Period & Room
              </label>
              <input
                value={draft.reportingTime}
                onChange={(e) => setDraft({ ...draft, reportingTime: e.target.value })}
                placeholder="e.g. Saturday • Period 1 (08:00 AM) • Lab Room"
                className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {draft.reports.map((rep, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border space-y-2.5 ${subCardClass}`}>
                <div className="flex items-center gap-2">
                  <span className="font-mono w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
                    Print Item #{idx + 1}
                  </span>
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold uppercase mb-1 ${mutedText}`}>
                    Experiment / Report Title
                  </label>
                  <input
                    value={rep.title}
                    onChange={(e) => updateReport(idx, 'title', e.target.value)}
                    placeholder={`Report #${idx + 1} Title`}
                    className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none transition ${inputClass}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-semibold uppercase mb-1 ${mutedText}`}>
                    Materials to Print
                  </label>
                  <input
                    value={rep.materials}
                    onChange={(e) => updateReport(idx, 'materials', e.target.value)}
                    placeholder="Cover Page, Data Sheet, Graph..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none transition ${inputClass}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${mutedText}`}>
              Printing & Reporting Instructions
            </label>
            <input
              value={draft.extraNote}
              onChange={(e) => setDraft({ ...draft, extraNote: e.target.value })}
              placeholder="Paper size, single/double-sided, accessories..."
              className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
            />
          </div>
        </div>
      ) : (
        <div className="pt-4 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {normalized.reports.map((rep, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 flex flex-col justify-between transition ${subCardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                      PRINT 0{idx + 1}
                    </span>
                    <FileText className="w-4 h-4 text-indigo-500/70" />
                  </div>
                  <h3 className="font-display font-bold text-sm leading-snug">
                    {rep.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70">
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${mutedText}`}>
                    Materials to Print
                  </span>
                  <p className="text-xs font-semibold text-indigo-600">
                    {rep.materials}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {normalized.extraNote && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                darkMode
                  ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                  : 'bg-amber-50/90 border-amber-200/80 text-amber-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>Print Note:</strong> {normalized.extraNote}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
