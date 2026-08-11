import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeUser, sanitizeUsers, parsePagination } from '../lib/queryHelpers';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All document routes require authentication
router.use(requireAuth);

// GET /api/documents
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const { category, status, search, authorId } = req.query;

    const where: any = {};
    if (category) where.category = (category as string).toUpperCase();
    if (status) where.status = (status as string).toUpperCase();
    if (authorId) where.authorId = authorId;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: { author: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      }),
      prisma.document.count({ where }),
    ]);

    res.json({ documents: sanitizeUsers(documents), total });
  })
);

// GET /api/documents/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid document ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const document = await prisma.document.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { author: true },
    });

    res.json({ document: sanitizeUser(document) });
  })
);

// POST /api/documents
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { title, content, category, status, version } = req.body;
    // Use authenticated user as author if authorId not provided
    const authorId = req.body.authorId || req.user!.id;

    const document = await prisma.document.create({
      data: { title, content, category, authorId, status, version },
      include: { author: true },
    });

    res.status(201).json({ document: sanitizeUser(document) });
  })
);

// PATCH /api/documents/:id
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid document ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const allowedFields = [
      'title', 'content', 'category', 'version', 'status',
      'isBookmarked', 'isFavorite',
    ];
    const data: Record<string, any> = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data,
      include: { author: true },
    });

    res.json({ document: sanitizeUser(document) });
  })
);

// DELETE /api/documents/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid document ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.document.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
