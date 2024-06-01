import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"

test.describe('Страница "Наши игры", зарегистрированный пользователь', () => {
    test.skip('autotest.web. Проверка базовых элементов на странице "Наши игры" Hindi (In-house Games), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, authorizedSlotsPage, authorizedInHousePage, authorizedProfilePage, authorizedReferralPage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Сменить язык на хинди`, async () => {
            await authorizedInHousePage.selectLanguage("हिंदी");
        });

        //left side bar
        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(authorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toHaveCount(2);
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

        //check all games tab

        await test.step(`Проверить доступные табы на странице`, async () => {
            await expect(authorizedInHousePage.tabsGamesListValues()).toContainText(['सभी गेम', 'टॉप', 'नए']);
        });

        await test.step(`Проверить доступные табы на странице`, async () => {
            await expect(authorizedInHousePage.allGamesTab.slotsHeaderValues()).toHaveText(['मूल गेम', 'टॉप', 'नए', 'प्रदाता']);
        });

        await test.step(`Проверить заголовок раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(authorizedInHousePage.liveWinsHeader()).toHaveText("लाइव जीत");
        });

        await test.step(`Проверить табы раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(authorizedInHousePage.liveWinsTabs()).toContainText(["सभी दाँव", "मेरे दाँव", "बड़ी जीत", "ऊंची दरें"]);
        });

        await test.step(`Проверить ячейки раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(authorizedInHousePage.liveWinsCellOfTable()).toHaveText(['गेम', 'खिलाड़ी', "समय", "दाँव", 'दरें', 'भुगतान']);
        });


        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.clickOnHamburgerButton();
        });

        await test.step(`Проверить заголовки на странице`, async () => {
            await expect(authorizedSlotsPage.headerValues()).toHaveText(['लाइव जीत', 'स्लॉट्स']);
        });

        await test.step(`Проверить табы на странице`, async () => {
            const slots = await authorizedSlotsPage.getSlotsMenuValues();
            expect(slots).toContain("सभी गेम");
            expect(slots).toContain("फास्ट गेम्स");
            expect(slots).toContain("रूले");
            expect(slots).toContain("टेबल गेम्स");
            expect(slots).toContain( "वर्चुअल स्पोर्ट्स");
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "फीचर"})).toBeVisible();
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "फीचर"}).locator("//following::ul[1]/li")).toHaveText(["सहयोग प्रोग्राम", "रेफेरल सिस्टम", "बोनस सिस्टम"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "अन्य"})).toBeVisible();
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "अन्य"}).locator("//following::ul[1]/li")).toHaveText(["एप डाउनलोड करें", "नियम", "संपर्क"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "मदद"})).toBeVisible();
            await expect(authorizedInHousePage.footer().locator("h4", {hasText: "मदद"}).locator("//following::ul[1]/li")).toHaveText(["मदद 24/7"]);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить переводы кнопок в меню`, async () => {
            expect(await authorizedInHousePage.navigationMenuLogout().innerText()).toEqual("बाहर निकलिए");
            expect(await authorizedInHousePage.navigationMenuProfile().innerText()).toEqual("प्रोफाइल");
            expect(await authorizedInHousePage.navigationMenuBonus().innerText()).toEqual("मेरे बोनस");
            expect(await authorizedInHousePage.navigationMenuReferal().innerText()).toEqual("रेफरल सिस्टम");
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Проверить заголовки в описании/статистике: "Amount of bets", "Best win", "Best coeff.", "Total games"`, async () => {
            await expect(authorizedProfilePage.descriptionHeaders()).toHaveText(["दाँवों की राशि", "सर्वश्रेष्ठ जीत", "सर्वश्रेष्ठ गुणांक", "कुल गेम"]);
        });

        await test.step(`Проверить заголовки в bottom-страницы: "Contact info", "Security setup"`, async () => {
            await expect(authorizedProfilePage.settingBottomHeader()).toHaveText(["संपर्क जानकारी", "सुरक्षा और गोपनीयता"]);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Referral system"`, async () => {
            await authorizedInHousePage.navigationMenuReferal().click();
        });

        await test.step(`Проверить отображение заголовков в верхней части блока "Referral System"`, async () => {
            await expect(authorizedReferralPage.referalBlocksHeaders()).toHaveText(["कुल रेफ़रल", "आज के लिए रजिस्ट्रेशन", "आज की आय", "पूरे समय की आय"]);
        });

        await test.step(`Проверить отображение в блоке "Referral info" header-а`, async () => {
            await expect(authorizedReferralPage.referalInfoHeader()).toContainText(["पार्टनर प्रोग्राम"]);
            await expect(authorizedReferralPage.referalInfoHeader()).toContainText(["में भाग लेकर लाभ कमाइए"]);
        });

        await test.step(`Проверить отображение в таблице "TOP 10 affiliates" столбцов`, async () => {
            await expect(authorizedReferralPage.referalTableHeader()).toHaveText("टॉप 10 पार्टनर");
            await expect(authorizedReferralPage.referalTableTheadElements()).toHaveText('#पार्टनररेफ़रलआयइनाम');
        });
    })
})