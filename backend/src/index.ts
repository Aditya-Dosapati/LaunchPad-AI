import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import documentsRoutes from './routes/documents.routes';
import notificationsRoutes from './routes/notifications.routes';
import chatsRoutes from './routes/chats.routes';
import projectsRoutes from './routes/projects.routes';
import ktSessionsRoutes from './routes/kt-sessions.routes';
import mentorPairingsRoutes from './routes/mentor-pairings.routes';
import onboardingRoutes from './routes/onboarding.routes';
import feedbackRoutes from './routes/feedback.routes';
import auditLogsRoutes from './routes/audit-logs.routes';

import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/kt-sessions', ktSessionsRoutes);
app.use('/api/mentor-pairings', mentorPairingsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/audit-logs', auditLogsRoutes);

// 404 Route handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 LaunchPad AI Backend running on http://localhost:${PORT}`);
  });
}

export default app;
