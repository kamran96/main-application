/**
 * this file should export all the integration configurations
 */

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

console.log(process.env.NODE_ENV);
export const sentryInit = () => {
  Sentry.init({
    dsn:
      process.env.NODE_ENV === 'production'
        ? 'https://48acceae66254c2bb3b940a2f3aa7946@o222803.ingest.sentry.io/5584852'
        : '',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    environment:
      process.env.NODE_ENV === 'development' ? 'development' : 'production',
  });
};
