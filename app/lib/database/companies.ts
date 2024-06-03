import prisma from './prisma';

export default async function getCompanies() {
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
