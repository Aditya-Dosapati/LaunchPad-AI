import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';

const router = Router();

// GET /api/users
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { role, status, department, search } = req.query;

    const where: any = {};
    if (role) where.role = (role as string).toUpperCase();
    if (status) where.status = (status as string).toUpperCase();
    if (department) where.department = (department as string).toUpperCase();
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users: sanitizeUsers(users), total });
  })
);

// GET /api/users/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        onboardingTrack: true,
        projectMembers: { include: { project: true } },
      },
    });

    res.json({ user: sanitizeUser(user) });
  })
);

// POST /api/users
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, name, role, department, jobTitle, skills, status, phone, location, bio } =
      req.body;

    const user = await prisma.user.create({
      data: { email, name, role, department, jobTitle, skills, status, phone, location, bio },
    });

    res.status(201).json({ user: sanitizeUser(user) });
  })
);

// PATCH /api/users/:id
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const allowedFields = [
      'name', 'role', 'status', 'department', 'jobTitle', 'bio',
      'phone', 'location', 'skills', 'avatarUrl', 'mfaEnabled',
    ];
    const data: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ user: sanitizeUser(user) });
  })
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid user ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
