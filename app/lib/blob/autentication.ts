import { BlobServiceClient } from '@azure/storage-blob';

const getBlobServiceClient = () => {
  const azureStoreConnectionString =
    process.env.AZURE_STORAGE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    azureStoreConnectionString
  );
  return blobServiceClient;
};

export const blob = getBlobServiceClient;
