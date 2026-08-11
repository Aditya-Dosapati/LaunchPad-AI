import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { parsePagination } from '../lib/queryHelpers';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.use(requireAuth);

// ──────────────────────────────────────────
// GET /api/notifications?userId=...
// ──────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    // Use authenticated user's ID if userId not provided
    const userId = (req.query.userId as string) || req.user!.id;
    const isRead = req.query.isRead;

    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({ notifications, total });
  })
);

// ──────────────────────────────────────────
// POST /api/notifications
// ──────────────────────────────────────────
router.post(
  '/',
  [
    body('type').notEmpty().withMessage('Type is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { type, title, message } = req.body;
    const userId = req.body.userId || req.user!.id;

    const notification = await prisma.notification.create({
      data: { userId, type, title, message },
    });

    res.status(201).json({ notification });
  })
);

// ──────────────────────────────────────────
// PATCH /api/notifications/:id/read
// ──────────────────────────────────────────
router.patch(
  '/:id/read',
  [param('id').isUUID().withMessage('Invalid notification ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    res.json({ notification });
  })
);

// ──────────────────────────────────────────
// PATCH /api/notifications/read-all?userId=...
// ──────────────────────────────────────────
router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    const userId = (req.query.userId as string) || req.user!.id;

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ updated: result.count });
  })
);

// ──────────────────────────────────────────
// DELETE /api/notifications/:id
// ──────────────────────────────────────────
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid notification ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
