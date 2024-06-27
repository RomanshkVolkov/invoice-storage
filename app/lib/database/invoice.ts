import { auth } from '@/auth';
import prisma from './prisma';

export async function getInvoicesByDateRangeDB({
  startDate,
  endDate,
  companyID,
  isSearch = false,
}: {
  startDate: string | null;
  endDate: string | null;
  companyID: string | null;
  isSearch: boolean;
}) {
  const session = await auth();
  const isAdmin = session?.user?.type.name.toLowerCase() === 'admin';
  const query = isAdmin ? {} : { user: { id: +(session!.user!.id || 0) } };
  const companyFilter = companyID && !isSearch ? { id: +(companyID || 0) } : {};

  const currentDate = new Date();
  const date = isSearch
    ? {}
    : {
        gte: new Date(
          startDate ||
            (new Date(currentDate.setDate(currentDate.getDate() - 7)) as any)
        ),
        lte: new Date((endDate as any) || currentDate),
      };

  const invoices = await prisma.invoices.findMany({
    select: {
      id: true,
      typeID: true,
      reference: true,
      pdf: true,
      xml: true,
      dateLoad: true,
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
      date,
      company: {
        ...companyFilter,
      },
      ...query,
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
  if (!session.user?.providers) {
    throw new Error('No se pudo obtener el RFC del proveedor.');
  }

  const isExistTransmitter = await prisma.providers.findFirst({
    where: {
      rfc: transmitter,
    },
  });

  const isExistReceiver = await prisma.companies.findFirst({
    where: {
      rfc: receiver,
    },
  });

  if (!isExistTransmitter || !isExistReceiver) {
    throw new Error(
      `El RFC del emisor (${transmitter}) o receptor (${receiver}) no existe en la base de datos.`
    );
  }
  const userID = +session!.user!.id!;
  const isPermitUploadProvider = await prisma.userProviders.findFirst({
    where: {
      userID,
      providerID: isExistTransmitter.id,
    },
  });

  if (!isPermitUploadProvider) {
    throw new Error(
      `El usuario no tiene permisos para subir facturas de este proveedor. (${isExistTransmitter.name})`
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

  return {
    transmitter: isExistTransmitter,
    receiver: isExistReceiver,
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
  userID,
}: {
  transmitterID: number;
  receiverID: number;
  uuid: string;
  date: string;
  certificationTimestamp: string;
  reference: string;
  typeID: string;
  userID: number;
}) {
  return await prisma.$transaction(async (ctx) => {
    try {
      const isExistAndDeleted = await ctx.invoices.findFirst({
        where: {
          id: uuid,
          isDeleted: true,
        },
      });
      if (isExistAndDeleted) {
        const result = await ctx.invoices.update({
          data: {
            isDeleted: false,
            companyID: receiverID,
            providerID: transmitterID,
            date: new Date(date),
            certificationTimestamp: new Date(certificationTimestamp),
          },
          where: {
            id: uuid,
            isDeleted: true,
          },
        });
        if (result.id) return result;
      }
      return ctx.invoices.create({
        data: {
          id: uuid,
          companyID: receiverID,
          providerID: transmitterID,
          pdf: `/invoices/pdf/${uuid}.pdf`,
          xml: `/invoices/xml/${uuid}.xml`,
          date: new Date(date),
          certificationTimestamp: new Date(certificationTimestamp),
          reference,
          typeID,
          userID,
        },
      });
    } catch (e) {
      console.error(e);
      throw new Error('No se pudo crear la factura.');
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
