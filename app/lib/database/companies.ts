import prisma from './prisma';
import { Companies } from '@prisma/client';

export async function getCompanies() {
  return (
    (
      await prisma.companies.findMany({
        select: {
          id: true,
          name: true,
        },
      })
    )?.map((company) => ({
      label: company.name,
      value: String(company.id),
    })) || []
  );
}

export async function getCompanyByID(id: number) {
  return await prisma.companies.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      rfc: true,
      name: true,
      prefix: true,
      emails: true,
    },
  });
}

export async function getCompanyByRFC(rfc: string, id?: number) {
  return await prisma.companies.findFirst({
    where: {
      rfc,
      NOT: {
        id,
      },
    },
  });
}

export async function crudGetCompanies() {
  return await prisma.companies.findMany({
    select: {
      id: true,
      name: true,
      rfc: true,
      prefix: true,
      isDeletable: true,
    },
  });
}

export async function crudCreateCompany(
  data: Required<Omit<Companies, 'id' | 'isDeletable' | 'isDeleted'>>
) {
  const company = await prisma.companies.create({
    data,
  });
  if (company) return company;
  throw new Error('Company not created');
}

export async function crudUpdateCompany(id: number, data: Partial<Companies>) {
  const updatedCompany = await prisma.$transaction(async (ctx) => {
    const company = await ctx.companies.update({
      where: {
        id,
      },
      data,
    });
    if (company) return company;
    throw new Error('Company not found');
  });
  return updatedCompany;
}

export async function crudDeleteCompany(id: number) {
  const deleted = await prisma.companies.update({
    where: {
      id,
      isDeletable: true,
    },
    data: {
      isDeleted: true,
    },
  });

  if (deleted) return deleted;
  throw new Error('Company not found');
}
