import { Request, Response, NextFunction, RequestHandler } from 'express';

// ─────────────────────────────────────────────
// Async handler — wraps route handlers so thrown
// errors (including from Prisma) are forwarded to
// Express's error middleware automatically.
// ─────────────────────────────────────────────
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ─────────────────────────────────────────────
// Global error handler — always the last middleware
// ─────────────────────────────────────────────
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Unhandled error:', err);

  // Prisma known request error (bad input, not found, etc.)
  if (err.code && err.code.startsWith('P')) {
    const status = err.code === 'P2025' ? 404 : 400;
    return res.status(status).json({
      error: err.code === 'P2025' ? 'Record not found' : 'Database request error',
      code: err.code,
      details: err.meta?.cause || err.message,
    });
  }

  // Validation errors from express-validator
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
