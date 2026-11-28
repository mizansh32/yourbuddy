import React, { useState, useEffect } from 'react';

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

export default function LabPrintingSection({ labPrinting, editable = false, onSaveLabPrinting, onOpenAdmin }) {
  const data = {
    ...DEFAULT_LAB_PRINTING,
    ...(labPrinting || {}),
    reports:
      Array.isArray(labPrinting?.reports) && labPrinting.reports.length === 3
        ? labPrinting.reports
        : DEFAULT_LAB_PRINTING.reports,
  };

  const [draft, setDraft] = useState(data);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setDraft(data);
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

  return (
    <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 mb-1.5">
            Next Lab Reporting & Printing (3 Items)
          </span>
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {data.labCourse}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {data.reportingTime}
          </p>
        </div>

        {editable ? (
          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
          >
            {savedToast ? 'Saved Live ✓' : 'Save Lab Print List'}
          </button>
        ) : (
          onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              CR Edit →
            </button>
          )
        )}
      </div>

      {editable ? (
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Next Lab Course
              </label>
              <input
                value={draft.labCourse}
                onChange={(e) => setDraft({ ...draft, labCourse: e.target.value })}
                placeholder="e.g. ME 1256 — Mechanical Lab"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Reporting Time & Venue
              </label>
              <input
                value={draft.reportingTime}
                onChange={(e) => setDraft({ ...draft, reportingTime: e.target.value })}
                placeholder="e.g. Saturday • Period 1 (08:00 AM)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          {draft.reports.map((rep, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
            >
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Print Item #{idx + 1} (Report / Experiment)
                </label>
                <input
                  value={rep.title}
                  onChange={(e) => updateReport(idx, 'title', e.target.value)}
                  placeholder={`Report #${idx + 1} Title`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Materials to Print
                </label>
                <input
                  value={rep.materials}
                  onChange={(e) => updateReport(idx, 'materials', e.target.value)}
                  placeholder="Cover Page, Data Sheet, Graph Paper..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              General Printing & Reporting Note
            </label>
            <input
              value={draft.extraNote}
              onChange={(e) => setDraft({ ...draft, extraNote: e.target.value })}
              placeholder="Paper size, single/double-sided, accessories..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.reports.map((rep, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      To Print #{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {rep.title}
                  </h3>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                    Materials Required
                  </span>
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {rep.materials}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {data.extraNote && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-xl px-3 py-2">
              <strong className="text-amber-800 dark:text-amber-300">Print Note:</strong> {data.extraNote}
            </p>
          )}
        </>
      )}
    </section>
  );
}
