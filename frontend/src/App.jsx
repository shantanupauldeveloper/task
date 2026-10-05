import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, listTasks, updateTask } from './api';
import { groupByWeek, weekStart } from './utils';
import WeekCard from './components/WeekCard';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null); // null | {} (new) | task (edit)
  const [detail, setDetail] = useState(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const load = useCallback(async () => {
    try { setTasks(await listTasks()); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  // debounced server-side search
  useEffect(() => {
    if (!searching || !query.trim()) return setResults([]);
    const id = setTimeout(() => listTasks(query.trim()).then(setResults).catch((e) => setError(e.message)), 250);
    return () => clearTimeout(id);
  }, [query, searching, tasks]);

  const weeks = useMemo(() => groupByWeek(tasks), [tasks]);
  const currentKey = weekStart(new Date()).getTime();

  const handlers = {
    onToggle: async (t) => {
      const status = t.status === 'Completed' ? 'In Progress' : 'Completed';
      setTasks((ts) => ts.map((x) => (x._id === t._id ? { ...x, status } : x))); // optimistic
      try { await updateTask(t._id, { status }); } catch (e) { setError(e.message); load(); }
    },
    onEdit: (t) => { setDetail(null); setForm(t); },
    onDelete: async (t) => {
      setTasks((ts) => ts.filter((x) => x._id !== t._id));
      try { await deleteTask(t._id); } catch (e) { setError(e.message); load(); }
    },
  };
  const removeFromForm = (t) => { setForm(null); handlers.onDelete(t); };
  // new task in a week: today if it's the current week, otherwise that week's Monday at 9:00
  const addToWeek = (w) => {
    const d = new Date(w.start); d.setHours(9, 0, 0, 0);
    setForm({ defaultDate: w.key === currentKey ? new Date() : d });
  };

  const save = async (data) => {
    if (form._id) await updateTask(form._id, data); else await createTask(data);
    setForm(null);
    await load();
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#f3f4f8] pb-28">
      <header className="sticky top-0 z-10 bg-[#f3f4f8]/90 px-4 pb-3 pt-6 backdrop-blur">
        {searching ? (
          <div className="flex items-center gap-2">
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
            <button onClick={() => { setSearching(false); setQuery(''); }} className="text-sm font-medium text-indigo-600">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-sm text-gray-500">{tasks.filter((t) => t.status !== 'Completed').length} open · {tasks.filter((t) => t.status === 'Completed').length} done</p>
            </div>
            <button aria-label="Search" onClick={() => setSearching(true)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
          </div>
        )}
      </header>

      <main className="space-y-3 px-4">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {searching ? (
          query.trim() === '' ? <p className="py-16 text-center text-sm text-gray-400">Type to search by title or description</p>
          : results.length === 0 ? <p className="py-16 text-center text-sm text-gray-400">No tasks match “{query}”</p>
          : results.map((t) => <TaskItem key={t._id} task={t} {...handlers} onEdit={setDetail} />)
        ) : loading ? (
          <p className="py-16 text-center text-sm text-gray-400">Loading…</p>
        ) : weeks.length === 0 ? (
          <div className="py-20 text-center text-gray-400"><p className="text-4xl">📝</p><p className="mt-2">No tasks yet. Tap “Add Task” to start.</p></div>
        ) : (
          weeks.map((w) => <WeekCard key={w.key} week={w} isCurrent={w.key === currentKey} onAdd={addToWeek} {...handlers} />)
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md bg-gradient-to-t from-[#f3f4f8] via-[#f3f4f8] to-transparent p-4 pt-8">
        <button onClick={() => setForm({})} className="w-full rounded-2xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 active:scale-[0.99]">+ Add Task</button>
      </div>

      {form && <TaskForm task={form._id ? form : null} defaultDate={form.defaultDate} onSave={save} onDelete={removeFromForm} onClose={() => setForm(null)} />}
      {detail && <TaskDetail task={detail} onClose={() => setDetail(null)} {...handlers} />}
    </div>
  );
}
