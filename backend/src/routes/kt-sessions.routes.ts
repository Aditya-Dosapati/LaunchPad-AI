import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';

const router = Router();

// GET /api/kt-sessions
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { status, hostId } = req.query;

    const where: any = {};
    if (status) where.status = (status as string).toUpperCase();
    if (hostId) where.hostId = hostId as string;

    const [sessions, total] = await Promise.all([
      prisma.kTSession.findMany({
        where,
        include: {
          host: true,
          attendances: { include: { user: true } },
        },
        orderBy: { scheduledAt: 'asc' },
        skip,
        take,
      }),
      prisma.kTSession.count({ where }),
    ]);

    res.json({ sessions: sanitizeUsers(sessions), total });
  })
);

// GET /api/kt-sessions/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid KT session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const session = await prisma.kTSession.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        host: true,
        attendances: { include: { user: true } },
      },
    });

    res.json({ session: sanitizeUser(session) });
  })
);

// POST /api/kt-sessions
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('hostId').isUUID().withMessage('Valid hostId is required'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduledAt ISO date string is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { title, hostId, scheduledAt, status } = req.body;

    const session = await prisma.kTSession.create({
      data: {
        title,
        hostId,
        scheduledAt: new Date(scheduledAt),
        status,
      },
      include: {
        host: true,
        attendances: true,
      },
    });

    res.status(201).json({ session: sanitizeUser(session) });
  })
);

// PATCH /api/kt-sessions/:id
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid KT session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const allowedFields = ['title', 'hostId', 'status', 'scheduledAt', 'rating'];
    const data: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        if (key === 'scheduledAt') {
          data[key] = new Date(req.body[key]);
        } else {
          data[key] = req.body[key];
        }
      }
    }

    const session = await prisma.kTSession.update({
      where: { id: req.params.id },
      data,
      include: {
        host: true,
        attendances: { include: { user: true } },
      },
    });

    res.json({ session: sanitizeUser(session) });
  })
);

// POST /api/kt-sessions/:id/attend (Register attendance)
router.post(
  '/:id/attend',
  [
    param('id').isUUID().withMessage('Invalid KT session ID'),
    body('userId').isUUID().withMessage('Valid userId is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const attendance = await prisma.kTAttendance.upsert({
      where: {
        sessionId_userId: {
          sessionId: req.params.id,
          userId: req.body.userId,
        },
      },
      update: { attended: req.body.attended ?? true },
      create: {
        sessionId: req.params.id,
        userId: req.body.userId,
        attended: req.body.attended ?? true,
      },
      include: { user: true },
    });

    res.status(201).json({ attendance: sanitizeUser(attendance) });
  })
);

// DELETE /api/kt-sessions/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid KT session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.kTSession.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
