import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';
import { parsePagination } from '../lib/queryHelpers';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All chat routes require authentication
router.use(requireAuth);

// GET /api/chats?userId=...
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parsePagination(req.query);
    const userId = (req.query.userId as string) || req.user!.id;
    const search = req.query.search as string;

    const where: any = { userId };
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [chats, total] = await Promise.all([
      prisma.chatSession.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      }),
      prisma.chatSession.count({ where }),
    ]);

    res.json({ chats, total });
  })
);

// GET /api/chats/:id
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid chat session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const chat = await prisma.chatSession.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.json({ chat });
  })
);

// POST /api/chats (Create new session)
router.post(
  '/',
  [
    body('title').optional().isString(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const userId = req.body.userId || req.user!.id;
    const { title } = req.body;

    const chat = await prisma.chatSession.create({
      data: {
        userId,
        title: title || 'New Discussion',
      },
      include: { messages: true },
    });

    res.status(201).json({ chat });
  })
);

// POST /api/chats/:id/messages (Add message to chat session)
router.post(
  '/:id/messages',
  [
    param('id').isUUID().withMessage('Invalid chat session ID'),
    body('sender').isIn(['USER', 'AI']).withMessage('Sender must be USER or AI'),
    body('text').notEmpty().withMessage('Message text is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const sessionId = req.params.id;
    const { sender, text, codeSnippet, language, sources, confidence, feedback } = req.body;

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender,
        text,
        codeSnippet,
        language,
        sources: sources || [],
        confidence,
        feedback,
      },
    });

    // Update the parent chat session updatedAt and optional title if default
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ message });
  })
);

// PATCH /api/chats/:id (Update title)
router.patch(
  '/:id',
  [param('id').isUUID().withMessage('Invalid chat session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { title } = req.body;
    const chat = await prisma.chatSession.update({
      where: { id: req.params.id },
      data: { title },
    });

    res.json({ chat });
  })
);

// DELETE /api/chats/:id
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid chat session ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    await prisma.chatSession.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

export default router;
