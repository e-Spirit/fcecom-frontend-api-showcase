import { PreviewDecider, PreviewDeciderTemplate } from 'fcecom-frontend-api-server';

class MyCustomPreviewDecider implements PreviewDeciderTemplate {
  async isPreview(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

PreviewDecider.registerDecider(new MyCustomPreviewDecider());
PreviewDecider.useDefaultDecider();