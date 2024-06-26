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
import { auth } from '@/auth';
import { extractInvoiceData } from '../utils';

export async function getInvoicesByDateRange({
  startDate,
  endDate,
  company,
  isSearch,
}: {
  startDate: string | null;
  endDate: string | null;
  company: string | null;
  isSearch: boolean;
}) {
  try {
    const isValidStartDate =
      startDate && new Date(startDate).toString() !== 'Invalid Date';
    const isValidEndDate =
      endDate && new Date(endDate).toString() !== 'Invalid Date';
    const invoices = await getInvoicesByDateRangeDB({
      startDate: isValidStartDate ? startDate : null,
      endDate: isValidEndDate ? endDate : null,
      companyID: company || null,
      isSearch,
    });
    console.log(invoices);

    return invoices.map((invoice) => ({
      ...invoice,
      pdf: `${process.env.AZURE_BLOB_PATH}${invoice.pdf}`,
      xml: `${process.env.AZURE_BLOB_PATH}${invoice.xml}`,
    }));
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

    const {
      transmitter,
      receiver,
      uuid,
      typeDocument,
      reference,
      date,
      certificationTimestamp,
    } = extractInvoiceData(xmlContent, uuidInput, invalidXmlMessage);

    const now = Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    const relatedData = await validateInvoiceData({
      transmitter,
      receiver,
      uuid,
    });

    //upload files to azure blob storage
    const container = process.env!.AZURE_STORAGE_CONTAINER!;
    const azureBlobStorage = blob().getContainerClient(container);
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
      to: relatedData?.receiver?.emails?.split(';'),
      subject: `${relatedData.receiver.name} - ${now}`,
      text: `El proveedor ${relatedData.transmitter.name} con RFC ${relatedData.transmitter.rfc} ha subido una factura de esta empresa con el UUID: ${uuid}`,
    };

    const providerMailOptions = {
      from: `"Invoice Storage" <${process.env.MAIL_USER}>`,
      to: `${session?.user?.email || ''}`,
      subject: `${relatedData.transmitter.name} - ${now}`,
      text: `El proveedor ${relatedData.transmitter.name} ha subido una factura con el UUID: ${uuid}`,
    };

    await createInvoice({
      uuid,
      transmitterID: relatedData.transmitter.id,
      receiverID: relatedData.receiver.id,
      date,
      certificationTimestamp,
      reference,
      typeID: typeDocument,
      userID: +session!.user!.id!,
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
    return 'Factura subida correctamente.';
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    throw error;
  }
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
