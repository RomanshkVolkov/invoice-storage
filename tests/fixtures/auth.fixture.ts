import prisma from '@/app/lib/database/prisma';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';

type UserCredentials = {
  name: string;
  email: string;
  username: string;
  password: string;
};

type AuthFixtures = {
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  userCredentials: UserCredentials;
  providerAccount: UserCredentials;
  adminAccount: UserCredentials;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await use(forgotPasswordPage);
  },
  userCredentials: async ({}, use) => {
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    await use({
      email,
      name,
      username,
      password,
    });

    await prisma.users.deleteMany({ where: { username } });
  },
  providerAccount: async ({ userCredentials }, use) => {
    const hashedPassword = await bcrypt.hash(userCredentials.password, 10);

    await prisma.users.create({
      data: {
        name: userCredentials.name,
        email: userCredentials.email,
        username: userCredentials.username,
        password: hashedPassword,
        userTypeID: 2,
      },
    });

    await use(userCredentials);
  },
  adminAccount: async ({ userCredentials }, use) => {
    const hashedPassword = await bcrypt.hash(userCredentials.password, 10);

    await prisma.users.create({
      data: {
        name: userCredentials.name,
        email: userCredentials.email,
        username: userCredentials.username,
        password: hashedPassword,
        userTypeID: 1,
      },
    });

    await use(userCredentials);
  },
});

export { expect } from '@playwright/test';
