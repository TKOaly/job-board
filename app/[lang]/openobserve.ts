'use client';

import { openobserveRum } from '@openobserve/browser-rum';
import { openobserveLogs } from '@openobserve/browser-logs';

const options = {
  site: process.env.NEXT_PUBLIC_O2_SITE!,
  clientToken: process.env.NEXT_PUBLIC_O2_CLIENT_TOKEN!,
  applicationId: 'job-board',
  service: 'job-board',
  env: 'production',
  version: '0.0.1',
  organizationIdentifier: 'default',
  insecureHTTP: process.env.NEXT_PUBLIC_O2_HTTPS === 'off',
  apiVersion: 'v1',
};

openobserveRum.init({
  applicationId: options.applicationId, // required, any string identifying your application
  clientToken: options.clientToken,
  site: options.site,
  organizationIdentifier: options.organizationIdentifier,
  service: options.service,
  env: options.env,
  version: options.version,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  apiVersion: options.apiVersion,
  insecureHTTP: options.insecureHTTP,
  defaultPrivacyLevel: 'allow' // 'allow' or 'mask-user-input' or 'mask'. Use one of the 3 values.
});

openobserveLogs.init({
  clientToken: options.clientToken,
  site: options.site,
  organizationIdentifier: options.organizationIdentifier,
  service: options.service,
  env: options.env,
  version: options.version,
  forwardErrorsToLogs: true,
  insecureHTTP: options.insecureHTTP,
  apiVersion: options.apiVersion,
});

openobserveRum.startSessionReplayRecording();
