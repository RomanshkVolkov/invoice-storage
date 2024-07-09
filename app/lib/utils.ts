import { faker } from '@faker-js/faker';

export function hasItems(array: any[] | undefined): boolean {
  return array && array.length > 0 ? true : false;
}

export function normalizeDate(dateObject: Date): string {
  const date = new Date(dateObject);
  const day = date.getDay().toString().padStart(2, '0');
  const month = date.getMonth().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function extractInvoiceData(
  file: string,
  uuidInput: string,
  invalidXmlMessage: string
) {
  const transmitterRFCLine = file.match(/<cfdi:Emisor\b[^>]*>/);
  const receiverRFCLine = file.match(/<cfdi:Receptor\b[^>]*>/);

  const uuidLine = file.match(/UUID="([^"]*)"/g);
  const referenceLine = file.match(/Folio="([^"]*)"/g);
  const typeDocumentLine = file.match(/TipoDeComprobante="([^"]*)"/g);
  const dateLine = file.match(/Fecha="([^"]*)"/g);
  const certificationLine = file.match(/FechaTimbrado="([^"]*)"/g);

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
  const uuid = uuidLine?.pop()?.replace('UUID="', '').replace('"', '');
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

  if (uuid.toUpperCase() !== uuidInput.toUpperCase()) {
    throw new Error(`El UUID no coincide con el ingresado (${uuid}).`);
  }
  return {
    transmitter,
    receiver,
    reference,
    typeDocument,
    uuid,
    date,
    certificationTimestamp,
  };
}

export function handleDatabaseError(error: any, message: string) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  return {
    errors: {},
    message,
  };
}

export function createPagination<T>(data: T[], page: number) {
  const ROWS_PER_PAGE = 8;
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const start = (page - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const paginatedData = [...data].slice(start, end);
  return {
    totalPages,
    paginatedData,
  };
}

export function randomRFC() {
  let rfc = faker.string.alpha({ length: 4, casing: 'upper' });
  // Los siguientes 6 caracteres son dígitos que representan una fecha (YYMMDD)
  rfc += faker.date
    .past({ years: 30, refDate: new Date('2000-01-01') })
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, '');
  // Los últimos 2 o 3 caracteres son alfanuméricos
  rfc += faker.string.alphanumeric({ length: 3, casing: 'upper' });
  return rfc;
}
