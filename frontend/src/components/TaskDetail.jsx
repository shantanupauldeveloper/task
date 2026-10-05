import { fmtDateTime } from '../utils';

export default function TaskDetail({ task, onEdit, onDelete, onToggle, onClose }) {
  const done = task.status === 'Completed';
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-t-3xl bg-white p-5 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className={`text-lg font-semibold ${done ? 'line-through text-gray-400' : ''}`}>{task.title}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">{task.priority}</span>
        </div>
        {task.description && <p className="whitespace-pre-wrap text-sm text-gray-600">{task.description}</p>}
        <p className="text-sm text-gray-400">{fmtDateTime(task.dueAt)} · {task.status}</p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button onClick={() => onEdit(task)} className="rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white">Edit</button>
          <button onClick={() => { onToggle(task); onClose(); }} className="rounded-xl border border-gray-200 py-2.5 text-sm font-medium">{done ? 'Reopen' : 'Complete'}</button>
          <button onClick={() => { onDelete(task); onClose(); }} className="rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
