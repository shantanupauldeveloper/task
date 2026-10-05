import { useState } from 'react';
import { toInputValue } from '../utils';

const field = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white';

export default function TaskForm({ task, defaultDate, onSave, onDelete, onClose }) {
  const [f, setF] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueAt: task ? toInputValue(task.dueAt) : toInputValue((defaultDate || new Date()).toISOString()),
    priority: task?.priority || 'Medium',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return setError('Title is required');
    if (!f.dueAt) return setError('Date & time is required');
    setSaving(true);
    try {
      await onSave({ ...f, title: f.title.trim(), dueAt: new Date(f.dueAt).toISOString() });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 sm:rounded-3xl">
        <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Add Task'}</h2>
        <label className="block text-sm font-medium">Title *
          <input autoFocus className={`${field} mt-1`} value={f.title} onChange={set('title')} maxLength={120} placeholder="What needs to be done?" />
        </label>
        <label className="block text-sm font-medium">Description
          <textarea className={`${field} mt-1`} rows={3} value={f.description} onChange={set('description')} placeholder="Optional details" />
        </label>
        <label className="block text-sm font-medium">Date & Time *
          <input type="datetime-local" className={`${field} mt-1`} value={f.dueAt} onChange={set('dueAt')} />
        </label>
        <div>
          <p className="mb-1 text-sm font-medium">Priority</p>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button type="button" key={p} onClick={() => setF({ ...f, priority: p })}
                className={`rounded-xl border py-2 text-sm font-medium ${f.priority === p ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 text-gray-600'}`}>{p}</button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {task && <button type="button" onClick={() => onDelete(task)} className="w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600">Delete task</button>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-600">Cancel</button>
          <button disabled={saving} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
