import React, { useState, useEffect, useMemo } from 'react';
import LabPrintingSection from './components/LabPrintingSection';
import AppFooter from './components/AppFooter';
import {
  Calendar, Clock, BookOpen, CheckCircle2, Circle, Shield, Plus, Trash2,
  Sun, Moon, X, ChevronDown, Download, Smartphone, Share, Wifi, WifiOff,
  AlertTriangle, Megaphone, Users, GraduationCap, Lock, Unlock, Check, FileText
} from 'lucide-react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const PERIODS = [
  { num: 1, label: 'P1', time: '08:00 - 08:50', start: '08:00', end: '08:50' },
  { num: 2, label: 'P2', time: '08:50 - 09:40', start: '08:50', end: '09:40' },
  { num: 3, label: 'P3', time: '09:40 - 10:30', start: '09:40', end: '10:30' },
  { num: 4, label: 'P4', time: '10:50 - 11:40', start: '10:50', end: '11:40' },
  { num: 5, label: 'P5', time: '11:40 - 12:30', start: '11:40', end: '12:30' },
  { num: 6, label: 'P6', time: '12:30 - 01:20', start: '12:30', end: '13:20' },
  { num: 7, label: 'P7', time: '02:30 - 03:20', start: '14:30', end: '15:20' },
  { num: 8, label: 'P8', time: '03:20 - 04:10', start: '15:20', end: '16:10' },
  { num: 9, label: 'P9', time: '04:10 - 05:00', start: '16:10', end: '17:00' },
];

const FACULTY_LEGEND = [
  { code: 'MUH', name: 'Prof. Dr. Mohammad U. H. Joardder' },
  { code: 'MR', name: 'Mohammad Raihan' },
  { code: 'SI', name: 'Sumaya Israt Moyeen' },
  { code: 'MHA', name: 'Md. Hafiz Ahmed' },
  { code: 'MFA', name: 'Md. Firoj Ali' },
  { code: 'ZT', name: 'Dr. Zinat Tasneem' },
  { code: 'AAM', name: 'Abdullah-Al-Mizan' },
  { code: 'AH', name: 'Ahsan Habib' },
  { code: 'MKH', name: 'Prof. Dr. Mohammad Kamrul Hasan' },
  { code: 'MAH', name: 'Prof. Dr. Md. Alal Hosen' },
];

const DEFAULT_WORKSPACES = {
  'ruet-mte-25': {
    id: 'ruet-mte-25',
    university: 'RUET',
    department: 'Mechatronics Engineering (MTE)',
    batch: '25 Series (1-2)',
    crPin: import.meta.env.VITE_CR_SECRET_PIN,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    tickerText: '@all 6th Week: Sat ME 1255 (MUH) CT (Slide a jotodur ache) • Sun English (AAM) Reading PDF submission • Mon Math 1227 (MAH) CT (Last class porjonto) • Wed EEE 1287 (ZT) CT',
    urgentNotice: '6th Week Schedule Live: Check CT periods & English (AAM) PDF submission deadline below.',
    routine: [
      { id: 'sat-1', day: 'Saturday', startPeriod: 1, span: 3, code: 'ME 1256', title: 'Mechanical Engineering Sessional', teacher: 'MUH', room: 'HEL', type: 'Lab', status: 'Scheduled' },
      { id: 'sat-4', day: 'Saturday', startPeriod: 4, span: 1, code: 'CSE 1287', title: 'Computer Programming', teacher: 'SI', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'sat-5', day: 'Saturday', startPeriod: 5, span: 1, code: 'EEE 1287', title: 'Electrical & Electronic Eng.', teacher: 'ZT', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'sat-6', day: 'Saturday', startPeriod: 6, span: 1, code: 'ME 1255', title: 'Basic Mechanical Engineering', teacher: 'MUH', room: 'Classroom', type: 'Theory', status: 'Scheduled' },

      { id: 'sun-4', day: 'Sunday', startPeriod: 4, span: 1, code: 'CSE 1287', title: 'Computer Programming', teacher: 'MHA', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'sun-5', day: 'Sunday', startPeriod: 5, span: 1, code: 'EEE 1287', title: 'Electrical & Electronic Eng.', teacher: 'MFA', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'sun-6', day: 'Sunday', startPeriod: 6, span: 1, code: 'HUM 1227', title: 'Technical English', teacher: 'AAM', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'sun-7', day: 'Sunday', startPeriod: 7, span: 3, code: 'EEE 1288 (2nd 30)', title: 'EEE Sessional', teacher: 'MFA / ZT', room: 'RAL', type: 'Lab', status: 'Scheduled' },

      { id: 'mon-1', day: 'Monday', startPeriod: 1, span: 1, code: 'CSE 1287', title: 'Computer Programming', teacher: 'SI / MHA', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'mon-2', day: 'Monday', startPeriod: 2, span: 1, code: 'Math 1227', title: 'Differential Equations & Vector', teacher: 'MAH', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'mon-3', day: 'Monday', startPeriod: 3, span: 1, code: 'ME 1255', title: 'Basic Mechanical Engineering', teacher: 'MUH / MR', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'mon-4', day: 'Monday', startPeriod: 4, span: 3, code: 'CSE 1288 (1st 30)', title: 'Computer Programming Sessional', teacher: 'SI / MHA', room: 'CSL', type: 'Lab', status: 'Scheduled' },

      { id: 'tue-1', day: 'Tuesday', startPeriod: 1, span: 1, code: 'ME 1255', title: 'Basic Mechanical Engineering', teacher: 'MR', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'tue-2', day: 'Tuesday', startPeriod: 2, span: 1, code: 'HUM 1227', title: 'Technical English', teacher: 'AH / AAM', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'tue-3', day: 'Tuesday', startPeriod: 3, span: 1, code: 'Math 1227', title: 'Differential Equations & Vector', teacher: 'MKH', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'tue-7', day: 'Tuesday', startPeriod: 7, span: 3, code: 'HUM 1228 (Full 60)', title: 'English Language Sessional', teacher: 'AAM', room: 'EL', type: 'Lab', status: 'Scheduled' },

      { id: 'wed-1', day: 'Wednesday', startPeriod: 1, span: 1, code: 'Math 1227', title: 'Differential Equations & Vector', teacher: 'MKH', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'wed-2', day: 'Wednesday', startPeriod: 2, span: 1, code: 'EEE 1287', title: 'Electrical & Electronic Eng.', teacher: 'MFA / ZT', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'wed-3', day: 'Wednesday', startPeriod: 3, span: 1, code: 'HUM 1227', title: 'Technical English', teacher: 'AAM', room: 'Classroom', type: 'Theory', status: 'Scheduled' },
      { id: 'wed-4', day: 'Wednesday', startPeriod: 4, span: 3, code: 'CSE 1288 (2nd 30)', title: 'Computer Programming Sessional', teacher: 'SI / MHA', room: 'CSL', type: 'Lab', status: 'Scheduled' },
      { id: 'wed-7', day: 'Wednesday', startPeriod: 7, span: 3, code: 'EEE 1288 (1st 30)', title: 'EEE Sessional', teacher: 'MFA / ZT', room: 'RAL', type: 'Lab', status: 'Scheduled' },
    ],
    cts: [
      {
        id: 'ct-me-6',
        courseCode: 'ME 1255',
        courseName: 'Basic Mechanical Engineering (MUH)',
        date: '2026-11-28T12:30:00',
        period: 'Period 6 (12:30 PM)',
        room: 'Classroom',
        syllabus: 'Slide a jotodur ache (All topics covered in lecture slides so far).',
      },
      {
        id: 'ct-math-6',
        courseCode: 'Math 1227',
        courseName: 'Mathematics (MAH)',
        date: '2026-11-30T08:50:00',
        period: 'Period 2 (08:50 AM)',
        room: 'Classroom',
        syllabus: 'Last class porjonto ja poriyechen (Everything taught up to the last lecture).',
      },
      {
        id: 'ct-eee-6',
        courseCode: 'EEE 1287',
        courseName: 'Electrical & Electronic Engineering (ZT)',
        date: '2026-12-02T08:50:00',
        period: 'Period 2 (08:50 AM)',
        room: 'Classroom',
        syllabus: 'Syllabus pore janano hbe (Will be announced by ZT sir/madam soon).',
      },
    ],
    assignments: [
      {
        id: 'asg-hum-6',
        courseCode: 'HUM 1227',
        title: 'English (AAM) Reading er PDF Complete kore Joma',
        deadline: '2026-11-29T12:30:00',
        method: 'Class Submission (Period 6)',
        instructions: 'Complete the assigned English reading PDF tasks and submit to AAM on Sunday.',
      },
    ],
  },
};

function formatCountdown(targetIso, now) {
  const diff = new Date(targetIso).getTime() - now;
  if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0, totalHours: 0 };
  const totalSec = Math.floor(diff / 1000);
  return {
    expired: false,
    d: Math.floor(totalSec / 86400),
    h: Math.floor((totalSec % 86400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
    totalHours: diff / 3600000,
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('yb_theme') === 'dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [now, setNow] = useState(Date.now());
  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem('yb_workspaces_v1');
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACES;
  });
  const [activeWsId, setActiveWsId] = useState(() => localStorage.getItem('yb_active_ws') || 'ruet-mte-25');
  const [cloudStatus, setCloudStatus] = useState(isFirebaseConfigured ? 'connecting' : 'local');

  // Personal student progress (private on device)
  const [completedAsgs, setCompletedAsgs] = useState(() => JSON.parse(localStorage.getItem('yb_asg_done') || '{}'));
  const [ctPrep, setCtPrep] = useState(() => JSON.parse(localStorage.getItem('yb_ct_prep') || '{}'));

  // Routine UI states
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(todayName);
  const [routineMode, setRoutineMode] = useState('day'); // 'day' | 'grid'
  const [openSyllabusId, setOpenSyllabusId] = useState(null);

  // Modals & Admin
  const [wsModalOpen, setWsModalOpen] = useState(false);
  const [newWs, setNewWs] = useState({ university: '', department: '', batch: '', crPin: import.meta.env.VITE_CR_SECRET_PIN, days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] });
  const [crUnlocked, setCrUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminSection, setAdminSection] = useState('cts');

  // Admin forms
  const [ctForm, setCtForm] = useState({ courseCode: '', courseName: '', date: '', period: 'Period 1 (08:00 AM)', room: 'Classroom', syllabus: '' });
  const [asgForm, setAsgForm] = useState({ courseCode: '', title: '', deadline: '', method: 'Classroom / CR', instructions: '' });
  const [routineForm, setRoutineForm] = useState({ day: 'Saturday', startPeriod: 1, span: 1, code: '', title: '', teacher: '', room: 'Classroom', type: 'Theory' });

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const currentWs = workspaces[activeWsId] || workspaces['ruet-mte-25'] || Object.values(workspaces)[0];

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('yb_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('yb_workspaces_v1', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('yb_active_ws', activeWsId);
  }, [activeWsId]);

  useEffect(() => {
    localStorage.setItem('yb_asg_done', JSON.stringify(completedAsgs));
  }, [completedAsgs]);

  useEffect(() => {
    localStorage.setItem('yb_ct_prep', JSON.stringify(ctPrep));
  }, [ctPrep]);

  // PWA Install Detection
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(standalone);
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Real-time Firebase Firestore Sync
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsub = onSnapshot(
      collection(db, 'workspaces'),
      (snapshot) => {
        setCloudStatus('synced');
        if (snapshot.empty) {
          // Seed default RUET MTE workspace to Firestore on first run
          Object.values(DEFAULT_WORKSPACES).forEach((ws) => {
            setDoc(doc(db, 'workspaces', ws.id), ws);
          });
        } else {
          const cloudData = {};
          snapshot.forEach((docSnap) => {
            cloudData[docSnap.id] = docSnap.data();
          });
          setWorkspaces((prev) => ({ ...prev, ...cloudData }));
        }
      },
      () => setCloudStatus('offline')
    );
    return () => unsub();
  }, []);

  const saveWorkspaceUpdate = async (updatedWs) => {
    if (updatedWs.id === 'ruet-mte-25' && import.meta.env.VITE_CR_SECRET_PIN) { updatedWs = { ...updatedWs, crPin: import.meta.env.VITE_CR_SECRET_PIN }; }
    setWorkspaces((prev) => ({ ...prev, [updatedWs.id]: updatedWs }));
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'workspaces', updatedWs.id), updatedWs, { merge: true });
      } catch (err) {
        console.error('Cloud sync queued offline:', err);
      }
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowIosGuide(true);
    }
  };

  // Derived upcoming items
  const upcomingCts = useMemo(
    () => [...(currentWs.cts || [])].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [currentWs.cts]
  );
  const upcomingAsgs = useMemo(
    () => [...(currentWs.assignments || [])].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)),
    [currentWs.assignments]
  );

  const nextCt = upcomingCts.find((c) => new Date(c.date).getTime() > now) || upcomingCts[0];
  const nextAsg = upcomingAsgs.find((a) => new Date(a.deadline).getTime() > now) || upcomingAsgs[0];

  const nextClassInfo = useMemo(() => {
    const d = new Date(now);
    const today = dayNames[d.getDay()];
    const curMins = d.getHours() * 60 + d.getMinutes();
    const todayClasses = (currentWs.routine || [])
      .filter((r) => r.day === today && r.status !== 'Cancelled')
      .sort((a, b) => a.startPeriod - b.startPeriod);

    for (const cls of todayClasses) {
      const p = PERIODS.find((item) => item.num === cls.startPeriod);
      if (!p) continue;
      const [sh, sm] = p.start.split(':').map(Number);
      const startMins = sh * 60 + sm;
      if (startMins >= curMins) {
        const target = new Date(d);
        target.setHours(sh, sm, 0, 0);
        return { cls, label: 'Today', targetIso: target.toISOString() };
      }
    }
    const firstNextDay = (currentWs.routine || []).sort((a, b) => a.startPeriod - b.startPeriod)[0];
    return firstNextDay ? { cls: firstNextDay, label: firstNextDay.day, targetIso: null } : null;
  }, [currentWs.routine, now]);

  const timelineItems = useMemo(() => {
    const items = [
      ...upcomingCts.map((c) => ({
        id: c.id,
        kind: 'CT',
        code: c.courseCode,
        title: c.courseName,
        time: c.date,
        meta: `${c.period} • ${c.room}`,
        detail: c.syllabus,
      })),
      ...upcomingAsgs.map((a) => ({
        id: a.id,
        kind: 'Assignment',
        code: a.courseCode,
        title: a.title,
        time: a.deadline,
        meta: a.method,
        detail: a.instructions,
      })),
    ];
    return items.sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [upcomingCts, upcomingAsgs]);

  const pendingAsgCount = upcomingAsgs.filter((a) => !completedAsgs[a.id]).length;

  const createWorkspace = async (e) => {
    e.preventDefault();
    if (!newWs.university.trim() || !newWs.department.trim()) return;
    const id = `${newWs.university}-${newWs.department}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id,
      university: newWs.university.trim(),
      department: newWs.department.trim(),
      batch: newWs.batch.trim() || 'Batch 1',
      crPin: newWs.crPin.trim() || '2026',
      workingDays: newWs.days.length ? newWs.days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      tickerText: `@all Welcome to ${newWs.university.trim()} ${newWs.department.trim()} tracker! CR can update schedules from the CR Portal.`,
      urgentNotice: '',
      routine: [],
      cts: [],
      assignments: [],
    };
    await saveWorkspaceUpdate(created);
    setActiveWsId(id);
    setWsModalOpen(false);
    setNewWs({ university: '', department: '', batch: '', crPin: import.meta.env.VITE_CR_SECRET_PIN, days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] });
  };

  const bgMain = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm';
  const mutedText = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen pb-24 md:pb-8 transition-colors ${bgMain}`}>
      <style>{`
        @keyframes ybMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .yb-marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ybMarquee 24s linear infinite;
        }
        .yb-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Top Navigation Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${darkMode ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 h-15 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/favicon.svg" alt="YourBuddy" className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base">YourBuddy</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  cloudStatus === 'synced'
                    ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-amber-500/15 text-amber-500'
                }`}>
                  {cloudStatus === 'synced' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {cloudStatus === 'synced' ? 'Live Sync' : 'Local Mode'}
                </span>
              </div>

            <div className="mt-6">
              <LabPrintingSection
                labPrinting={currentWs.labPrinting}
                editable={true}
                onSaveLabPrinting={(labPrinting) => saveWorkspaceUpdate({ ...currentWs, labPrinting })}
              />
            </div>
              <button
                onClick={() => setWsModalOpen(true)}
                className={`flex items-center gap-1 text-xs truncate max-w-[210px] sm:max-w-xs ${mutedText} hover:text-indigo-500`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentWs.university} • {currentWs.department} ({currentWs.batch})</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Overview' },
              { id: 'routine', label: 'Routine' },
              { id: 'cts', label: 'CTs & Exams' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'admin', label: 'CR Portal' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : `${mutedText} hover:bg-indigo-500/10`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isStandalone && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
            <button
              onClick={() => setWsModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
              title="Switch or Create University/Department"
            >
              + Dept
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* One-Line Moving CR Ticker on Home */}
      {activeTab === 'dashboard' && currentWs.tickerText && (
        <div className="bg-indigo-600 text-white overflow-hidden py-1.5 border-b border-indigo-500">
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold uppercase tracking-wider shrink-0">
              <Megaphone className="w-3 h-3" /> CR Live
            </span>
            <div className="overflow-hidden flex-1">
              <div className="yb-marquee-track text-xs sm:text-sm font-medium">
                <span className="pr-12">{currentWs.tickerText}</span>
                <span className="pr-12">{currentWs.tickerText}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 pt-5 space-y-6">
        {/* Urgent CR Notice Banner */}
        {currentWs.urgentNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{currentWs.urgentNotice}</div>
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 3 Live Countdown Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Next Class */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Next Class / Lab</span>
                  <Clock className="w-4 h-4 text-indigo-500" />
                </div>
                {nextClassInfo ? (
                  <>
                    <div className="font-bold text-lg">{nextClassInfo.cls.code} <span className="text-xs font-normal opacity-75">({nextClassInfo.cls.teacher})</span></div>
                    <p className={`text-xs mb-3 ${mutedText}`}>
                      {nextClassInfo.label} • Period {nextClassInfo.cls.startPeriod} • {nextClassInfo.cls.room}
                    </p>
                    {nextClassInfo.targetIso ? (
                      <CountdownBoxes targetIso={nextClassInfo.targetIso} now={now} darkMode={darkMode} />
                    ) : (
                      <div className="text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        Classes done for today • Next on {nextClassInfo.label}
                      </div>
                    )}
                  </>
                ) : (
                  <p className={`text-sm ${mutedText}`}>No routine added yet.</p>
                )}
              </div>

              {/* Next Upcoming CT */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">Next Upcoming CT</span>
                  <BookOpen className="w-4 h-4 text-rose-500" />
                </div>
                {nextCt ? (
                  <>
                    <div className="font-bold text-lg truncate">{nextCt.courseCode} — {nextCt.courseName}</div>
                    <p className={`text-xs mb-3 ${mutedText}`}>
                      {new Date(nextCt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {nextCt.period}
                    </p>
                    <CountdownBoxes targetIso={nextCt.date} now={now} darkMode={darkMode} accent="rose" />
                  </>
                ) : (
                  <p className={`text-sm ${mutedText}`}>No upcoming CTs scheduled.</p>
                )}
              </div>

              {/* Nearest Assignment */}
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Nearest Assignment</span>
                  <FileText className="w-4 h-4 text-emerald-500" />
                </div>
                {nextAsg ? (
                  <>
                    <div className="font-bold text-lg truncate">{nextAsg.courseCode} — {nextAsg.title}</div>
                    <p className={`text-xs mb-3 ${mutedText}`}>
                      Due {new Date(nextAsg.deadline).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {nextAsg.method}
                    </p>
                    <CountdownBoxes targetIso={nextAsg.deadline} now={now} darkMode={darkMode} accent="emerald" />
                  </>
                ) : (
                  <p className={`text-sm ${mutedText}`}>No pending assignments.</p>
                )}
              </div>
            </div>

            {/* Quick Personal Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3.5 rounded-xl border ${cardBg}`}>
                <div className={`text-xs ${mutedText}`}>Upcoming CTs</div>
                <div className="text-2xl font-bold mt-1">{upcomingCts.length}</div>
              </div>
              <div className={`p-3.5 rounded-xl border ${cardBg}`}>
                <div className={`text-xs ${mutedText}`}>Pending Assignments</div>
                <div className="text-2xl font-bold mt-1 text-amber-500">{pendingAsgCount}</div>
              </div>
              <div className={`p-3.5 rounded-xl border ${cardBg}`}>
                <div className={`text-xs ${mutedText}`}>CTs Prepared</div>
                <div className="text-2xl font-bold mt-1 text-emerald-500">
                  {upcomingCts.filter((c) => ctPrep[c.id] === 'Prepared').length}/{upcomingCts.length}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border ${cardBg}`}>
                <div className={`text-xs ${mutedText}`}>Working Days</div>
                <div className="text-sm font-bold mt-2 truncate">{currentWs.workingDays.slice(0, 2).join(' – ')}... ({currentWs.workingDays.length}d)</div>
              </div>
            </div>

            {/* Chronological Timeline */}
                    <div className="mb-6">
          <LabPrintingSection
            labPrinting={currentWs.labPrinting}
            editable={false}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        </div>

<div className={`p-5 rounded-2xl border ${cardBg}`}>
              <h2 className="font-bold text-base mb-4">Upcoming Academic Roadmap (6th Week & Beyond)</h2>
              {timelineItems.length === 0 ? (
                <p className={`text-sm ${mutedText}`}>Nothing scheduled yet. CR can add CTs and assignments in the CR Portal.</p>
              ) : (
                <div className="space-y-4 border-l-2 border-indigo-500/30 pl-4 ml-1">
                  {timelineItems.map((item) => {
                    const cd = formatCountdown(item.time, now);
                    const badgeColor = cd.expired
                      ? 'bg-slate-500/15 text-slate-500'
                      : cd.totalHours < 24
                      ? 'bg-rose-500/15 text-rose-500'
                      : cd.totalHours < 72
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-indigo-500/15 text-indigo-500';

                    return (
                      <div key={item.id} className="relative">
                        <span className={`w-3 h-3 rounded-full absolute -left-[23px] top-1.5 ${item.kind === 'CT' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded mr-2 ${item.kind === 'CT' ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                              {item.kind}
                            </span>
                            <span className="font-bold text-sm">{item.code}: {item.title}</span>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                            {cd.expired ? 'Passed' : `${cd.d}d ${cd.h}h ${cd.m}m left`}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${mutedText}`}>
                          {new Date(item.time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {item.meta}
                        </p>
                        {item.detail && <p className="text-xs mt-1 opacity-85">{item.detail}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WEEKLY ROUTINE */}
        {activeTab === 'routine' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-lg">Weekly Class & Lab Routine</h2>
                <p className={`text-xs ${mutedText}`}>{currentWs.university} • {currentWs.department}</p>
              </div>
              <div className="flex rounded-lg border border-slate-500/20 p-1 text-xs font-medium">
                <button
                  onClick={() => setRoutineMode('day')}
                  className={`px-3 py-1 rounded-md ${routineMode === 'day' ? 'bg-indigo-600 text-white' : mutedText}`}
                >
                  Day View
                </button>
                <button
                  onClick={() => setRoutineMode('grid')}
                  className={`px-3 py-1 rounded-md ${routineMode === 'grid' ? 'bg-indigo-600 text-white' : mutedText}`}
                >
                  Full 9-Period Grid
                </button>
              </div>
            </div>

            {routineMode === 'day' ? (
              <>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {currentWs.workingDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
                        selectedDay === day
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : `${cardBg} ${mutedText}`
                      }`}
                    >
                      {day} {day === todayName ? '(Today)' : ''}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {(currentWs.routine || [])
                    .filter((r) => r.day === selectedDay)
                    .sort((a, b) => a.startPeriod - b.startPeriod)
                    .map((slot) => {
                      const pStart = PERIODS.find((p) => p.num === slot.startPeriod);
                      const pEnd = PERIODS.find((p) => p.num === slot.startPeriod + (slot.span || 1) - 1);
                      return (
                        <div key={slot.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${cardBg}`}>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base">{slot.code}</span>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                slot.type === 'Lab' ? 'bg-purple-500/15 text-purple-500' : 'bg-sky-500/15 text-sky-500'
                              }`}>
                                {slot.type} ({slot.span > 1 ? `P${slot.startPeriod}-P${slot.startPeriod + slot.span - 1}` : `P${slot.startPeriod}`})
                              </span>
                              {slot.status && slot.status !== 'Scheduled' && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-semibold">
                                  {slot.status}
                                </span>
                              )}
                            </div>
                            <div className={`text-xs mt-1 ${mutedText}`}>{slot.title}</div>
                            <div className="text-xs font-medium mt-1.5">
                              Teacher: <span className="text-indigo-500">{slot.teacher}</span> • Room: <span className="font-semibold">{slot.room}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold">{pStart?.start}</div>
                            <div className={`text-[11px] ${mutedText}`}>to {pEnd?.end}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              <div className={`overflow-x-auto rounded-2xl border ${cardBg}`}>
                <table className="w-full text-xs border-collapse min-w-[820px]">
                  <thead>
                    <tr className={darkMode ? 'bg-slate-800/80' : 'bg-slate-100'}>
                      <th className="p-2.5 border border-slate-500/20 text-left">Day / Period</th>
                      {PERIODS.map((p) => (
                        <th key={p.num} className="p-2 border border-slate-500/20 text-center">
                          <div className="font-bold">{p.label}</div>
                          <div className="text-[10px] font-normal opacity-75">{p.time}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentWs.workingDays.map((day) => {
                      const daySlots = (currentWs.routine || []).filter((r) => r.day === day);
                      const cells = [];
                      let p = 1;
                      while (p <= 9) {
                        const match = daySlots.find((s) => Number(s.startPeriod) === p);
                        if (match) {
                          const span = Math.min(Number(match.span) || 1, 10 - p);
                          cells.push(
                            <td
                              key={p}
                              colSpan={span}
                              className={`p-2 border border-slate-500/20 text-center ${
                                match.type === 'Lab' ? 'bg-purple-500/10' : 'bg-indigo-500/5'
                              }`}
                            >
                              <div className="font-bold">{match.code}</div>
                              <div className="text-[11px] text-indigo-500 font-medium">{match.teacher}</div>
                              {match.room !== 'Classroom' && <div className="text-[10px] opacity-75">({match.room})</div>}
                            </td>
                          );
                          p += span;
                        } else {
                          cells.push(<td key={p} className="p-2 border border-slate-500/20 text-center opacity-30">—</td>);
                          p += 1;
                        }
                      }
                      return (
                        <tr key={day}>
                          <td className="p-2.5 border border-slate-500/20 font-bold">{day}</td>
                          {cells}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeWsId === 'ruet-mte-25' && (
              <div className={`p-4 rounded-2xl border ${cardBg}`}>
                <h3 className="font-bold text-sm mb-2">Faculty & Lab Legend (RUET MTE 25)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {FACULTY_LEGEND.map((f) => (
                    <div key={f.code} className="flex items-center gap-2">
                      <span className="font-bold text-indigo-500 w-10">{f.code}</span>
                      <span className={mutedText}>{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLASS TESTS (CTs) */}
        {activeTab === 'cts' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Class Test (CT) & Exam Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingCts.map((ct) => {
                const status = ctPrep[ct.id] || 'Not Started';
                return (
                  <div key={ct.id} className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">{ct.courseCode}</span>
                        <h3 className="font-bold text-base mt-1">{ct.courseName}</h3>
                        <p className={`text-xs ${mutedText}`}>
                          {new Date(ct.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {ct.period} • {ct.room}
                        </p>
                      </div>
                    </div>

                    <CountdownBoxes targetIso={ct.date} now={now} darkMode={darkMode} accent="rose" />

                    <div>
                      <button
                        onClick={() => setOpenSyllabusId(openSyllabusId === ct.id ? null : ct.id)}
                        className="text-xs font-semibold text-indigo-500 hover:underline"
                      >
                        {openSyllabusId === ct.id ? 'Hide Syllabus ▲' : 'View Syllabus ▼'}
                      </button>
                      {openSyllabusId === ct.id && (
                        <div className={`mt-2 p-3 rounded-xl text-xs ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          {ct.syllabus}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-500/15 flex items-center justify-between gap-2">
                      <span className={`text-xs ${mutedText}`}>My Prep (Private):</span>
                      <div className="flex gap-1">
                        {['Not Started', 'Studying', 'Prepared'].map((st) => (
                          <button
                            key={st}
                            onClick={() => setCtPrep((prev) => ({ ...prev, [ct.id]: st }))}
                            className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                              status === st
                                ? st === 'Prepared'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'Studying'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-600 text-white'
                                : 'bg-slate-500/10 opacity-75'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Assignment & Submission Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAsgs.map((asg) => {
                const done = Boolean(completedAsgs[asg.id]);
                return (
                  <div key={asg.id} className={`p-4 rounded-2xl border space-y-3 ${cardBg} ${done ? 'opacity-70' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">{asg.courseCode}</span>
                        <h3 className={`font-bold text-base mt-1 ${done ? 'line-through' : ''}`}>{asg.title}</h3>
                        <p className={`text-xs ${mutedText}`}>
                          Due: {new Date(asg.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {asg.method}
                        </p>
                      </div>
                      <button
                        onClick={() => setCompletedAsgs((prev) => ({ ...prev, [asg.id]: !done }))}
                        className={`p-1.5 rounded-xl border transition ${
                          done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-500/30'
                        }`}
                        title="Mark completed on your device"
                      >
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                    </div>
                    {asg.instructions && <p className="text-xs">{asg.instructions}</p>}
                    <CountdownBoxes targetIso={asg.deadline} now={now} darkMode={darkMode} accent="emerald" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CR ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            {!crUnlocked ? (
              <div className="max-w-sm mx-auto py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 text-indigo-500 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-lg">CR Admin Portal</h2>
                <p className={`text-xs ${mutedText}`}>
                  Enter the Class Representative PIN for <strong>{currentWs.university} {currentWs.department}</strong> to push live updates to all students. (Default PIN: <code>2026</code>)
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const activePin = (currentWs.id === 'ruet-mte-25' && import.meta.env.VITE_CR_SECRET_PIN) ? import.meta.env.VITE_CR_SECRET_PIN : currentWs.crPin;
                    if (pinInput === activePin) {
                      setCrUnlocked(true);
                      setPinError('');
                    } else {
                      setPinError('Incorrect CR PIN.');
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter CR PIN"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-center tracking-widest font-bold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                  {pinError && <p className="text-xs text-rose-500">{pinError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm">
                    Unlock CR Controls
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-500/20">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-base">CR Live Editor ({currentWs.department})</span>
                  </div>
                  <button onClick={() => setCrUnlocked(false)} className="text-xs text-rose-500 font-semibold">Lock Portal</button>
                </div>

                {/* Admin Sub-Navigation */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'cts', label: 'Manage CTs' },
                    { id: 'assignments', label: 'Manage Assignments' },
                    { id: 'routine', label: 'Manage Routine' },
                    { id: 'notices', label: 'Ticker & Notice' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setAdminSection(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        adminSection === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-500/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Admin: Manage CTs */}
                {adminSection === 'cts' && (
                  <div className="space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!ctForm.courseCode || !ctForm.date) return;
                        const updated = {
                          ...currentWs,
                          cts: [...currentWs.cts, { id: `ct-${Date.now()}`, ...ctForm }],
                        };
                        saveWorkspaceUpdate(updated);
                        setCtForm({ courseCode: '', courseName: '', date: '', period: 'Period 1 (08:00 AM)', room: 'Classroom', syllabus: '' });
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <input required placeholder="Course Code (e.g. ME 1255)" value={ctForm.courseCode} onChange={(e) => setCtForm({ ...ctForm, courseCode: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input required placeholder="Course / Teacher (e.g. Mechanics - MUH)" value={ctForm.courseName} onChange={(e) => setCtForm({ ...ctForm, courseName: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input required type="datetime-local" value={ctForm.date} onChange={(e) => setCtForm({ ...ctForm, date: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Period & Room (e.g. Period 6 • Classroom)" value={ctForm.period} onChange={(e) => setCtForm({ ...ctForm, period: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Syllabus details" value={ctForm.syllabus} onChange={(e) => setCtForm({ ...ctForm, syllabus: e.target.value })} className={`sm:col-span-2 px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <button type="submit" className="sm:col-span-2 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" /> Add CT & Sync Live
                      </button>
                    </form>
                    <div className="space-y-2">
                      {currentWs.cts.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-lg border border-slate-500/20 flex items-center justify-between text-xs">
                          <span><strong>{c.courseCode}</strong> — {c.courseName} ({new Date(c.date).toLocaleDateString()})</span>
                          <button onClick={() => saveWorkspaceUpdate({ ...currentWs, cts: currentWs.cts.filter((x) => x.id !== c.id) })} className="text-rose-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin: Manage Assignments */}
                {adminSection === 'assignments' && (
                  <div className="space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!asgForm.courseCode || !asgForm.deadline) return;
                        saveWorkspaceUpdate({
                          ...currentWs,
                          assignments: [...currentWs.assignments, { id: `asg-${Date.now()}`, ...asgForm }],
                        });
                        setAsgForm({ courseCode: '', title: '', deadline: '', method: 'Classroom / CR', instructions: '' });
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <input required placeholder="Course Code (e.g. HUM 1227)" value={asgForm.courseCode} onChange={(e) => setAsgForm({ ...asgForm, courseCode: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input required placeholder="Assignment Title" value={asgForm.title} onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input required type="datetime-local" value={asgForm.deadline} onChange={(e) => setAsgForm({ ...asgForm, deadline: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Submission Method" value={asgForm.method} onChange={(e) => setAsgForm({ ...asgForm, method: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Instructions" value={asgForm.instructions} onChange={(e) => setAsgForm({ ...asgForm, instructions: e.target.value })} className={`sm:col-span-2 px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <button type="submit" className="sm:col-span-2 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" /> Add Assignment & Sync Live
                      </button>
                    </form>
                    <div className="space-y-2">
                      {currentWs.assignments.map((a) => (
                        <div key={a.id} className="p-2.5 rounded-lg border border-slate-500/20 flex items-center justify-between text-xs">
                          <span><strong>{a.courseCode}</strong> — {a.title}</span>
                          <button onClick={() => saveWorkspaceUpdate({ ...currentWs, assignments: currentWs.assignments.filter((x) => x.id !== a.id) })} className="text-rose-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin: Manage Routine */}
                {adminSection === 'routine' && (
                  <div className="space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!routineForm.code) return;
                        saveWorkspaceUpdate({
                          ...currentWs,
                          routine: [...currentWs.routine, { id: `rt-${Date.now()}`, ...routineForm, startPeriod: Number(routineForm.startPeriod), span: Number(routineForm.span), status: 'Scheduled' }],
                        });
                        setRoutineForm({ day: 'Saturday', startPeriod: 1, span: 1, code: '', title: '', teacher: '', room: 'Classroom', type: 'Theory' });
                      }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                    >
                      <select value={routineForm.day} onChange={(e) => setRoutineForm({ ...routineForm, day: e.target.value })} className={`px-2.5 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                        {currentWs.workingDays.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select value={routineForm.startPeriod} onChange={(e) => setRoutineForm({ ...routineForm, startPeriod: Number(e.target.value) })} className={`px-2.5 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                        {PERIODS.map((p) => <option key={p.num} value={p.num}>Start Period {p.num}</option>)}
                      </select>
                      <select value={routineForm.span} onChange={(e) => setRoutineForm({ ...routineForm, span: Number(e.target.value) })} className={`px-2.5 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                        <option value={1}>1 Period (Theory)</option>
                        <option value={3}>3 Periods (Lab)</option>
                      </select>
                      <select value={routineForm.type} onChange={(e) => setRoutineForm({ ...routineForm, type: e.target.value })} className={`px-2.5 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                        <option value="Theory">Theory</option>
                        <option value="Lab">Lab</option>
                      </select>
                      <input required placeholder="Course Code" value={routineForm.code} onChange={(e) => setRoutineForm({ ...routineForm, code: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Course Title" value={routineForm.title} onChange={(e) => setRoutineForm({ ...routineForm, title: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Teacher Initials" value={routineForm.teacher} onChange={(e) => setRoutineForm({ ...routineForm, teacher: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <input placeholder="Room (e.g. HEL, RAL)" value={routineForm.room} onChange={(e) => setRoutineForm({ ...routineForm, room: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                      <button type="submit" className="col-span-2 sm:col-span-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">Add Class Slot</button>
                    </form>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {currentWs.routine.map((r) => (
                        <div key={r.id} className="p-2.5 rounded-lg border border-slate-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span><strong>{r.day} P{r.startPeriod}:</strong> {r.code} ({r.teacher})</span>
                          <div className="flex items-center gap-2">
                            <select
                              value={r.status || 'Scheduled'}
                              onChange={(e) => {
                                const updated = currentWs.routine.map((item) => item.id === r.id ? { ...item, status: e.target.value } : item);
                                saveWorkspaceUpdate({ ...currentWs, routine: updated });
                              }}
                              className={`px-2 py-1 rounded border text-[11px] ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Rescheduled">Rescheduled</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button onClick={() => saveWorkspaceUpdate({ ...currentWs, routine: currentWs.routine.filter((x) => x.id !== r.id) })} className="text-rose-500 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin: Moving Ticker & Urgent Notice */}
                {adminSection === 'notices' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Top Moving Ticker Line (Home Page Marquee)</label>
                      <input
                        value={currentWs.tickerText || ''}
                        onChange={(e) => saveWorkspaceUpdate({ ...currentWs, tickerText: e.target.value })}
                        placeholder="Type live moving headline for all students..."
                        className={`w-full px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Pinned Urgent Banner (Leave blank to hide)</label>
                      <input
                        value={currentWs.urgentNotice || ''}
                        onChange={(e) => saveWorkspaceUpdate({ ...currentWs, urgentNotice: e.target.value })}
                        placeholder="e.g. Tomorrow 2nd period room changed..."
                        className={`w-full px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
              <AppFooter />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md grid grid-cols-5 py-1.5 ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        {[
          { id: 'dashboard', label: 'Home', icon: Calendar },
          { id: 'routine', label: 'Routine', icon: Clock },
          { id: 'cts', label: 'CTs', icon: BookOpen },
          { id: 'assignments', label: 'Tasks', icon: CheckCircle2 },
          { id: 'admin', label: 'CR', icon: Shield },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 text-[10px] font-semibold ${
                active ? 'text-indigo-500' : mutedText
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Multi-University / Multi-Department Switcher & Creator Modal */}
      {wsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-5 space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> University & Dept Workspaces</h3>
              <button onClick={() => setWsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2">
              {Object.values(workspaces).map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { setActiveWsId(ws.id); setWsModalOpen(false); setCrUnlocked(false); }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                    ws.id === activeWsId ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-500/20'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{ws.university} — {ws.department}</div>
                    <div className={`text-xs ${mutedText}`}>{ws.batch}</div>
                  </div>
                  {ws.id === activeWsId && <Check className="w-4 h-4 text-indigo-500" />}
                </button>
              ))}
            </div>

            <form onSubmit={createWorkspace} className="pt-3 border-t border-slate-500/20 space-y-2.5">
              <div className="font-bold text-xs uppercase tracking-wider text-indigo-500">Create New Dept Tracker</div>
              <input required placeholder="University (e.g. RUET, BUET, KUET, DU)" value={newWs.university} onChange={(e) => setNewWs({ ...newWs, university: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
              <input required placeholder="Department (e.g. CSE, EEE, MTE)" value={newWs.department} onChange={(e) => setNewWs({ ...newWs, department: e.target.value })} className={`w-full px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Batch / Sem (e.g. 25 Series)" value={newWs.batch} onChange={(e) => setNewWs({ ...newWs, batch: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                <input placeholder="Set CR Admin PIN" value={newWs.crPin} onChange={(e) => setNewWs({ ...newWs, crPin: e.target.value })} className={`px-3 py-2 rounded-lg border text-xs ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                Create & Launch Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* iPhone / Android Install Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border p-5 space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2"><Smartphone className="w-4 h-4 text-indigo-500" /> Install YourBuddy App</h3>
              <button onClick={() => setShowIosGuide(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <p><strong>On iPhone (Safari):</strong> Tap the <Share className="w-3.5 h-3.5 inline text-indigo-500" /> <strong>Share</strong> icon at the bottom of Safari, scroll down, and tap <strong>Add to Home Screen</strong>.</p>
              <p><strong>On Android (Chrome):</strong> Tap the <strong>⋮ menu</strong> in the top-right corner and tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
            </div>
            <button onClick={() => setShowIosGuide(false)} className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">Got It</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownBoxes({ targetIso, now, darkMode, accent = 'indigo' }) {
  const cd = formatCountdown(targetIso, now);
  if (cd.expired) {
    return <div className="text-xs font-semibold text-slate-400">Completed / Time Reached</div>;
  }
  const colorMap = {
    indigo: 'text-indigo-500',
    rose: 'text-rose-500',
    emerald: 'text-emerald-500',
  };
  return (
    <div className="grid grid-cols-4 gap-1.5 text-center">
      {[
        { val: cd.d, unit: 'Days' },
        { val: cd.h, unit: 'Hrs' },
        { val: cd.m, unit: 'Mins' },
        { val: cd.s, unit: 'Secs' },
      ].map((b) => (
        <div key={b.unit} className={`py-1.5 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className={`text-sm font-bold tabular-nums ${colorMap[accent]}`}>{String(b.val).padStart(2, '0')}</div>
          <div className="text-[10px] opacity-70">{b.unit}</div>
        </div>
      ))}
    </div>
  );
}