import { BlobServiceClient } from '@azure/storage-blob';

const getBlobServiceClient = async () => {
  const azure_storage_connection_string =
    process.env.AZURE_STORAGE_CONNECTION_STRING || '';
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    azure_storage_connection_string
  );
  return blobServiceClient;
};

export const blob = getBlobServiceClient;
