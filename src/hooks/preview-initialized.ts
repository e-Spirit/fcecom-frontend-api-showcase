import { EcomApi, EcomHooks, LogLevel } from 'fcecom-frontend-api-client';

const ecomApi = new EcomApi('https://example.com', LogLevel.INFO);

ecomApi.addHook(EcomHooks.PREVIEW_INITIALIZED, ({ message }) => {
  console.log(`PREVIEW_INITIALIZED: ${message}`)
});

ecomApi.init();
