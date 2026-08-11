import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';

const router = Router();

// GET /api/feedback
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { type, sentiment } = req.query;

    const where: any = {};
    if (type) where.type = (type as string).toUpperCase();
    if (sentiment) where.sentiment = (sentiment as string).toUpperCase();

    const [feedback, total] = await Promise.all([
      prisma.feedbackEntry.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.feedbackEntry.count({ where }),
    ]);

    res.json({ feedback: sanitizeUsers(feedback), total });
  })
);

// GET /api/feedback/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid feedback ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const entry = await prisma.feedbackEntry.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        author: true,
      },
    });

    res.json({ feedback: sanitizeUser(entry) });
  })
);

// POST /api/feedback
router.post(
  '/',
  [
    body('text').notEmpty().withMessage('Feedback text is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { text, authorId, type, sentiment } = req.body;

    const entry = await prisma.feedbackEntry.create({
      data: {
        text,
        authorId: type === 'ANONYMOUS' ? null : authorId,
        type: type || 'PUBLIC',
        sentiment: sentiment || 'NEUTRAL',
      },
      include: {
        author: true,
      },
    });

    res.status(201).json({ feedback: sanitizeUser(entry) });
  })
);

// DELETE /api/feedback/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid feedback ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.feedbackEntry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
