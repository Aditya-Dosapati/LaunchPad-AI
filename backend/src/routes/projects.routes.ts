import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/projects
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { search, leadId } = req.query;

    const where: any = {};
    if (leadId) where.leadId = leadId as string;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          lead: true,
          members: {
            include: { user: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ projects: sanitizeUsers(projects), total });
  })
);

// GET /api/projects/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid project ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        lead: true,
        members: {
          include: { user: true },
        },
      },
    });

    res.json({ project: sanitizeUser(project) });
  })
);

// POST /api/projects
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('leadId').isUUID().withMessage('Valid leadId is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const {
      name,
      description,
      progress,
      health,
      leadId,
      techStack,
      docArchitecture,
      docSop,
      docApi,
      memberIds,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        progress: progress || 0,
        health: health || 0,
        leadId,
        techStack: techStack || [],
        docArchitecture,
        docSop,
        docApi,
        members: memberIds && Array.isArray(memberIds)
          ? {
              create: memberIds.map((userId: string) => ({ userId })),
            }
          : undefined,
      },
      include: {
        lead: true,
        members: { include: { user: true } },
      },
    });

    res.status(201).json({ project: sanitizeUser(project) });
  })
);

// PATCH /api/projects/:id
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid project ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const allowedFields = [
      'name',
      'description',
      'progress',
      'health',
      'leadId',
      'techStack',
      'docArchitecture',
      'docSop',
      'docApi',
    ];
    const data: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
      include: {
        lead: true,
        members: { include: { user: true } },
      },
    });

    res.json({ project: sanitizeUser(project) });
  })
);

// POST /api/projects/:id/members (Add member)
router.post(
  '/:id/members',
  [
    param('id').isUUID().withMessage('Invalid project ID'),
    body('userId').isUUID().withMessage('Valid userId is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: req.params.id,
        userId: req.body.userId,
      },
      include: { user: true },
    });

    res.status(201).json({ member: sanitizeUser(member) });
  })
);

// DELETE /api/projects/:id/members/:userId (Remove member)
router.delete(
  '/:id/members/:userId',
  [
    param('id').isUUID().withMessage('Invalid project ID'),
    param('userId').isUUID().withMessage('Invalid user ID'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: req.params.id,
          userId: req.params.userId,
        },
      },
    });

    res.status(204).send();
  })
);

// DELETE /api/projects/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid project ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
