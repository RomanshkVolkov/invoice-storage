import { test as base } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Providers } from '@prisma/client';
import { randomRFC } from '@/app/lib/utils';
import prisma from '@/app/lib/database/prisma';

type ProviderFixtures = {
  provider: Omit<Providers, 'id'>;
};

export const test = base.extend<ProviderFixtures>({
  provider: async ({}, use) => {
    const rfc = randomRFC();
    const name = faker.company.name();
    const email = faker.internet.email({
      firstName: name,
    });
    const zipcode = +faker.location.zipCode();

    await use({
      rfc,
      name,
      email,
      zipcode,
      isDeleted: false,
    });

    await prisma.providers.deleteMany({ where: { rfc } });
  },
});
