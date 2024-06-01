import { expect, test } from "../../../src/web/base/pomFixture"

test.describe('Страница "Слоты", незарегистрированный пользователь', () => {
    test('FB-103 autotest.web. Проверка базовых элементов на странице "Слоты" (Slots), незарегистрированный пользователь  @regression @prod @dev @web ', async ({ page, unauthorizedInHousePage, unauthorizedSlotsPage, }) => {
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
        }, 10000);
       
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Дождаться появления окна с регистрацией`, async () => {
            await unauthorizedInHousePage.waitForRegisteredWindowEnabled();
        });


        await test.step(`Поменять язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await unauthorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await unauthorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
        });

        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
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

        await test.step(`Проверить заголовки на странице`, async () => {
            await expect(unauthorizedSlotsPage.headerValues()).toHaveText('Slots');
        });

        let slots: string[] = [];

        await test.step(`Проверить доступные табы на странице`, async () => {
            slots = await unauthorizedSlotsPage.getSlotsMenuValues();
        });


        for (let i = 0; i < (slots.length > 3 ? 3 : slots.length); i++) {
            await test.step(`Нажать на любой доступный таб`, async () => {
                await unauthorizedSlotsPage.clickOnSlotsMenu(slots[i]);
                await page.waitForLoadState('networkidle');
                await expect(unauthorizedSlotsPage.slotsTab.searchPlace()).toBeVisible();
            });

            await test.step(`Проверить количество отображаемых иконок игр`, async () => {
                const countGamesInSlotsBox = await unauthorizedSlotsPage.slotsTab.gamesInSlotsBox().count();
                expect(countGamesInSlotsBox).toBeGreaterThanOrEqual(1);

                if (await unauthorizedSlotsPage.slotsTab.textDisplayMore().isVisible()) {
                    await expect(unauthorizedSlotsPage.slotsTab.showMoreButton()).toBeVisible();
                }
            });
        }

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

    test('FB-105 autotest.web. Проверка игр на странице "Слоты" (Slots), незарегистрированный пользователь  @regression @prod @dev @web ', async ({ page,unauthorizedInHousePage, unauthorizedSlotsPage, gamePage }) => {
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

        await test.step(`Поменять язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await unauthorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await unauthorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
        });

        const slots: string[] = await unauthorizedSlotsPage.getSlotsMenuValues();

        for (let i = 0; i < 1; i++) {
            await test.step(`Нажать на любой доступный таб`, async () => {
                const rand = Math.floor(Math.random() * slots.length);
                await unauthorizedSlotsPage.clickOnSlotsMenu(slots[rand]);
            });

            await test.step(`Нажать на первую игру в разделе`, async () => {
                await unauthorizedSlotsPage.slotsTab.clickOnFirstGameInSlots();

                if (!await gamePage.loginLabel().isVisible()) {
                    await expect(gamePage.gameFrame()).toBeVisible();
                }
            });

            await test.step(`Перейти назад`, async () => {
                await page.goBack();
            });
        }
    })

    test('FB-106 autotest.web. Проверка базовых элементов и игр на странице "Слоты" (Slots) в разделе провайдеров, незарегистрированный пользователь  @regression @prod @dev @web ', async ({ page, unauthorizedInHousePage, unauthorizedSlotsPage, gamePage }) => {
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
        }, 5000);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Поменять язык на английский`, async () => {
            await unauthorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await unauthorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await unauthorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
        });

        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
            await expect(unauthorizedInHousePage.mainLeftSidebar.leftSideBarOnInHousePageBanner()).toBeVisible();
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

        await test.step(`Проверить количество отображаемых иконок игр`, async () => {
            const countGamesInSlotsBox = await unauthorizedSlotsPage.providersSlotsTab.gamesInSlotsBox().count();
            expect(countGamesInSlotsBox).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Нажать на первую игру в разделе`, async () => {
            await unauthorizedSlotsPage.providersSlotsTab.clickOnFirstGameInSlots();

            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible({ timeout: 7000}) && !await gamePage.gameWithoutFrame().isVisible({ timeout: 7000}) && !await gamePage.gameWithoutFrameTypeTwo().nth(0).isVisible({ timeout: 7000})) {
                await expect(gamePage.loginLabel()).toHaveText("Please log in to play");
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });

        await test.step(`Проверить конец раздела с играми`, async () => {
            if (await unauthorizedSlotsPage.providersSlotsTab.textDisplayMore().isVisible()) {
                await expect(unauthorizedSlotsPage.providersSlotsTab.showMoreButton()).toBeVisible();
            }
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
})