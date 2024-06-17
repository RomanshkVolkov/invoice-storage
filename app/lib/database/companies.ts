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

export async function crudGetCompanies() {
  return await prisma.companies.findMany();
}

export async function crudCreateCompany(data: Required<Omit<Companies, 'id'>>) {
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
  const deleted = await prisma.companies.delete({
    where: {
      id,
    },
  });

  if (deleted) return deleted;
  throw new Error('Company not found');
}
