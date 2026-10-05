const DAY = 86400000;

export function weekStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
}

const fmt = (d, o) => d.toLocaleDateString('en-US', o);

export function weekLabel(start) {
  const end = new Date(start.getTime() + 6 * DAY);
  const sameMonth = start.getMonth() === end.getMonth();
  return `${fmt(start, { month: 'short', day: 'numeric' })} – ${fmt(end, sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' })}`;
}

export function groupByWeek(tasks) {
  const map = new Map();
  for (const t of tasks) {
    const key = weekStart(t.dueAt).getTime();
    if (!map.has(key)) map.set(key, { key, start: new Date(key), tasks: [] });
    map.get(key).tasks.push(t);
  }
  return [...map.values()].sort((a, b) => a.key - b.key);
}

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// value for <input type="datetime-local"> in local time
export function toInputValue(iso) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
