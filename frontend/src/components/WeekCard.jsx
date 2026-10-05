import { useState } from 'react';
import { weekLabel } from '../utils';
import TaskItem from './TaskItem';

export default function WeekCard({ week, isCurrent, onAdd, ...handlers }) {
  const [open, setOpen] = useState(isCurrent);
  const done = week.tasks.filter((t) => t.status === 'Completed').length;
  const pct = Math.round((done / week.tasks.length) * 100);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full text-left" aria-expanded={open}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            {weekLabel(week.start)}
            {isCurrent && <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] text-indigo-600">This week</span>}
          </h2>
          <svg viewBox="0 0 20 20" className={`h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="currentColor"><path d="M5.3 7.3 10 12l4.7-4.7 1.4 1.4L10 14.8 3.9 8.7z" /></svg>
        </div>
        <div className="mt-3 flex gap-3 text-sm">
          <span className="rounded-lg bg-amber-50 px-3 py-1 font-medium text-amber-700">{week.tasks.length - done} Open</span>
          <span className="rounded-lg bg-emerald-50 px-3 py-1 font-medium text-emerald-700">{done} Completed</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </button>
      {open && (
        <div className="mt-4 space-y-2">
          {week.tasks.map((t) => <TaskItem key={t._id} task={t} {...handlers} />)}
          <button onClick={() => onAdd(week)} className="w-full rounded-xl border border-dashed border-indigo-300 py-2 text-sm font-medium text-indigo-600">+ Add task to this week</button>
        </div>
      )}
    </section>
  );
}
