import prisma from './prisma';

export async function getInvoices() {
  const invoices = await prisma.invoices.findMany({
    select: {
      id: true,
      pdf: true,
      xml: true,
      company: {
        select: {
          name: true,
        },
      },
      provider: {
        select: {
          name: true,
        },
      },
    },
    where: {
      isDeleted: false,
    },
  });

  return invoices.map((invoice) => ({
    ...invoice,
    company: invoice.company.name,
    provider: invoice.provider.name,
  }));
}

export async function validateInvoiceData({
  transmitter,
  receiver,
  uuid,
}: {
  transmitter: string;
  receiver: string;
  uuid: string;
}) {
  const isExistTransmitter = await prisma.companies.findFirst({
    where: {
      rfc: transmitter,
    },
  });

  const isExistReceiver = await prisma.providers.findFirst({
    where: {
      rfc: receiver,
    },
  });

  if (!isExistTransmitter || !isExistReceiver) {
    throw new Error(
      `El RFC del emisor (${transmitter}) o receptor (${receiver}) no existe en la base de datos.`
    );
  }

  const isExistInvoice = await prisma.invoices.findFirst({
    where: {
      id: uuid,
    },
  });

  if (isExistInvoice) {
    throw new Error(
      `La factura con UUID ${uuid} ya existe en la base de datos.`
    );
  }

  return {
    transmitterID: isExistTransmitter.id,
    receiverID: isExistReceiver.id,
  };
}

export async function createInvoice({
  transmitterID,
  receiverID,
  uuid,
}: {
  transmitterID: number;
  receiverID: number;
  uuid: string;
}) {
  return await prisma.$transaction((ctx) => {
    return ctx.invoices.create({
      data: {
        id: uuid,
        companyID: transmitterID,
        providerID: receiverID,
        pdf: `/invoices/pdf/${uuid}.pdf`,
        xml: `/invoices/xml/${uuid}.xml`,
      },
    });
  });
}

export async function deleteInvoiceById(id: string) {
  const result = await prisma.invoices.update({
    data: {
      isDeleted: true,
    },
    where: {
      id,
    },
  });
  if (result.isDeleted) {
    return result;
  }
  throw new Error('No se pudo eliminar la factura.');
}
