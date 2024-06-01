import { Page } from "@playwright/test";
import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"

test.describe('Страница "Мои бонусы"', () => {
    test('FB-110 autotest.web. Проверка базовых элементов на странице "Мои бонусы" (My bonuses), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedMyBonusesPage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        // Проверка не актуальна, но временно оставлена.
        // await test.step(`Проверить отображение баннера "Колесо фортуны" ("Wheel of fortune")`, async () => {
        //     await expect(authorizedMyBonusesPage.bonusWheel()).toBeVisible();
        // });

        await test.step(`Проверить отображение блока Telegram`, async () => {
            await expect(authorizedMyBonusesPage.telegramContainer()).toBeVisible();
        });

        await test.step(`Проверить отображение блока Instagram`, async () => {
            await expect(authorizedMyBonusesPage.instagramContainer()).toBeVisible();
        });

        await test.step(`Проверить отображение блока Promo Code`, async () => {
            await expect(authorizedMyBonusesPage.wheelOfFortuneContainer()).toBeVisible();
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(authorizedMyBonusesPage.legalInformationFooterHeader()).toBeVisible();
            await expect(authorizedMyBonusesPage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedMyBonusesPage.featuresFooterHeader()).toBeVisible();
            await expect(authorizedMyBonusesPage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedMyBonusesPage.otherFooterHeader()).toBeVisible();
            await expect(authorizedMyBonusesPage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedMyBonusesPage.supportFooterHeader()).toBeVisible();
            await expect(authorizedMyBonusesPage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })

    test('FB-111 autotest.web. Проверка ссылок и кнопок на странице "Мои бонусы" (My bonuses), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, context, authorizedInHousePage, authorizedMyBonusesPage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Нажать на кнопку подписки в Telegram`, async () => {
            await authorizedMyBonusesPage.telegramContainerButton().click();
        });

        await test.step(`Если при нажатии на кнопку подписки в Telegram открывается окно, то открыть телеграм в окне`, async () => {
            if (await authorizedMyBonusesPage.subscribeTelegramWindow.modalWindow().isVisible()) {
                await authorizedMyBonusesPage.subscribeTelegramWindow.submitWindowButton().click();
            }
        });
        // check telegram link

        let pages: Page[];

        await test.step(`Нажать на кнопку подписки в Telegram`, () => {
            pages = context.pages();

            const telegramUrl = pages[pages.length - 1].url();
            expect(telegramUrl).toContain("https://t.me/");
        });

        await test.step(`Закрыть вкладку`, async () => {
            await pages[pages.length - 1].close();
        });

        await test.step(`Если при нажатии на кнопку подписки в Telegram открывается окно, то закрыть телеграм в окне`, async () => {
            if (await authorizedMyBonusesPage.subscribeTelegramWindow.modalWindow().isVisible()) {
                await authorizedMyBonusesPage.subscribeTelegramWindow.closeWindowButton().click();
            }
        });

        // check instagram link
        await test.step(`Нажать на кнопку подписки в Instagram`, async () => {
            await authorizedMyBonusesPage.instagramContainerButton().click();
        });

        await test.step(`Проверка новой вкладки с ссылкой в Instagram`, async () => {
            await page.waitForTimeout(3000);
            pages = context.pages();

            const instagramUrl = pages[pages.length - 1].url();
            expect(instagramUrl).toContain("https://www.instagram.com/");
            await pages[pages.length - 1].close();
        });
    })
})