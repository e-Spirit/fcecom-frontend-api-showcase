import { DataTransformer, FetchResponseItem, Transformer } from 'fcecom-frontend-api-server';

DataTransformer.registerTransformer(Transformer.FIND_PAGE, async (page: FetchResponseItem | null) => ({
  myOwnPageProperty: page,
}));
