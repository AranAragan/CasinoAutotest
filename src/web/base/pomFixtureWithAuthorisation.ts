/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { test as baseTest } from '@playwright/test';
import UnauthorizedMainPage from "../pages/basePages/unauthorizedMainPage";
import AuthorizedMainPage from '../pages/basePages/authorizedMainPage';
import GamePage from '../pages/gamePage';
import UnauthorizedSlotsPage from '../pages/unauthorized/unauthorizedSlotsPage';
import AuthorizedSlotsPage from '../pages/authorized/authorizedSlotsPage';
import AuthorizedInHousePage from '../pages/authorized/authorizedInHousePage';
import UnauthorizedInHousePage from '../pages/unauthorized/unauthorizedInHousePage';
import AuthorizedProfilePage from '../pages/authorized/authorizedProfilePage';
import AuthorizedMyBonusesPage from '../pages/authorized/authorizedMyBonusesPage';
import AuthorizedReferralPage from '../pages/authorized/authorizedReferralPage';
import CryptosGamePage from '../pages/cryptosGamePage';
import fs from 'fs';
import path from 'path';

type pages = {
    unauthorizedMainPage: UnauthorizedMainPage;
    authorizedMainPage: AuthorizedMainPage;
    unauthorizedSlotsPage: UnauthorizedSlotsPage;
    authorizedSlotsPage: AuthorizedSlotsPage;
    gamePage: GamePage;
    cryptosGamePage: CryptosGamePage;
    authorizedInHousePage: AuthorizedInHousePage;
    unauthorizedInHousePage: UnauthorizedInHousePage;
    authorizedProfilePage: AuthorizedProfilePage;
    authorizedReferralPage: AuthorizedReferralPage;
    authorizedMyBonusesPage: AuthorizedMyBonusesPage;
}

const allPages = baseTest.extend<pages, { workerStorageState: string }>({
    unauthorizedInHousePage: async ({ page }, use) => {
        await use(new UnauthorizedInHousePage(page));
    },

    authorizedInHousePage: async ({ page }, use) => {
        await use(new AuthorizedInHousePage(page));
    },

    unauthorizedSlotsPage: async ({ page }, use) => {
        await use(new UnauthorizedSlotsPage(page));
    },

    authorizedSlotsPage: async ({ page }, use) => {
        await use(new AuthorizedSlotsPage(page));
    },

    authorizedProfilePage: async ({ page }, use) => {
        await use(new AuthorizedProfilePage(page));
    },

    authorizedReferralPage: async ({ page }, use) => {
        await use(new AuthorizedReferralPage(page));
    },

    gamePage: async ({ page }, use) => {
        await use(new GamePage(page));
    },

    authorizedMyBonusesPage: async ({ page }, use) => {
        await use(new AuthorizedMyBonusesPage(page));
    },

    cryptosGamePage: async ({page}, use) => {
        await use(new CryptosGamePage(page));
    },

    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    workerStorageState: [async ({ browser }, use) => {
        // Use parallelIndex as a unique identifier for each worker.
        const id = test.info().parallelIndex;
        const fileName = path.resolve(__dirname, `auth_temp/${id}.json`);

        if (fs.existsSync(fileName)) {
            // Reuse existing authentication state if any.
            await use(fileName);
            return;
        }

        const page = await browser.newPage({ storageState: undefined });
        
        const account = await acquireAccount(id);

        // Переход на страницу, ожидание окна
        await page.goto(process.env.BASE_URL!, { timeout: 100000, waitUntil: 'load' });
        await page.waitForSelector("//div[@class = 'modalContent']/ancestor::div[contains(@class,'ModalContainerContent')]", { timeout: 50000 })
        await page.locator("button[class*='ModalContainerBtnClose']").click();

        // Авторизация
        await page.locator("button[class*='AuthButton']:not([class*='registerButton'])").click();
        await page.locator('input[name="username"]').fill(account.username);
        await page.locator('input[name="password"]').fill(account.password);
        await page.locator("button[type='submit']").click();
        // Сохранение контекста страницы для тестов
        await page.waitForTimeout(5000);
        await page.context().storageState({ path: fileName });
        await page.close();
        await use(fileName);
    }, { scope: 'worker' }],
}
)

export const test = allPages;
export const expect = allPages.expect;


function acquireAccount(id: number) {
    const filePath = path.resolve(__dirname, `auth_data/${process.env.STAND}/${id}.json`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Account file not found for id: ${id}`);
    }

    const accountData = fs.readFileSync(filePath, 'utf-8');
    const account = JSON.parse(accountData);

    return account;
}