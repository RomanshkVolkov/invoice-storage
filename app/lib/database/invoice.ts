import { auth } from '@/auth';
import prisma from './prisma';

export async function getInvoices({
  startDate,
  endDate,
}: {
  startDate: string | null;
  endDate: string | null;
}) {
  const session = await auth();
  const isAdmin = session?.user?.type.name.toLowerCase() === 'admin';
  const query = isAdmin ? {} : { user: { id: +(session?.user?.id || 0) } };
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
      certificationTimestamp: {
        gte: new Date(
          startDate || new Date(new Date().setDate(new Date().getDate() - 7))
        ),
        lte: new Date(endDate || new Date()),
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

export async function validateInvoiceData({
  transmitter,
  receiver,
  uuid,
}: {
  transmitter: string;
  receiver: string;
  uuid: string;
}) {
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
  date,
  certificationTimestamp,
}: {
  transmitterID: number;
  receiverID: number;
  uuid: string;
  date: string;
  certificationTimestamp: string;
}) {
  return await prisma.$transaction((ctx) => {
    return ctx.invoices.create({
      data: {
        id: uuid,
        companyID: transmitterID,
        providerID: receiverID,
        pdf: `/invoices/pdf/${uuid}.pdf`,
        xml: `/invoices/xml/${uuid}.xml`,
        date: new Date(date),
        certificationTimestamp: new Date(certificationTimestamp),
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
