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
}: {
  transmitter: string;
  receiver: string;
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
}

export async function createInvoice() {
  return '.l.';
}
