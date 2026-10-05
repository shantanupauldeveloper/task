import { useRef, useState } from 'react';
import { fmtDateTime } from '../utils';

const PRIORITY = {
  High: 'bg-red-100 text-red-600',
  Medium: 'bg-amber-100 text-amber-600',
  Low: 'bg-emerald-100 text-emerald-600',
};
const REVEAL = 88;

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [dx, setDx] = useState(0);
  const start = useRef(null);
  const moved = useRef(false);
  const done = task.status === 'Completed';

  const down = (e) => { start.current = { x: e.clientX, base: dx }; moved.current = false; };
  const move = (e) => {
    if (!start.current) return;
    const d = e.clientX - start.current.x;
    if (Math.abs(d) > 5) moved.current = true;
    setDx(Math.max(-REVEAL, Math.min(0, start.current.base + d)));
  };
  const up = () => {
    if (!start.current) return;
    start.current = null;
    setDx((v) => (v < -REVEAL / 2 ? -REVEAL : 0));
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <button
        onClick={() => onDelete(task)}
        style={{ visibility: dx < 0 ? 'visible' : 'hidden' }}
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-red-500 text-sm font-semibold text-white"
      >
        Delete
      </button>
      <div
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
        style={{ transform: `translateX(${dx}px)`, touchAction: 'pan-y' }}
        className={`relative flex items-start gap-3 bg-white p-3 transition-transform ${start.current ? '' : 'duration-200'}`}
      >
        <button
          aria-label={done ? 'Mark in progress' : 'Mark completed'}
          onClick={() => onToggle(task)}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}
        >
          {done && <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 14.4 3.6 10l1.4-1.4 3 3 7-7L16.4 6z" /></svg>}
        </button>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => !moved.current && (dx ? setDx(0) : onEdit(task))}>
          <div className="flex items-center gap-2">
            <p className={`truncate font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY[task.priority]}`}>{task.priority}</span>
          </div>
          {task.description && <p className="truncate text-sm text-gray-500">{task.description}</p>}
          <p className="mt-1 text-xs text-gray-400">{fmtDateTime(task.dueAt)}</p>
        </div>
      </div>
    </div>
  );
}
