import { expect, test } from "../../../src/web/base/pomFixture"

test.describe('Страница "Наши игры", незарегистрированный пользователь', () => {
    test('FB-97 autotest.web. Проверка базовых элементов на странице "Наши игры" (In-house Games), незарегистрированный пользователь @regression @prod @dev @web ', async ({ page, unauthorizedInHousePage }) => {
        const interval = setInterval(() => {
            unauthorizedInHousePage.registerWindow.windowLocatorBanner().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await unauthorizedInHousePage.registerWindow.closeRegisterWindow();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 30000);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Дождаться появления окна с регистрацией`, async () => {
            await unauthorizedInHousePage.waitForRegisteredWindowEnabled();
        });

        await test.step(`Сменить язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarProfile()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSidebarHelp()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarCasinoBlock()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarSportBlock()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonAndroid()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarInstallButtonIos()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkInst()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTwitter()).toBeVisible();
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarSocialLinkTelegram()).toBeVisible();
        });

        await test.step(`Проверить доступные табы на странице`, async () => {
            await expect(unauthorizedInHousePage.tabsGamesListValues()).toContainText(['All Games', 'Top', 'New']);
        });

        await test.step(`Проверить доступные табы на странице`, async () => {
            await expect(unauthorizedInHousePage.allGamesTab.slotsHeaderValues()).toContainText(['Original games', 'Top', 'New', 'Providers']);
        });

        const countOriginalGamesSection = await unauthorizedInHousePage.allGamesTab.gamesInOriginalGamesSection().count();
        let countGamesInTopSection = await unauthorizedInHousePage.allGamesTab.gamesInTopSection().count();
        let countGamesInNewSection = await unauthorizedInHousePage.allGamesTab.gamesInNewSection().count();
        const countOfProvidersSection = await unauthorizedInHousePage.allGamesTab.providersInProvidersSection().count();

        await test.step(`Проверить количество отображаемых иконок игр в разделе Original games`, () => {
            expect(countOriginalGamesSection).toBeGreaterThanOrEqual(1);
        });
        await test.step(`Проверить количество отображаемых иконок игр в разделе Top`, () => {
            expect(countGamesInTopSection).toBeGreaterThanOrEqual(1);
        });
        await test.step(`Проверить количество отображаемых иконок игр в разделе New`, () => {
            expect(countGamesInNewSection).toBeGreaterThanOrEqual(1);
        });
        await test.step(`Проверить количество отображаемых логотипов провайдеров в разделе Providers`, () => {
            expect(countOfProvidersSection).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Проверить заголовок раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(unauthorizedInHousePage.liveWinsHeader()).toHaveText("Live wins");
        });

        await test.step(`Проверить табы раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(unauthorizedInHousePage.liveWinsButtons()).toHaveText(["All bets", "Big Wins", "High Rates"]);
        });

        await test.step(`Проверить ячейки раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(unauthorizedInHousePage.liveWinsCellOfTable()).toHaveText(['Games', 'Player', "Time", "Bets", 'Rates', 'Payout']);
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(unauthorizedInHousePage.legalInformationFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(unauthorizedInHousePage.featuresFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(unauthorizedInHousePage.otherFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(unauthorizedInHousePage.supportFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });

        //check top games tab
        await test.step(`Нажать на таб "Top"`, async () => {
            await unauthorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Проверить количество отображаемых иконок игр в разделе Top`, async () => {
            await expect(unauthorizedInHousePage.topGamesTab.slotsHeaderValues()).toContainText(['Top', 'Providers']);

            countGamesInTopSection = await unauthorizedInHousePage.topGamesTab.gamesInTopSection().count();
            expect(countGamesInTopSection).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(unauthorizedInHousePage.legalInformationFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(unauthorizedInHousePage.featuresFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(unauthorizedInHousePage.otherFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(unauthorizedInHousePage.supportFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });

        //check new games tab
        await test.step(`Нажать на таб "New"`, async () => {
            await unauthorizedInHousePage.clickOnGamesTab("New");
        });

        await test.step(`Проверить количество отображаемых иконок игр в разделе New`, async () => {
            await expect(unauthorizedInHousePage.tabsGamesListValues()).toContainText(['All Games', 'Top', 'New']);
            await expect(unauthorizedInHousePage.newGamesTab.slotsHeaderValues()).toContainText(['New', 'Providers']);

            countGamesInNewSection = await unauthorizedInHousePage.newGamesTab.gamesInNewSection().count();
            expect(countGamesInNewSection).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(unauthorizedInHousePage.legalInformationFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(unauthorizedInHousePage.featuresFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(unauthorizedInHousePage.otherFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(unauthorizedInHousePage.supportFooterHeader()).toBeVisible();
            await expect(unauthorizedInHousePage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })

    test('FB-99 autotest.web. Проверка игр на табе "All Tabs" (Разделы: Original Games, Top, New) под неавторизованным пользователем. Запуск игры из каждого раздела @regression @prod @dev @web ', async ({ page, unauthorizedInHousePage, gamePage }) => {
        const interval = setInterval(() => {
            unauthorizedInHousePage.registerWindow.windowLocatorBanner().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await unauthorizedInHousePage.registerWindow.closeRegisterWindow();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 30000);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Сменить язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        //check all games tab
        await test.step(`Нажать на первую игру в разделе "Original Games"`, async () => {
            await unauthorizedInHousePage.allGamesTab.clickOnFirstGameInOriginalGames();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000 })) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });

        await test.step(`Нажать на первую игру в разделе "Top"`, async () => {
            await unauthorizedInHousePage.allGamesTab.clickOnFirstGameInTopSelection();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000 })) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });

        await test.step(`Нажать на первую игру в разделе "New"`, async () => {
            await unauthorizedInHousePage.allGamesTab.clickOnFirstGameInNewSelection();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000 })) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });
    })

    test('FB-101 autotest.web. Проверка игр на табе "Top" и "New Games" под неавторизованным пользователем. Запуск игры из каждого раздела @regression @prod @dev @web ', async ({ page, unauthorizedInHousePage, gamePage }) => {
        const interval = setInterval(() => {
            unauthorizedInHousePage.registerWindow.windowLocatorBanner().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await unauthorizedInHousePage.registerWindow.closeRegisterWindow();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 20000);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Сменить язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        //check top games tab
        await test.step(`Нажать на таб "Top"`, async () => {
            await unauthorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Нажать на первую игру в разделе "Top"`, async () => {
            await unauthorizedInHousePage.topGamesTab.clickOnFirstGameInTopSelection();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000 })) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });

        await test.step(`Нажать на таб "New"`, async () => {
            await unauthorizedInHousePage.clickOnGamesTab("New");
        });

        await test.step(`Нажать на первую игру в разделе "New"`, async () => {
            await unauthorizedInHousePage.newGamesTab.clickOnFirstGameInNewSelection();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000 }) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000 })) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });
    })
})