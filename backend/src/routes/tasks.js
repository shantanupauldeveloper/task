import { Router } from 'express';
import Task from '../models/Task.js';

const router = Router();
const FIELDS = ['title', 'description', 'dueAt', 'priority', 'status'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/tasks?q=keyword
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    const q = req.query.q?.toString().trim();
    if (q) {
      const re = new RegExp(escapeRe(q), 'i');
      filter.$or = [{ title: re }, { description: re }];
    }
    res.json(await Task.find(filter).sort({ dueAt: 1 }));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await Task.create(pick(req.body))); } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
