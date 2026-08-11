import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Audit logs require auth + ADMIN role
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// GET /api/audit-logs
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { userId, action, entity } = req.query;

    const where: any = {};
    if (userId) where.userId = userId as string;
    if (action) where.action = (action as string).toUpperCase();
    if (entity) where.entity = entity as string;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ logs: sanitizeUsers(logs), total });
  })
);

// GET /api/audit-logs/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid audit log ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const log = await prisma.auditLog.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        user: true,
      },
    });

    res.json({ log: sanitizeUser(log) });
  })
);

// POST /api/audit-logs (Log an action)
router.post(
  '/',
  [
    body('action').notEmpty().withMessage('Action is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { userId, action, entity, entityId, details, ipAddress } = req.body;

    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress: ipAddress || req.ip,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({ log: sanitizeUser(log) });
  })
);

export default router;
