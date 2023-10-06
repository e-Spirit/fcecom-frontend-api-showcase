import { EcomApi, EcomHooks, LogLevel } from 'fcecom-frontend-api-client';

const ecomApi = new EcomApi('https://example.com', LogLevel.INFO);

ecomApi.addHook(EcomHooks.PREVIEW_INITIALIZED, async ({ TPP_BROKER }) => {
  // Register a button inside the TPP preview frame
  TPP_BROKER.registerButton(
    {
      label: 'customButton',
      isEnabled: () => Promise.resolve(true),
    },
    1
  );

  // Show the FirstSpirit edit dialog for the current set element
  TPP_BROKER.showEditDialog(await TPP_BROKER.getPreviewElement());
});

ecomApi.init();
