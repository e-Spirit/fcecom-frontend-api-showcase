import { EcomApi, PageTarget } from 'fcecom-frontend-api-client/src';
import { LogLevel } from 'fsxa-api';

const ecomApi = new EcomApi('https://example.com', LogLevel.INFO);

const pageTarget: PageTarget = {
  id: 'i-am-an-id',
  type: 'product',
  fsPageTemplate: 'product',
  isFsDriven: false,
};


ecomApi
  // Request token from Executable: Allow a single page
  .getShareViewLink({
    id: pageTarget.id,
    type: pageTarget.type,
    lifetimeMs: 24 * 60 * 60 * 1000, // 24h
  })
  // Copy result to clipboard
  .then((result) => navigator.clipboard.writeText(result));


ecomApi
  // Request token from Executable: Allow all pages
  .getShareViewLink({
    universalAllow: true,
    lifetimeMs: 24 * 60 * 60 * 1000, // 24h
  })
  // Copy result to clipboard
  .then((result) => navigator.clipboard.writeText(result));


// ** Extra: FirstSpirit-driven pages **

ecomApi
  // Request token from Executable: Allow a single FirstSpirit-driven page
  .getShareViewLink({
    isFsDriven: true,
    fsPageId: 'i-am-an-fs-page-id',
    lifetimeMs: 24 * 60 * 60 * 1000, // 24h
  })
  // Copy result to clipboard
  .then((result) => navigator.clipboard.writeText(result));