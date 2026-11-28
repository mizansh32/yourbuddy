import React, { useState, useEffect } from 'react';
import { Printer, Clock, CheckCircle2, FileText, Edit3, AlertCircle, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const DEFAULT_LAB_PRINTING = {
  enabled: true,
  labCourse: 'ME 1256 — Basic Mechanical Engineering Lab',
  reportingTime: 'Saturday • Period 1 (08:00 AM) • Lab Room',
  reports: [
    { id: '1', title: 'Exp 01: Study of Steam Boiler', materials: 'Cover Page, Data Sheet, Schematic Diagram' },
    { id: '2', title: 'Exp 02: Internal Combustion Engine', materials: 'Cover Page, Observation Table, Graph Paper' },
    { id: '3', title: 'Exp 03: Refrigeration & Air Conditioning', materials: 'Cover Page, Calculation Sheet' },
  ],
  extraNote: 'Print single-sided on A4 offset paper; bring calculator & lab manual.',
};

export default function LabPrintingSection({
  labPrinting,
  darkMode = false,
  editable = false,
  hideWhenDisabled = false,
  onSaveLabPrinting,
  onOpenAdmin,
}) {
  const hasCustom = labPrinting && typeof labPrinting === 'object';
  const normalized = {
    ...DEFAULT_LAB_PRINTING,
    ...(hasCustom ? labPrinting : {}),
    enabled: hasCustom && typeof labPrinting.enabled === 'boolean' ? labPrinting.enabled : true,
    reports: hasCustom && Array.isArray(labPrinting.reports)
      ? labPrinting.reports
      : DEFAULT_LAB_PRINTING.reports,
  };

  const [draft, setDraft] = useState(normalized);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setDraft(normalized);
  }, [labPrinting]);

  if (!editable && hideWhenDisabled && (!normalized.enabled || normalized.reports.length === 0)) {
    return null;
  }

  const updateReport = (idx, field, val) => {
    const next = draft.reports.map((r, i) => (i === idx ? { ...r, [field]: val } : r));
    setDraft({ ...draft, reports: next });
  };

  const addReportItem = () => {
    setDraft({
      ...draft,
      enabled: true,
      reports: [
        ...draft.reports,
        { id: String(Date.now()), title: '', materials: '' },
      ],
    });
  };

  const removeReportItem = (idx) => {
    setDraft({
      ...draft,
      reports: draft.reports.filter((_, i) => i !== idx),
    });
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

  const gridColsClass =
    normalized.reports.length === 1
      ? 'grid-cols-1'
      : normalized.reports.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-3';

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

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {editable ? (
            <>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  draft.enabled
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                }`}
              >
                {draft.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{draft.enabled ? 'Visible on Home' : 'Hidden on Home'}</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedToast ? 'Saved Live!' : 'Save & Sync Live'}</span>
              </button>
            </>
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

          <div className="flex items-center justify-between pt-1">
            <span className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
              Print Items ({draft.reports.length})
            </span>
            <button
              type="button"
              onClick={addReportItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Print Item</span>
            </button>
          </div>

          {draft.reports.length === 0 ? (
            <div className={`rounded-xl border border-dashed p-6 text-center space-y-2 ${subCardClass}`}>
              <p className={`text-xs ${mutedText}`}>
                No print items added. The printing section will stay hidden on the Overview page until you add an item.
              </p>
              <button
                type="button"
                onClick={addReportItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Print Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {draft.reports.map((rep, idx) => (
                <div key={rep.id || idx} className={`p-3.5 rounded-xl border space-y-2.5 ${subCardClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${mutedText}`}>
                        Print Item #{idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReportItem(idx)}
                      title="Remove this print item"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          )}

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
      ) : normalized.reports.length === 0 || !normalized.enabled ? (
        <div className="pt-4">
          <div className={`rounded-xl border border-dashed p-6 text-center text-xs ${subCardClass} ${mutedText}`}>
            No lab printing items are currently scheduled.
          </div>
        </div>
      ) : (
        <div className="pt-4 space-y-3.5">
          <div className={`grid ${gridColsClass} gap-3`}>
            {normalized.reports.map((rep, idx) => (
              <div
                key={rep.id || idx}
                className={`rounded-xl border p-4 flex flex-col justify-between transition ${subCardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                      PRINT {String(idx + 1).padStart(2, '0')}
                    </span>
                    <FileText className="w-4 h-4 text-indigo-500/70" />
                  </div>
                  <h3 className="font-display font-bold text-sm leading-snug">
                    {rep.title || `Lab Print Item #${idx + 1}`}
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70">
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${mutedText}`}>
                    Materials to Print
                  </span>
                  <p className="text-xs font-semibold text-indigo-600">
                    {rep.materials || 'Standard lab cover & data sheet'}
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
