'use server';
import { revalidatePath } from 'next/cache';
import { blob } from '../blob/autentication';
import {
  createInvoice,
  deleteInvoiceById,
  getInvoices,
  validateInvoiceData,
} from '../database/invoice';
import { redirect } from 'next/navigation';

export async function getInvoicesByDateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  try {
    const isValidStartDate = new Date(startDate).toString() !== 'Invalid Date';
    const isValidEndDate = new Date(endDate).toString() !== 'Invalid Date';
    const invoices = await getInvoices({
      startDate: isValidStartDate ? startDate : null,
      endDate: isValidEndDate ? endDate : null,
    });
    return invoices.concat(
      Array.from({ length: 20 })
        .fill(invoices[0])
        .map((_, i) => ({ ...invoices[0], id: i }))
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return [];
    }
    throw error;
  }
}

export async function validateInvoice(prevState: any, formData: FormData) {
  try {
    const files = formData.getAll('files') as File[];
    const uuidInput = formData.get('uuid') as string;
    const pdf = files.find((file) => file.type === 'application/pdf');
    const xml = files.find((file) => file.type === 'text/xml');
    const invalidFilesMessage = 'Debes subir un archivo PDF y un archivo XML.';
    const invalidXmlMessage = 'El archivo XML no es un CFDI.';

    if (!pdf || !xml) {
      throw new Error(invalidFilesMessage);
    }

    const arrayBuffer = await xml.arrayBuffer();
    const xmlContent = new TextDecoder().decode(arrayBuffer);

    const transmitterRFCLine = xmlContent.match(/<cfdi:Emisor[^>]*\/>/);
    const receiverRFCLine = xmlContent.match(/<cfdi:Receptor[^>]*\/>/);
    const uuidLine = xmlContent.match(/UUID="([^"]*)"/);
    const dateLine = xmlContent.match(/Fecha="([^"]*)"/);
    const certificationLine = xmlContent.match(/FechaTimbrado="([^"]*)"/);
    if (
      !transmitterRFCLine ||
      !receiverRFCLine ||
      !uuidLine ||
      !dateLine ||
      !certificationLine
    ) {
      throw new Error(invalidXmlMessage);
    }

    const transmitterRFC = transmitterRFCLine[0].match(/Rfc="([^"]*)"/);
    const receiverRFC = receiverRFCLine[0].match(/Rfc="([^"]*)"/);

    if (!transmitterRFC || !receiverRFC) {
      throw new Error(invalidXmlMessage);
    }

    const transmitter = transmitterRFC[1];
    const receiver = receiverRFC[1];
    const uuid = uuidLine[1];
    const date = dateLine[1];
    const certificationTimestamp = certificationLine[1];

    if (!uuid) {
      throw new Error('No se encontró el UUID en el archivo XML.');
    }

    if (uuid !== uuidInput) {
      throw new Error(`El UUID no coincide con el ingresado (${uuid}).`);
    }

    const relatedData = await validateInvoiceData({
      transmitter,
      receiver,
      uuid,
    });

    //upload files to azure blob storage
    const container = process.env!.AZURE_STORAGE_CONTAINER!;
    const azureBlobStorage = (await blob()).getContainerClient(container);
    await azureBlobStorage.createIfNotExists();
    const pdfArrayBuffer = await pdf!.arrayBuffer();

    await azureBlobStorage.uploadBlockBlob(
      `xml/${uuid}.xml`,
      arrayBuffer,
      arrayBuffer.byteLength,
      {
        blobHTTPHeaders: {
          blobContentType: 'text/xml',
        },
      }
    );
    await azureBlobStorage.uploadBlockBlob(
      `pdf/${uuid}.pdf`,
      pdfArrayBuffer,
      pdfArrayBuffer.byteLength,
      {
        blobHTTPHeaders: {
          blobContentType: 'application/pdf',
        },
      }
    );

    await createInvoice({
      uuid,
      transmitterID: relatedData.transmitterID,
      receiverID: relatedData.receiverID,
      date,
      certificationTimestamp,
    });

    revalidatePath('/dashboard/invoices');
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    throw error;
  }
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    setTimeout(() => {}, 5000);
    await deleteInvoiceById(id);
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    throw error;
  }
}
