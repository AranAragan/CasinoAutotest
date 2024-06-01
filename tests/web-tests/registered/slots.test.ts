import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"

test.describe('Страница "Слоты"', () => {
    test('FB-104 autotest.web. Проверка базовых элементов на странице "Слоты" (Slots), зарегистрированный пользователь  @regression @prod @dev @web ', async ({ page, authorizedSlotsPage, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Поменять язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
        });

        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarProfile()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSidebarHelp()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarCasinoBlock()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSportBlock()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonAndroid()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonIos()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkInst()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTwitter()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTelegram()).toBeVisible();
        });

        await test.step(`Проверить заголовки на странице`, async () => {
            await expect(authorizedSlotsPage.headerValues()).toHaveText('Slots');
        });

        const slots = await test.step(`Проверить доступные табы на странице`, async () => {
            return await authorizedSlotsPage.getSlotsMenuValues();
        });

        const rand = Math.floor(Math.random() * slots.length);

        await test.step(`Нажать на любой доступный таб`, async () => {
            await authorizedSlotsPage.clickOnSlotsMenu(slots[rand]!);
            await expect(authorizedSlotsPage.slotsTab.searchPlace()).toBeVisible();
        });

        await test.step(`Проверить количество отображаемых иконок игр`, async () => {
            const countGamesInSlotsBox = await authorizedSlotsPage.slotsTab.gamesInSlotsBox().count();
            expect(countGamesInSlotsBox).toBeGreaterThanOrEqual(1);

            if (await authorizedSlotsPage.slotsTab.textDisplayMore().isVisible()) {
                await expect(authorizedSlotsPage.slotsTab.showMoreButton()).toBeVisible();
            }
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(authorizedSlotsPage.legalInformationFooterHeader()).toBeVisible();
            await expect(authorizedSlotsPage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedSlotsPage.featuresFooterHeader()).toBeVisible();
            await expect(authorizedSlotsPage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedSlotsPage.otherFooterHeader()).toBeVisible();
            await expect(authorizedSlotsPage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedSlotsPage.supportFooterHeader()).toBeVisible();
            await expect(authorizedSlotsPage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })

    test('FB-108 autotest.web. Проверка игр на странице "Слоты" (Slots), зарегистрированный пользователь  @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedSlotsPage, gamePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Поменять язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
            await page.waitForTimeout(5000);
        });

        const slots = await authorizedSlotsPage.getSlotsMenuValues();

        await test.step(`Нажать на любой доступный таб`, async () => {
            const rand = Math.floor(Math.random() * slots.length);
            await authorizedSlotsPage.clickOnSlotsMenu(slots[rand]!);
            await authorizedSlotsPage.slotsTab.clickOnFirstGameInSlots();
            await page.waitForTimeout(5000);
        });

        await test.step(`Нажать на первую игру в разделе`, async () => {
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible() && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

    })

    test('FB-109 autotest.web. Проверка базовых элементов и игр на странице "Слоты" (Slots) в разделе провайдеров, зарегистрированный пользователь  @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedSlotsPage, gamePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Поменять язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
        });

        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarProfile()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSidebarHelp()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarCasinoBlock()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSportBlock()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonAndroid()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonIos()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkInst()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTwitter()).toBeVisible();
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTelegram()).toBeVisible();
        });

        await test.step(`Проверить количество отображаемых иконок игр`, async () => {
            const countGamesInSlotsBox = await authorizedSlotsPage.providersSlotsTab.gamesInSlotsBox().count();
            expect(countGamesInSlotsBox).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Нажать на первую игру в разделе`, async () => {
            await authorizedSlotsPage.providersSlotsTab.clickOnFirstGameInSlots();
            await page.waitForTimeout(5000);

            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible() && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

        await test.step(`Проверить конец раздела с играми`, async () => {
            if (await authorizedSlotsPage.providersSlotsTab.textDisplayMore().isVisible()) {
                await expect(authorizedSlotsPage.providersSlotsTab.showMoreButton()).toBeVisible();
            }
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(authorizedInHousePage.legalInformationFooterHeader()).toBeVisible();
            await expect(authorizedInHousePage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedInHousePage.featuresFooterHeader()).toBeVisible();
            await expect(authorizedInHousePage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedInHousePage.otherFooterHeader()).toBeVisible();
            await expect(authorizedInHousePage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedInHousePage.supportFooterHeader()).toBeVisible();
            await expect(authorizedInHousePage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })
})