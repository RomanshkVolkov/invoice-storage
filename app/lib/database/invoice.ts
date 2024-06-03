import { auth } from '@/auth';
import prisma from './prisma';

export async function getInvoicesByDateRangeDB({
  startDate,
  endDate,
  company,
}: {
  startDate: string | null;
  endDate: string | null;
  company: string | null;
}) {
  const session = await auth();
  const isAdmin = session?.user?.type.name.toLowerCase() === 'admin';
  const query = isAdmin ? {} : { user: { id: +(session?.user?.id || 0) } };
  const companyFilter = company ? { id: +(company || 0) } : {};
  const invoices = await prisma.invoices.findMany({
    select: {
      id: true,
      typeID: true,
      reference: true,
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
      date: {
        gte: new Date(
          startDate || new Date(new Date().setDate(new Date().getDate() - 7))
        ),
        lte: new Date(endDate || new Date()),
      },
      company: {
        ...companyFilter,
      },
      provider: {
        ...query,
      },
    },
  });

  return invoices.map((invoice) => ({
    ...invoice,
    company: invoice.company.name,
    provider: invoice.provider.name,
  }));
}

export async function getInvoiceByIdDB(id: string) {
  const invoice = await prisma.invoices.findFirst({
    select: {
      pdf: true,
      xml: true,
      type: true,
      date: true,
      certificationTimestamp: true,
    },
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!invoice) {
    throw new Error('No se encontró la factura.');
  }

  return invoice;
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
  // trasmitter -> provder
  // receiver -> company
  const session = await auth();
  if (!session) {
    throw new Error('No se pudo obtener la sesión.');
  }

  if (!session.user?.provider) {
    throw new Error('No se pudo obtener el RFC del proveedor.');
  }

  if (session.user?.provider?.rfc !== transmitter) {
    throw new Error('No puedes cargar facturas de otro proveedor.');
  }

  const isExistTransmitter = await prisma.companies.findFirst({
    where: {
      rfc: receiver,
    },
  });

  const isExistReceiver = await prisma.providers.findFirst({
    where: {
      rfc: transmitter,
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
      isDeleted: false,
    },
  });

  if (isExistInvoice) {
    throw new Error(
      `La factura con UUID ${uuid} ya existe en la base de datos.`
    );
  }

  const company = await prisma.companies.findFirst({
    where: {
      rfc: receiver,
    },
    select: {
      emails: true,
    },
  });

  return {
    transmitter: isExistTransmitter,
    receiver: isExistReceiver,
    companyEmails: company?.emails || '',
  };
}

export async function createInvoice({
  transmitterID,
  receiverID,
  uuid,
  date,
  certificationTimestamp,
  reference,
  typeID,
}: {
  transmitterID: number;
  receiverID: number;
  uuid: string;
  date: string;
  certificationTimestamp: string;
  reference: string;
  typeID: string;
}) {
  return await prisma.$transaction(async (ctx) => {
    try {
      const result = await ctx.invoices.update({
        data: {
          isDeleted: false,
          companyID: transmitterID,
          providerID: receiverID,
          date: new Date(date),
          certificationTimestamp: new Date(certificationTimestamp),
        },
        where: {
          id: uuid,
          isDeleted: true,
        },
      });
      if (result.id) return result;
    } catch (e) {
      console.error(e);
      return ctx.invoices.create({
        data: {
          id: uuid,
          companyID: transmitterID,
          providerID: receiverID,
          pdf: `/invoices/pdf/${uuid}.pdf`,
          xml: `/invoices/xml/${uuid}.xml`,
          date: new Date(date),
          certificationTimestamp: new Date(certificationTimestamp),
          reference,
          typeID,
        },
      });
    }
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
