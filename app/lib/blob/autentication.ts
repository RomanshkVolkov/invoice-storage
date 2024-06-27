import { BlobServiceClient } from '@azure/storage-blob';

const getBlobServiceClient = () => {
  try {
    const azureStoreConnectionString =
      process.env.AZURE_STORAGE_CONNECTION_STRING || '';
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      azureStoreConnectionString
    );
    return blobServiceClient;
  } catch (error) {
    console.error('Error getting blob service client', error);
    throw new Error('Error getting blob service client');
  }
};

export const blob = getBlobServiceClient;
