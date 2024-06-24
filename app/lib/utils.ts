export function hasItems(array: any[] | undefined): boolean {
  return array && array.length > 0 ? true : false;
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
