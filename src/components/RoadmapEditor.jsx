import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Flag } from 'lucide-react';

export default function RoadmapEditor({ currentWs, darkMode = false, onSaveWorkspace }) {
  const defaultTitle = 'Upcoming Academic Roadmap (6th Week & Beyond)';
  const [titleDraft, setTitleDraft] = useState(currentWs.roadmapTitle || defaultTitle);
  const [titleSaved, setTitleSaved] = useState(false);

  const [kind, setKind] = useState('LAB QUIZ');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [meta, setMeta] = useState('Period 1 (08:00 AM) • Lab Room');
  const [details, setDetails] = useState('');

  useEffect(() => {
    setTitleDraft(currentWs.roadmapTitle || defaultTitle);
  }, [currentWs.roadmapTitle]);

  const inputClass = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600';

  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';

  const handleSaveHeading = async (e) => {
    e.preventDefault();
    await onSaveWorkspace({ ...currentWs, roadmapTitle: titleDraft.trim() || defaultTitle });
    setTitleSaved(true);
    setTimeout(() => setTitleSaved(false), 2500);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;
    const newItem = {
      id: `rm-${Date.now()}`,
      kind,
      code: code.trim() || 'EVENT',
      title: title.trim(),
      dateTime,
      meta: meta.trim(),
      details: details.trim(),
    };
    const nextList = [...(currentWs.roadmapItems || []), newItem];
    await onSaveWorkspace({ ...currentWs, roadmapItems: nextList });
    setCode('');
    setTitle('');
    setDateTime('');
    setDetails('');
  };

  const handleRemoveItem = async (id) => {
    const nextList = (currentWs.roadmapItems || []).filter((item) => item.id !== id);
    await onSaveWorkspace({ ...currentWs, roadmapItems: nextList });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveHeading} className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-wider ${mutedText}`}>
          Roadmap Section Heading (Shown on Overview)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="e.g. Upcoming Academic Roadmap (7th Week & Beyond)"
            className={`flex-1 px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{titleSaved ? 'Heading Saved!' : 'Update Heading'}</span>
          </button>
        </div>
      </form>

      <form onSubmit={handleAddItem} className="space-y-3 pt-4 border-t border-slate-500/20">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Flag className="w-3.5 h-3.5" />
            <span>Add Custom Roadmap Milestone</span>
          </span>
          <span className={`text-[11px] ${mutedText}`}>
            CTs & Assignments also appear automatically
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          >
            <option value="LAB QUIZ">LAB QUIZ</option>
            <option value="VIVA">VIVA</option>
            <option value="PRESENTATION">PRESENTATION</option>
            <option value="EVENT">ACADEMIC EVENT</option>
          </select>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Course Code (e.g. ME 1256)"
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Milestone Title (e.g. Lab Quiz & Viva)"
            required
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          />
          <input
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder="Period & Venue (e.g. Period 1 • Lab Room)"
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
          />
        </div>

        <input
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Syllabus or instructions (optional)"
          className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition ${inputClass}`}
        />

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone to Roadmap & Sync Live</span>
        </button>
      </form>

      <div className="space-y-2 pt-2">
        <p className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
          Custom Roadmap Milestones ({(currentWs.roadmapItems || []).length})
        </p>
        {(currentWs.roadmapItems || []).length === 0 ? (
          <p className={`text-xs ${mutedText}`}>
            No extra milestones added yet. Use the form above to add Lab Quizzes, Vivas, or Events.
          </p>
        ) : (
          (currentWs.roadmapItems || []).map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 mr-2">
                  {item.kind}
                </span>
                <span className="font-bold text-xs sm:text-sm">
                  {item.code}: {item.title}
                </span>
                <p className={`text-[11px] truncate mt-0.5 ${mutedText}`}>
                  {item.dateTime} {item.meta ? `• ${item.meta}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 shrink-0"
                title="Remove milestone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
