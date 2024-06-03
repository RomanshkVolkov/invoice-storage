'use server';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';
import { blob } from '../blob/autentication';
import {
  createInvoice,
  deleteInvoiceById,
  getInvoiceByIdDB,
  getInvoicesByDateRangeDB,
  validateInvoiceData,
} from '../database/invoice';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

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
    const invoices = await getInvoicesByDateRangeDB({
      startDate: isValidStartDate ? startDate : null,
      endDate: isValidEndDate ? endDate : null,
    });
    return invoices;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return [];
    }
    throw error;
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await getInvoiceByIdDB(id);
    invoice.pdf = `${process.env.AZURE_BLOB_PATH}${invoice.pdf}`;
    invoice.xml = `${process.env.AZURE_BLOB_PATH}${invoice.xml}`;
    return invoice;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return null;
    }
    throw error;
  }
}

export async function validateInvoice(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    const inputPdf = formData.getAll('pdf') as File[];
    const inputXml = formData.getAll('xml') as File[];
    const uuidInput = formData.get('uuid') as string;
    const pdf = inputPdf.find((file) => file.type === 'application/pdf');
    const xml = inputXml.find((file) => file.type === 'text/xml');
    const invalidFilesMessage = 'Debes subir un archivo PDF y un archivo XML.';
    const invalidXmlMessage = 'El archivo XML no es un CFDI valido.';

    if (!pdf || !xml) {
      throw new Error(invalidFilesMessage);
    }

    const arrayBuffer = await xml.arrayBuffer();
    const xmlContent = new TextDecoder().decode(arrayBuffer);

    const transmitterRFCLine = xmlContent.match(/<cfdi:Emisor\b[^>]*>/);
    const receiverRFCLine = xmlContent.match(/<cfdi:Receptor\b[^>]*>/);
    const uuidLine = xmlContent.match(/UUID="([^"]*)"/g);
    const referenceLine = xmlContent.match(/Folio="([^"]*)"/g);
    const typeDocumentLine = xmlContent.match(/TipoDeComprobante="([^"]*)"/g);
    const dateLine = xmlContent.match(/Fecha="([^"]*)"/g);
    const certificationLine = xmlContent.match(/FechaTimbrado="([^"]*)"/g);

    if (
      !transmitterRFCLine ||
      !receiverRFCLine ||
      !uuidLine ||
      !dateLine ||
      !certificationLine ||
      !referenceLine ||
      !typeDocumentLine
    ) {
      throw new Error(invalidXmlMessage);
    }

    const transmitterRFC = transmitterRFCLine[0].match(/Rfc="([^"]*)"/);
    const receiverRFC = receiverRFCLine[0].match(/Rfc="([^"]*)"/);

    if (!transmitterRFC || !receiverRFC) {
      throw new Error(invalidXmlMessage);
    }

    const transmitter = transmitterRFC[0].replace('Rfc="', '').replace('"', '');
    const receiver = receiverRFC[0].replace('Rfc="', '').replace('"', '');
    const uuid = uuidLine[0].replace('UUID="', '').replace('"', '');
    const reference = referenceLine[0].replace('Folio="', '').replace('"', '');
    const typeDocument = typeDocumentLine[0]
      .replace('TipoDeComprobante="', '')
      .replace('"', '');
    const date = dateLine[0].replace('Fecha="', '').replace('"', '');
    const certificationTimestamp = certificationLine[0]
      .replace('FechaTimbrado="', '')
      .replace('"', '');

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

    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const companyMailOptions = {
      from: `"Invoice Storage" <${process.env.MAIL_USER}>`,
      to: relatedData.companyEmails.split(';'),
      subject: 'Nueva factura',
      text: `El proveedor ${session?.user?.provider?.name} con RFC ${session?.user?.provider?.rfc} ha subido una factura de esta empresa con el UUID: ${uuid}`,
    };

    const providerMailOptions = {
      from: `"Invoice Storage" <${process.env.MAIL_USER}>`,
      to: session?.user?.email || '',
      subject: 'Nueva factura',
      text: `Has subido una factura con el UUID: ${uuid}`,
    };

    await createInvoice({
      uuid,
      transmitterID: relatedData.transmitter.id,
      receiverID: relatedData.receiver.id,
      date,
      certificationTimestamp,
      reference,
      typeID: typeDocument,
    })
      .then(() => {
        // send email
        transporter.sendMail(companyMailOptions);
        transporter.sendMail(providerMailOptions);
        revalidatePath('/dashboard/invoices');
      })
      .catch((error) => {
        throw error;
      });
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
