import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/mentor-pairings
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { mentorId, menteeId, isActive } = req.query;

    const where: any = {};
    if (mentorId) where.mentorId = mentorId as string;
    if (menteeId) where.menteeId = menteeId as string;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [pairings, total] = await Promise.all([
      prisma.mentorPairing.findMany({
        where,
        include: {
          mentor: true,
          mentee: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.mentorPairing.count({ where }),
    ]);

    res.json({ pairings: sanitizeUsers(pairings), total });
  })
);

// POST /api/mentor-pairings
router.post(
  '/',
  [
    body('mentorId').isUUID().withMessage('Valid mentorId is required'),
    body('menteeId').isUUID().withMessage('Valid menteeId is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { mentorId, menteeId } = req.body;

    if (mentorId === menteeId) {
      return res.status(400).json({ error: 'Mentor and mentee cannot be the same user' });
    }

    const pairing = await prisma.mentorPairing.upsert({
      where: {
        mentorId_menteeId: { mentorId, menteeId },
      },
      update: { isActive: true },
      create: { mentorId, menteeId, isActive: true },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    res.status(201).json({ pairing: sanitizeUser(pairing) });
  })
);

// PATCH /api/mentor-pairings/:id
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid pairing ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { isActive } = req.body;
    const pairing = await prisma.mentorPairing.update({
      where: { id: req.params.id },
      data: { isActive },
      include: {
        mentor: true,
        mentee: true,
      },
    });

    res.json({ pairing: sanitizeUser(pairing) });
  })
);

// DELETE /api/mentor-pairings/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid pairing ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.mentorPairing.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
