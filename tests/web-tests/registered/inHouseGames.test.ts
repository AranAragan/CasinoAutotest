import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"
import { v4 as uuidv4 } from 'uuid';

const depositURL = 'https://api.dev.amxeox.xyz/cash/deposit';
const token = `RJ9iMCoBm3Rb5IPhfbr7K8QYmO97cQbf`


test.describe('Страница "Наши игры", зарегистрированный пользователь', () => {
    test('FB-98 autotest.web. Проверка базовых элементов на странице "Наши игры" (In-house Games), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        //left side bar
        await test.step(`Проверить наличие ссылок в левом сайд-баре`, async () => {
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
            await expect(authorizedInHousePage.tabsGamesListValues()).toContainText(['All Games', 'Top', 'New']);
        });

        await test.step(`Проверить доступные табы на странице`, async () => {
            await expect(authorizedInHousePage.allGamesTab.slotsHeaderValues()).toContainText(['Original games', 'Top', 'New', 'Providers']);
        });

        const countOriginalGamesSection = await authorizedInHousePage.allGamesTab.gamesInOriginalGamesSection().count();
        let countGamesInTopSection = await authorizedInHousePage.allGamesTab.gamesInTopSection().count();
        let countGamesInNewSection = await authorizedInHousePage.allGamesTab.gamesInNewSection().count();
        const countOfProvidersSection = await authorizedInHousePage.allGamesTab.providersInProvidersSection().count();

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
            await expect(authorizedInHousePage.liveWinsHeader()).toHaveText("Live wins");
        });

        await test.step(`Проверить табы раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(authorizedInHousePage.liveWinsTabs()).toContainText(["All bets", "My bets", "Big Wins", "High Rates"]);
        });

        await test.step(`Проверить ячейки раздела "Live wins" (Таблица победителей)`, async () => {
            await expect(authorizedInHousePage.liveWinsCellOfTable()).toHaveText(['Games', 'Player', "Time", "Bets", 'Rates', 'Payout']);
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

        //check top games tab
        await test.step(`Нажать на таб "Top"`, async () => {
            await authorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Проверить количество отображаемых иконок игр в разделе Top`, async () => {
            await expect(authorizedInHousePage.topGamesTab.slotsHeaderValues()).toContainText(['Top', 'Providers']);

            countGamesInTopSection = await authorizedInHousePage.topGamesTab.gamesInTopSection().count();
            expect(countGamesInTopSection).toBeGreaterThanOrEqual(1);
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

        await test.step(`Нажать на таб "New"`, async () => {
            await authorizedInHousePage.clickOnGamesTab("New");
        });

        await test.step(`Проверить количество отображаемых иконок игр в разделе New`, async () => {
            await expect(authorizedInHousePage.tabsGamesListValues()).toContainText(['All Games', 'Top', 'New']);
            await expect(authorizedInHousePage.newGamesTab.slotsHeaderValues()).toContainText(['New', 'Providers']);

            countGamesInNewSection = await authorizedInHousePage.newGamesTab.gamesInNewSection().count();
            expect(countGamesInNewSection).toBeGreaterThanOrEqual(1);
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

    test('FB-100 autotest.web. Проверка игр на табе "All Tabs" (Разделы: Original Games, Top, New) под авторизованным пользователем. Запуск игры из каждого раздела @regression @prod @dev @web ', async ({ page, authorizedInHousePage, gamePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        //check all games tab
        await test.step(`Нажать на первую игру в разделе "Original Games"`, async () => {
            await authorizedInHousePage.allGamesTab.clickOnFirstGameInOriginalGames();
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

        await test.step(`Нажать на первую игру в разделе "Top"`, async () => {
            await authorizedInHousePage.allGamesTab.clickOnFirstGameInTopSelection();
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

        await test.step(`Нажать на первую игру в разделе "New"`, async () => {
            await authorizedInHousePage.allGamesTab.clickOnFirstGameInNewSelection();
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });
    })

    test('FB-102 autotest.web. Проверка игр на табе "Top" и "New Games" под авторизованным пользователем. Запуск игры из каждого раздела @regression @prod @dev @web ', async ({ page, authorizedInHousePage, gamePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        //check top games tab
        await test.step(`Нажать на таб "Top"`, async () => {
            await authorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Нажать на первую игру в разделе "Top"`, async () => {
            await authorizedInHousePage.topGamesTab.clickOnFirstGameInTopSelection();
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

        //check new games tab
        await test.step(`Нажать на таб "New"`, async () => {
            await authorizedInHousePage.clickOnGamesTab("New");
        });

        await test.step(`Нажать на первую игру в разделе "New"`, async () => {
            await authorizedInHousePage.newGamesTab.clickOnFirstGameInNewSelection();
            await page.waitForTimeout(5000);
            if (!await gamePage.gameFrame().isVisible() && !await gamePage.gameWithoutFrame().isVisible()) {
                await expect(authorizedInHousePage.depositWindow.depositHeader()).toBeVisible();
                await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            } else {
                await page.goBack();
            }
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });
    })

    test('FB-116 autotest.web. autotest.web. Проверка возможности перехода из открытой игры по "Хлебным крошкам" на страницу Slots @regression @dev @web ', async ({ page, context, authorizedInHousePage, gamePage, authorizedSlotsPage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });


        await test.step(`Выбрать игру Jackpot`, async () => {
            await authorizedInHousePage.allGamesTab.openJackpotGame();
        });

        //check new games tab
        await test.step(`Нажать на ссылку "Slots" в хлебных крошках`, async () => {
            await gamePage.gameSlotsLink().click();
        });

        await test.step(`Проверить открытие страницы Slots`, async () => {
            await expect(authorizedSlotsPage.headerValues()).toHaveText('Slots');
            const pages = context.pages();

            const slotsUrl = pages[pages.length - 1].url();
            expect(slotsUrl).toContain("slots");
        });
    })

    test('FB-22 web+mobile.Карусель с играми @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Переключиться на соответствующую вкладку для отображения навигации со стрелками`, async () => {
            await authorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Проверить отображение игр и стрелочек`, async () => {
            const countGamesInTopSection = await authorizedInHousePage.topGamesTab.gamesInTopSection().count();
            if (countGamesInTopSection > 8) {
                await expect(authorizedInHousePage.topGamesTab.gamesInTopSectionPrevButton()).toBeDisabled();
                await expect(authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton()).toBeEnabled();
            }
        });

        await test.step(`Пролистать игры максимально вправо`, async () => {
            if(await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().isVisible()){
                while (await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().isEnabled()) {
                    await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().click();
                }
            }
            

            const countGamesInTopSection = await authorizedInHousePage.topGamesTab.gamesInTopSection().count();
            expect(countGamesInTopSection).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Пролистать игры максимально влево`, async () => {
            if(await authorizedInHousePage.topGamesTab.gamesInTopSectionPrevButton().isVisible()){
            while (await authorizedInHousePage.topGamesTab.gamesInTopSectionPrevButton().isEnabled()) {
                await authorizedInHousePage.topGamesTab.gamesInTopSectionPrevButton().click();
            }}
        });

        await test.step(`Пролистать игры максимально вправо`, async () => {
            if(await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().isVisible()){
            while (await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().isEnabled()) {
                await authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton().click();
            }}
        });

        await test.step(`Нажать на таб "New"`, async () => {
            await authorizedInHousePage.clickOnGamesTab("New");
        });

        await test.step(`Проверить отображение игр и стрелочек`, async () => {
            const countGamesInNewSection = await authorizedInHousePage.newGamesTab.gamesInNewSection().count();
            if (countGamesInNewSection > 8) {
                await expect(authorizedInHousePage.newGamesTab.gamesInNewSectionPrevButton()).toBeDisabled();
                await expect(authorizedInHousePage.newGamesTab.gamesInNewSectionNextButton()).toBeEnabled();
            }
        });

        await test.step(`Перейти на предыдущую вкладку`, async () => {
            await authorizedInHousePage.clickOnGamesTab("Top");
        });

        await test.step(`Проверить сброс на первый экран с играми, стрелочка справа неактивна`, async () => {
            const countGamesInTopSection = await authorizedInHousePage.topGamesTab.gamesInTopSection().count();
            if (countGamesInTopSection > 8) {
                await expect(authorizedInHousePage.topGamesTab.gamesInTopSectionPrevButton()).toBeDisabled();
                await expect(authorizedInHousePage.topGamesTab.gamesInTopSectionNextButton()).toBeEnabled();
            }
        });

        await test.step(`Пролистать блок с провайдерами максимально вправо и влево`, async () => {
            if(await authorizedInHousePage.topGamesTab.providersSectionNextButton().isVisible()){
            while (await authorizedInHousePage.topGamesTab.providersSectionNextButton().isEnabled()==true) {
                await authorizedInHousePage.topGamesTab.providersSectionNextButton().click();
            }
            console.log(await authorizedInHousePage.topGamesTab.providersSectionPrevButton().isEnabled())
        }
       if(await authorizedInHousePage.topGamesTab.providersSectionPrevButton().isVisible()){
            while (await authorizedInHousePage.topGamesTab.providersSectionPrevButton().isEnabled()==true) {
                await authorizedInHousePage.topGamesTab.providersSectionPrevButton().click();
            }
        }
        });
    })

    test('FB-71 web+mobile.Взаимодействие с навигационным меню @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedSlotsPage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: "networkidle" });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        let nameOfProvider: string | null;
        await test.step(`Кликнуть на иконку первого провайдера`, async () => {
            nameOfProvider = await authorizedInHousePage.allGamesTab.providersInProvidersSection().nth(0).locator('img').getAttribute('alt');
            await authorizedInHousePage.allGamesTab.providersInProvidersSection().nth(0).click();
        });

        await test.step(`Проверить переход в раздел Slots для выбранного провайдера`, async () => {
            await expect(authorizedSlotsPage.mainLink()).toBeVisible();
            await expect(authorizedSlotsPage.allGamesLink()).toBeVisible();
            await expect(authorizedSlotsPage.slotsLink()).toBeVisible();
            await expect(authorizedSlotsPage.providersTitleBox().locator("span", { hasText: nameOfProvider! }).nth(0)).toBeVisible();
        });

        await test.step(`Перейти назад`, async () => {
            await page.goBack();
        });
    })

    test('FB-73 web+mobile.Карусель с провайдерами @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: "networkidle" });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Пролистать провайдеры до конца вправо`, async () => {
            
            if(await authorizedInHousePage.allGamesTab.providersSectionNextButton().isVisible()){
                await expect(authorizedInHousePage.allGamesTab.providersSectionPrevButton()).toBeDisabled();
            while (await authorizedInHousePage.allGamesTab.providersSectionNextButton().isEnabled()) {
                await authorizedInHousePage.allGamesTab.providersSectionNextButton().click();
            }
            await expect(authorizedInHousePage.allGamesTab.providersInProvidersSection().nth(0)).not.toHaveClass("slick-active");
        }     
        });

        await test.step(`Пролистать провайдеры до конца влево`, async () => {
            
            if(await authorizedInHousePage.allGamesTab.providersSectionPrevButton().isVisible()){
                await expect(authorizedInHousePage.allGamesTab.providersSectionNextButton()).toBeDisabled();
            while (await authorizedInHousePage.allGamesTab.providersSectionPrevButton().isEnabled()) {
                await authorizedInHousePage.allGamesTab.providersSectionPrevButton().click();
            }
            await expect(authorizedInHousePage.allGamesTab.providersInProvidersSection().nth(0)).toHaveClass("slick-active");
        }
            
        });
    })

    test('FB-76 web+mobile.Взаимодействие с Лентой выигрышей @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Проверить строки в таблице "Live wins" (вкладки Все ставки, Большие выигрыши, Высокие коэффициенты)`, async () => {
            const allBetsRow = await authorizedInHousePage.liveWinsRow().allInnerTexts();
            await authorizedInHousePage.liveWinsTabs().getByText('Big wins').click();
            const bigWinsRow = await authorizedInHousePage.liveWinsRow().allInnerTexts();
            await authorizedInHousePage.liveWinsTabs().getByText('High Rates').click();
            const highRatesRow = await authorizedInHousePage.liveWinsRow().allInnerTexts();

            expect(allBetsRow).not.toEqual(bigWinsRow);
            expect(bigWinsRow).not.toEqual(highRatesRow);
            expect(highRatesRow).not.toEqual(allBetsRow);
        });

        await test.step(`Проверить открытие окна юзера в таблице со ставками при клике на его логин`, async () => {
            const username = await authorizedInHousePage.openUserWindowInLiveWinsTable(1);
            expect(await authorizedInHousePage.liveWinsUserWindow.userLogin().innerText()).toEqual(username);
            await authorizedInHousePage.liveWinsUserWindow.closeModalWindow().click();
        });

        await test.step(`Проверить, что при нажатии на любой из столбцев таблица не сортируется`, async () => {
            const allBetsRowBeforeClickColumn = await authorizedInHousePage.liveWinsRow().allInnerTexts();
            const allBetsRowAfterClickColumn = await authorizedInHousePage.liveWinsRow().allInnerTexts();
            expect(allBetsRowBeforeClickColumn).toEqual(allBetsRowAfterClickColumn);
        });

        await test.step(`В High Rates Отображаются 8 последних выигрышей пользователей, коэффициент которых превышает 25.0.`, async () => {
            const countRow = await authorizedInHousePage.findCountRowsInLiveWinsTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            // for (let i = 1; i <= countRow; i++) {
            //     let tableBlock = await authorizedInHousePage.findRatesCellInLiveWinsTableHighRates(i);
            //     let rate = parseFloat((await tableBlock.innerText()).replace("x", ""));
            //     expect (rate).toBeGreaterThanOrEqual(25.0)
            // }
        });
    })

    test('FB-77 web.Отображение сыгранных ставок во вкладке Мои ставки @regression @dev @web ', async ({ page, authorizedInHousePage, authorizedSlotsPage, request, cryptosGamePage }) => {
        let loginUser: string = '';
        let userId: string = '';
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбать логин`, async () => {
            loginUser = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            userId = await authorizedInHousePage.navigationMenuUserId().innerText();
        });

        await test.step(`Закрыть выпадающий список`, async () => {
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        const generatedUUID = uuidv4();

        const newIssue = await request.post(depositURL, {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: userId,
                amount: "0.1",
                currency: "BTC",
                order_id: generatedUUID,
            }
        });
        expect(newIssue.ok()).toBeTruthy();

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
            await authorizedSlotsPage.clickOnSlotsMenu("All Games");
        });

        await test.step(`Нажать на провайдера в списке провайдеров`, async () => {
            await authorizedSlotsPage.selectProviderInProviderList("InOut");
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedSlotsPage.selectCurrency("Bitcoin");
        });

        await test.step(`Открыть Cryptos`, async () => {
            await authorizedSlotsPage.providersSlotsTab.cryptosGame().click();
        });

        await test.step(`Cделать ставку`, async () => {
            await page.mouse.wheel(0, 300);
            await cryptosGamePage.placeBet("0.1");
        });

        await test.step(`Открыть вкладку "Мои ставки"`, async () => {
            await authorizedInHousePage.liveWinsTabs().getByText('My bets').click();
        });

        await test.step(`Во вкладке "Мои ставки" отображаются ставки пользователя`, async () => {
            const countRow = await authorizedInHousePage.findCountRowsInLiveWinsTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const tableBlock = authorizedInHousePage.findUserInLiveWinsTableMyBets(i);
                const userInTable = await tableBlock.innerText();
                expect(userInTable).toEqual(loginUser);
            }
        });
    })

    test('FB-13 web.Отображение и анимация баннеров @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Проверить отображение баннеров`, async () => {
            expect(await authorizedInHousePage.gameBanners().count()).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Проверить отображение кнопок вперед и назад`, async () => {
            await authorizedInHousePage.gameBanners().first().hover()
            await expect(authorizedInHousePage.gameBannersPrevButton()).toBeVisible();
            await expect(authorizedInHousePage.gameBannersNextButton()).toBeVisible();
        });

        // await test.step(`Проверить смену баннеров`, async () => {
        //     expect(await authorizedInHousePage.gameBannersActive().count()).toBeGreaterThanOrEqual(1);
        //     const getCurrentIndexOfActiveBanner = await authorizedInHousePage.gameBannersActive().nth(0).getAttribute("data-index");
        //     await page.waitForTimeout(3000);
        //     const getIndexOfActiveBanner = await authorizedInHousePage.gameBannersActive().nth(0).getAttribute("data-index");
        //     expect(getCurrentIndexOfActiveBanner).not.toEqual(getIndexOfActiveBanner);
        // });
        // отключено временно 
    })

    test.skip('FB-16 Проверка ссылок баннеров @regression @prod @dev @web ', async ({ page, authorizedInHousePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Проверить отображение баннеров`, async () => {
            expect(await authorizedInHousePage.gameBanners().count()).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Кликнуть по баннеру Plinko и проверить переход на игру`, async () => {
            await authorizedInHousePage.gameBannerPlinko().click({ timeout: 8000 });
            expect(page.url()).toContain("/games/plinko");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Diver и проверить переход на игру`, async () => {
            await authorizedInHousePage.gameBannerDiver().click({ timeout: 8000 });
            expect(page.url()).toContain("/games/diver");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Sport и проверить переход на игру`, async () => {
            await authorizedInHousePage.gameBannerSports().click({ timeout: 8000 });
            expect(page.url()).toContain("/sport");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Original Games и проверить переход на игры`, async () => {
            await authorizedInHousePage.gameBannerOriginalGames().click({ timeout: 8000 });
            expect(page.url()).toContain("/slots/provider/InOut/filter/all");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Referal System и проверить переход на игры`, async () => {
            await authorizedInHousePage.gameBannerReferalSystem().click({ timeout: 8000 });
            expect(page.url()).toContain("/referral");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Games and Slots и проверить переход на игры`, async () => {
            await authorizedInHousePage.gameBannerGamesAndSlots().click({ timeout: 8000 });
            expect(page.url()).toContain("/slots");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Live Casino и проверить переход на игры`, async () => {
            await authorizedInHousePage.gameBannerLiveCasino().click({ timeout: 10000 });
            expect(page.url()).toContain("/slots?categories=live");
            await page.goBack({ waitUntil: 'load' });
        });

        await test.step(`Кликнуть по баннеру Live Casino и проверить переход на игры`, async () => {
            await authorizedInHousePage.gameBannerBrazilianTournament().click({ timeout: 8000 });
            expect(page.url()).toContain("/sport?bt-path");
        });
    })
})