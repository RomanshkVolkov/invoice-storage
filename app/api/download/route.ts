import { blob } from '@/app/lib/blob/autentication';
import archiver from 'archiver';

export async function POST(req: Request) {
  try {
    const selectedFiles = await req.json();
    if (selectedFiles.length === 0 || !selectedFiles) {
      return new Response('No se seleccionaron archivos.', { status: 400 });
    }
    const container = process.env.AZURE_STORAGE_CONTAINER!;
    const azureBlobStorage = (await blob()).getContainerClient(container);
    await azureBlobStorage.createIfNotExists();

    const archive = archiver('zip', { zlib: { level: 9 } }); // Nivel de compresión
    const downloadPromises = selectedFiles.map(async (uuid: string) => {
      const pdfBlobName = `pdf/${uuid}.pdf`;
      const xmlBlobName = `xml/${uuid}.xml`;

      const [pdfBlobClient, xmlBlobClient] = await Promise.all([
        azureBlobStorage.getBlobClient(pdfBlobName),
        azureBlobStorage.getBlobClient(xmlBlobName),
      ]);
      const [pdfResponse, xmlResponse] = await Promise.all([
        pdfBlobClient.download(),
        xmlBlobClient.download(),
      ]);

      if (!pdfResponse.readableStreamBody || !xmlResponse.readableStreamBody) {
        console.error('Error downloading blobs:', pdfBlobName, xmlBlobName);
        return;
      }

      archive.append(pdfResponse.readableStreamBody as any, {
        name: pdfBlobName,
      });
      archive.append(xmlResponse.readableStreamBody as any, {
        name: xmlBlobName,
      });
    });

    await Promise.all(downloadPromises);
    archive.finalize();

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Uint8Array[] = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', reject);
    });
    return new Response(buffer, {
      headers: {
        'Content-Type': 'file/zip',
        'Content-Disposition': 'attachment; filename="invoices.zip"',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Error desconocido', { status: 500 });
  }
}
