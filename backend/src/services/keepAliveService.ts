import { logger } from '../utils/logger';

let keepAliveInterval: NodeJS.Timeout | null = null;

/**
 * Service to keep the Render backend active ("always on") by self-pinging
 * the health endpoint every 10 minutes to prevent Render free-tier spin-down (sleep mode).
 */
export const startKeepAlive = (port: number): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  const keepAliveDisabled = process.env.KEEP_ALIVE_ENABLED === 'false';

  if (keepAliveDisabled) {
    logger.info('Keep-Alive Service: Disabled via KEEP_ALIVE_ENABLED=false');
    return;
  }

  // Determine external service URL
  const externalUrl =
    process.env.KEEP_ALIVE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    (isProduction ? 'https://cooked-backend.onrender.com' : `http://localhost:${port}`);

  const targetUrl = externalUrl.replace(/\/+$/, '');
  const healthEndpoint = `${targetUrl}/health`;

  logger.info(`Keep-Alive Service: Initialized (Target: ${healthEndpoint})`);

  const pingHealthEndpoint = async (): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(healthEndpoint, {
        method: 'GET',
        headers: {
          'User-Agent': 'Render-KeepAlive-Ping/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        logger.info(`Keep-Alive Ping OK [${response.status}] -> ${healthEndpoint}`);
      } else {
        logger.warn(`Keep-Alive Ping Status [${response.status}] -> ${healthEndpoint}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.warn(`Keep-Alive Ping Timed Out -> ${healthEndpoint}`);
      } else {
        logger.warn(`Keep-Alive Ping Failed -> ${healthEndpoint}`, error);
      }
    }
  };

  // Run initial ping 10 seconds after server boot
  const initialTimer = setTimeout(() => {
    pingHealthEndpoint();
  }, 10000);
  initialTimer.unref();

  // Schedule recurring ping every 10 minutes (600,000 ms)
  // Render free tier sleeps after 15 mins of inactivity, so 10 mins prevents sleep mode.
  const INTERVAL_MS = 10 * 60 * 1000;
  keepAliveInterval = setInterval(pingHealthEndpoint, INTERVAL_MS);
  keepAliveInterval.unref();
};

export const stopKeepAlive = (): void => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    logger.info('Keep-Alive Service: Stopped');
  }
};
