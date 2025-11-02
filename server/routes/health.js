const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     description: Check if the server and database are running properly
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 database:
 *                   type: string
 *                   enum: [connected, disconnected]
 *       503:
 *         description: Server is unhealthy
 */
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };

  // If database is not connected, return 503
  if (healthCheck.database === 'disconnected') {
    return res.status(503).json({
      ...healthCheck,
      status: 'error',
      message: 'Database connection failed',
    });
  }

  res.status(200).json(healthCheck);
});

module.exports = router;
