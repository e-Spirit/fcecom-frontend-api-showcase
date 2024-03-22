import { FSXARemoteApi } from 'fsxa-api';
import { EcomConfig } from 'fcecom-frontend-api-server';

// Create API for preview state
const previewApi = new FSXARemoteApi(EcomConfig.getFSXAConfig().preview);

// Create API for release state
const releaseApi = new FSXARemoteApi(EcomConfig.getFSXAConfig().release);

// Example: Fetch Project Properties
previewApi.fetchProjectProperties({
  locale: 'en_GB',
})
