const BASE = `${import.meta.env.VITE_API_URL || ''}/api/tasks`;

async function req(path = '', opts) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Request failed');
  return res.status === 204 ? null : res.json();
}

export const listTasks = (q = '') => req(q ? `?q=${encodeURIComponent(q)}` : '');
export const createTask = (t) => req('', { method: 'POST', body: JSON.stringify(t) });
export const updateTask = (id, t) => req(`/${id}`, { method: 'PUT', body: JSON.stringify(t) });
export const deleteTask = (id) => req(`/${id}`, { method: 'DELETE' });
