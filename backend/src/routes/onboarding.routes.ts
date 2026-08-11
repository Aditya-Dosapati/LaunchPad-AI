import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';

const router = Router();

// GET /api/onboarding
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);

    const [tracks, total] = await Promise.all([
      prisma.onboardingTrack.findMany({
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.onboardingTrack.count(),
    ]);

    res.json({ tracks: sanitizeUsers(tracks), total });
  })
);

// GET /api/onboarding/:userId
router.get(
  '/:userId',
  [param('userId').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const track = await prisma.onboardingTrack.findUniqueOrThrow({
      where: { userId: req.params.userId },
      include: {
        user: true,
      },
    });

    res.json({ track: sanitizeUser(track) });
  })
);

// POST /api/onboarding (Initialize onboarding track for user)
router.post(
  '/',
  [
    body('userId').isUUID().withMessage('Valid userId is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const {
      userId,
      progress,
      trainingCompletion,
      readinessScore,
      pendingKT,
      pendingDoc,
      assignedMentorName,
    } = req.body;

    const track = await prisma.onboardingTrack.create({
      data: {
        userId,
        progress: progress || 0,
        trainingCompletion: trainingCompletion || 0,
        readinessScore: readinessScore || 0,
        pendingKT,
        pendingDoc,
        assignedMentorName,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({ track: sanitizeUser(track) });
  })
);

// PATCH /api/onboarding/:userId
router.patch(
  '/:userId',
  [param('userId').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const allowedFields = [
      'progress',
      'trainingCompletion',
      'readinessScore',
      'pendingKT',
      'pendingDoc',
      'assignedMentorName',
      'completedAt',
    ];
    const data: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        if (key === 'completedAt' && req.body[key]) {
          data[key] = new Date(req.body[key]);
        } else {
          data[key] = req.body[key];
        }
      }
    }

    const track = await prisma.onboardingTrack.update({
      where: { userId: req.params.userId },
      data,
      include: {
        user: true,
      },
    });

    res.json({ track: sanitizeUser(track) });
  })
);

// DELETE /api/onboarding/:userId
router.delete(
  '/:userId',
  [param('userId').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.onboardingTrack.delete({ where: { userId: req.params.userId } });
    res.status(204).send();
  })
);

export default router;
